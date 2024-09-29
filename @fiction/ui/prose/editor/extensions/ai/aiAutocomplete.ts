import type { FictionAi } from '@fiction/plugins/plugin-ai'
import type { Editor } from '@tiptap/core'
import { debounce, log } from '@fiction/core'
import { onBrowserEvent } from '@fiction/core/utils/eventBrowser'
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { type EditorSupplementary, generateAutocompleteObjectives, shouldSuggest } from '../../utils/editor'

const logger = log.contextLogger('AutocompleteExtension')

const PLUGIN_KEY = new PluginKey<DecorationSet>('suggestion')

interface AutocompleteOptions {
  applySuggestionKey: string[]
  suggestionDebounce: number
  previousTextLength: number
  cooldownAfterHandled: number
  lastHandledTimestamp: number
  getSuggestion: (args: {
    previousText: string
    nextText: string
    fictionAi?: FictionAi
    supplemental: EditorSupplementary
    editor: Editor
  }) => Promise<string | undefined>
  fictionAi?: FictionAi
  getSupplemental?: () => EditorSupplementary
  checkContentCompletionDisabled?: () => boolean
}

export const AutocompleteExtension = Extension.create<AutocompleteOptions>({
  name: 'autocomplete',

  addOptions() {
    return {
      applySuggestionKey: ['Tab', 'ArrowRight', 'ArrowDown'],
      suggestionDebounce: 1500,
      previousTextLength: 4000,
      cooldownAfterHandled: 3000, // Cooldown period after suggestion is handled (10 seconds)
      lastHandledTimestamp: 0, // Timestamp of the last suggestion handled
      getSupplemental: undefined,
      checkContentCompletionDisabled: () => false,
      getSuggestion: async (args: {
        previousText: string
        nextText: string
        fictionAi?: FictionAi
        supplemental: EditorSupplementary
        editor: Editor
      }) => {
        const { previousText, nextText, fictionAi, supplemental = {} } = args

        const shouldSuggestResult = shouldSuggest({ previousText, nextText })
        logger.info('shouldSuggestResult', { data: shouldSuggestResult })
        if (shouldSuggestResult.status !== 'success') {
          return
        }

        const supplementalObjectives = generateAutocompleteObjectives(supplemental)

        const r = await fictionAi?.requests.AiCompletion.projectRequest({
          _action: 'completion',
          objectives: {
            nextText: `[cursor] is followed by: "${args.nextText}"`,
            previousText: `[cursor] is preceeded by: "${previousText}"`,
            ...supplementalObjectives,
          },
          runPrompt: `Autocomplete based on location of [cursor] in the following "${previousText}[cursor]${nextText}"`,
          format: 'contentAutocomplete',
        })

        if (r?.status === 'success' && r.data?.completion) {
          const suggestions = Object.values(r.data.completion) as string[]
          return suggestions[0]
        }
      },
      fictionAi: undefined,
    }
  },

  addProseMirrorPlugins() {
    const options = this.options

    let isWindowFocused = !document.hidden

    const cleanups = [
      onBrowserEvent('focus', () => { isWindowFocused = true }),
      onBrowserEvent('blur', () => { isWindowFocused = false }),
      onBrowserEvent('visibilitychange', () => { isWindowFocused = !document.hidden }),
    ]

    const debouncedSuggestion = debounce(async (args: { previousText: string, nextText: string }, cb: (suggestion: string | null) => void) => {
      const { previousText, nextText } = args
      const { fictionAi } = options
      const menuActive = this.editor.view.dom.classList.contains('slash-menu-active')

      if (!isWindowFocused || menuActive)
        return

      const supplemental = options.getSupplemental?.() || {}

      const suggestion = await options.getSuggestion({ editor: this.editor, previousText, nextText, fictionAi, supplemental })
      if (suggestion)
        cb(suggestion)
    }, () => {
      const timeSinceLastHandled = Date.now() - options.lastHandledTimestamp
      const debounceTime = timeSinceLastHandled < options.cooldownAfterHandled ? options.cooldownAfterHandled : options.suggestionDebounce

      return debounceTime
    })

    const setLastHandledTimestamp = (_args: { caller: string }) => {
      options.lastHandledTimestamp = Date.now()
    }

    const hasSuggestion = (view: any) => {
      const { state } = view
      return !!PLUGIN_KEY.getState(state)?.find().length
    }

    const removeSuggestion = (view: any) => {
      const { state } = view
      view.dispatch(state.tr.setMeta(PLUGIN_KEY, { decorations: DecorationSet.empty }).setMeta('addToHistory', false))

      if (hasSuggestion(view))
        setLastHandledTimestamp({ caller: 'removeSuggestion' })
    }

    return [
      new Plugin({
        key: PLUGIN_KEY,
        state: {
          init() {
            return DecorationSet.empty
          },
          apply(tr, oldState) {
            const meta = tr.getMeta(PLUGIN_KEY)
            if (meta) {
              return meta.decorations
            }
            return tr.docChanged ? oldState.map(tr.mapping, tr.doc) : oldState
          },
        },
        props: {
          decorations(state) {
            return PLUGIN_KEY.getState(state)
          },
          handleKeyDown(view, event) {
            if (options.applySuggestionKey.includes(event.key)) {
              const decorations = PLUGIN_KEY.getState(view.state)
              if (decorations?.find().length) {
                const suggestionEl = document.querySelector('.autocomplete-suggestion') as HTMLElement
                if (suggestionEl) {
                  setLastHandledTimestamp({ caller: 'handleKeyDown' })

                  const suggestion = suggestionEl.textContent || ''
                  const { tr } = view.state
                  tr.insertText(suggestion)
                  tr.setMeta(PLUGIN_KEY, { decorations: DecorationSet.empty })
                  view.dispatch(tr)

                  return true
                }
              }
            }
            if (event.key === 'Escape') {
              removeSuggestion(view)
              return true
            }
            return false
          },
          handleClick(view) {
            // Remove suggestion on any click
            removeSuggestion(view)
            return false
          },
        },
        view() {
          return {

            update(view, prevState) {
              const { state } = view
              const selection = state.selection
              const cursorPos = selection.$head.pos

              if (options.checkContentCompletionDisabled?.()) {
                return
              }

              // Remove suggestion if content changed or cursor moved
              if ((prevState && (!prevState.doc.eq(state.doc) || !prevState.selection.eq(state.selection)))) {
                removeSuggestion(view)
                return
              }

              // if not in a paragraph or heading, don't suggest
              // Get the current node type
              const currentNode = selection.$head.parent
              const currentNodeType = currentNode.type.name
              const allowedNodeTypes = ['paragraph', 'list_item', 'blockquote']

              if (!allowedNodeTypes.includes(currentNodeType)) {
                return false
              }

              // Only proceed if there's no current suggestion
              if (PLUGIN_KEY.getState(state)?.find().length) {
                return
              }

              // Fetch new suggestion
              const previousText = state.doc.textBetween(
                Math.max(0, cursorPos - options.previousTextLength),
                cursorPos,
                '\n', // Use newline as block separator
              )

              const nextText = state.doc.textBetween(
                cursorPos,
                Math.min(state.doc.content.size, cursorPos + 200),
                '\n',
              )

              debouncedSuggestion({ previousText, nextText }, (suggestion: string | null) => {
                if (!suggestion)
                  return

                const decoration = Decoration.widget(cursorPos, () => {
                  const span = document.createElement('span')

                  if (!suggestion) {
                    return span
                  }
                  const lastChar = view.state.doc.textBetween(Math.max(0, cursorPos - 1), cursorPos)

                  // Only add a leading space to the suggestion if there isn't already a space before the cursor
                  if (lastChar && lastChar !== ' ' && lastChar !== '\n' && !suggestion.startsWith(' ')) {
                    suggestion = ` ${suggestion}`
                  }

                  span.textContent = suggestion
                  span.className = 'autocomplete-suggestion'
                  return span
                }, { side: 1 })

                const decorations = DecorationSet.create(state.doc, [decoration])
                view.dispatch(state.tr.setMeta(PLUGIN_KEY, { decorations }).setMeta('addToHistory', false))
              })
            },
            destroy() {
              cleanups.forEach(cleanup => cleanup())
            },
          }
        },

      }),
    ]
  },
})
