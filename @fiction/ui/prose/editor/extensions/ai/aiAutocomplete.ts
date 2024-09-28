import type { FictionAi } from '@fiction/plugins/plugin-ai'
import type { Editor, Node } from '@tiptap/core'
import { debounce, log } from '@fiction/core'
import { onBrowserEvent } from '@fiction/core/utils/eventBrowser'
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { type EditorSupplementary, generateAutocompleteObjectives, shouldSuggest } from '../../utils/editor'

const logger = log.contextLogger('AutocompleteExtension')

const PLUGIN_KEY = new PluginKey<DecorationSet>('suggestion')

interface AutocompleteOptions {
  applySuggestionKey: string
  suggestionDebounce: number
  previousTextLength: number
  getSuggestion: (args: {
    previousText: string
    nextText: string
    fictionAi?: FictionAi
    supplemental: EditorSupplementary
    editor: Editor
  }) => Promise<string | undefined>
  fictionAi?: FictionAi
  supplemental?: EditorSupplementary
}

export const AutocompleteExtension = Extension.create<AutocompleteOptions>({
  name: 'autocomplete',

  addOptions() {
    return {
      applySuggestionKey: 'Tab',
      suggestionDebounce: 1500,
      previousTextLength: 4000,
      supplemental: undefined,
      getSuggestion: async (args: {
        previousText: string
        nextText: string
        fictionAi?: FictionAi
        supplemental: EditorSupplementary
        editor: Editor
      }) => {
        const { previousText, nextText, fictionAi, supplemental = {} } = args

        const shouldSuggestResult = shouldSuggest({ previousText, nextText })
        if (shouldSuggestResult.status !== 'success')
          return

        const supplementalObjectives = generateAutocompleteObjectives(supplemental)

        const r = await fictionAi?.requests.AiCompletion.projectRequest({
          _action: 'completion',
          objectives: {
            nextText: `the autocomplete text is followed by: "${args.nextText}"`,
            previousText: `continue from previous text: "${previousText}"`,
            ...supplementalObjectives,
          },
          runPrompt: 'Create short autocompletions for previous text and reference info',
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
      const { supplemental = {}, fictionAi } = options

      if (!isWindowFocused)
        return

      const suggestion = await options.getSuggestion({ editor: this.editor, previousText, nextText, fictionAi, supplemental })
      if (suggestion)
        cb(suggestion)
    }, options.suggestionDebounce)

    const removeSuggestion = (view: any) => {
      const { state } = view
      view.dispatch(state.tr.setMeta(PLUGIN_KEY, { decorations: DecorationSet.empty }).setMeta('addToHistory', false))
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
            if (event.key === options.applySuggestionKey) {
              const decorations = PLUGIN_KEY.getState(view.state)
              if (decorations?.find().length) {
                const suggestionEl = document.querySelector('.autocomplete-suggestion') as HTMLElement
                if (suggestionEl) {
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

              // Remove suggestion if content changed or cursor moved
              if (prevState
                && (!prevState.doc.eq(state.doc)
                  || !prevState.selection.eq(state.selection))) {
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
                  const charBeforeCursor = view.state.doc.textBetween(Math.max(0, cursorPos - 1), cursorPos)

                  // Only add a leading space to the suggestion if there isn't already a space before the cursor
                  if (![' ', '\n'].includes(charBeforeCursor) && !suggestion.startsWith(' ')) {
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
