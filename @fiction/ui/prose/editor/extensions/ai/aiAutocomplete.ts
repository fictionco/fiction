import type { FictionAi } from '@fiction/plugin-ai'
import type { Editor } from '@tiptap/core'
import type { EditorSupplementary } from '../../utils/editor'
import { debounce, log } from '@fiction/core'
import { onBrowserEvent } from '@fiction/core/utils/eventBrowser'
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { generateAutocompleteObjectives, shouldSuggest } from '../../utils/editor'

const logger = log.contextLogger('AutocompleteExtension')

const PLUGIN_KEY = new PluginKey<DecorationSet>('suggestion')

interface AutocompleteOptions {
  applySuggestionKey: string[]
  suggestionDebounce: number
  previousTextLength: number
  cooldownAfterHandled: number
  lastHandledTimestamp: number
  hoverToApply: boolean
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
      cooldownAfterHandled: 3000, // Cooldown period after suggestion is handled
      lastHandledTimestamp: 0, // Timestamp of the last suggestion handled
      hoverToApply: true, // Enable hover to highlight suggestion
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

  // Plugin doesn't have direct access to storage in all contexts,
  // so we'll use regular plugin functions instead

  addProseMirrorPlugins() {
    const options = this.options
    let isWindowFocused = typeof document !== 'undefined' ? !document.hidden : true
    let lastEditorFocused = true

    const debouncedSuggestion = debounce(async (args: { previousText: string, nextText: string }, cb: (suggestion: string | null) => void) => {
      const { previousText, nextText } = args
      const { fictionAi } = options

      // Don't suggest if window is not focused or menu is active
      if (!isWindowFocused || !lastEditorFocused
        || this.editor.view.dom.classList.contains('slash-menu-active')) {
        return
      }

      const supplemental = options.getSupplemental?.() || {}

      const suggestion = await options.getSuggestion({
        editor: this.editor,
        previousText,
        nextText,
        fictionAi,
        supplemental,
      })

      if (suggestion)
        cb(suggestion)
    }, () => {
      const timeSinceLastHandled = Date.now() - options.lastHandledTimestamp
      return timeSinceLastHandled < options.cooldownAfterHandled
        ? options.cooldownAfterHandled
        : options.suggestionDebounce
    })

    // Set up event listeners for window/document focus tracking
    // Functions for suggestion handling
    const hasSuggestion = (view: any) => {
      const { state } = view
      return !!PLUGIN_KEY.getState(state)?.find().length
    }

    const removeSuggestion = (view: any) => {
      if (!view)
        return

      const { state } = view
      view.dispatch(
        state.tr
          .setMeta(PLUGIN_KEY, { decorations: DecorationSet.empty })
          .setMeta('addToHistory', false),
      )
    }

    const applySuggestion = (view: any) => {
      if (!view || !hasSuggestion(view))
        return false

      const suggestionEl = document.querySelector('.autocomplete-suggestion') as HTMLElement
      if (!suggestionEl)
        return false

      options.lastHandledTimestamp = Date.now()

      const suggestion = suggestionEl.textContent || ''
      const { tr } = view.state
      tr.insertText(suggestion)
      tr.setMeta(PLUGIN_KEY, { decorations: DecorationSet.empty })
      view.dispatch(tr)

      return true
    }

    const cleanups = [
      onBrowserEvent('focus', () => {
        isWindowFocused = true
      }),
      onBrowserEvent('blur', () => {
        isWindowFocused = false
        // Clear suggestion when window loses focus
        if (this.editor?.view)
          removeSuggestion(this.editor.view)
      }),
      onBrowserEvent('visibilitychange', () => {
        const wasVisible = isWindowFocused
        isWindowFocused = !document.hidden

        // Clear suggestion when document becomes hidden
        if (wasVisible && document.hidden && this.editor?.view) {
          removeSuggestion(this.editor.view)
        }
      }),
    ]

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
          handleDOMEvents: {
            blur(view) {
              lastEditorFocused = false
              // Remove suggestion when editor loses focus
              removeSuggestion(view)
              return false
            },
            focus() {
              lastEditorFocused = true
              return false
            },
          },
          handleKeyDown(view, event) {
            // Apply suggestion with configured keys
            if (options.applySuggestionKey.includes(event.key)) {
              if (applySuggestion(view)) {
                return true
              }
            }

            // Dismiss suggestion with Escape
            if (event.key === 'Escape') {
              if (hasSuggestion(view)) {
                removeSuggestion(view)
                return true
              }
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

              // Remove suggestion if window is not focused
              if (!isWindowFocused || !lastEditorFocused) {
                removeSuggestion(view)
                return
              }

              // Check if content completion is disabled
              if (options.checkContentCompletionDisabled?.()) {
                removeSuggestion(view)
                return
              }

              // Remove suggestion if content changed or cursor moved
              if (prevState && (!prevState.doc.eq(state.doc) || !prevState.selection.eq(state.selection))) {
                removeSuggestion(view)
                return
              }

              // Get the current node type
              const currentNode = selection.$head.parent
              const currentNodeType = currentNode.type.name
              const allowedNodeTypes = ['paragraph', 'list_item', 'blockquote', 'heading']

              // Only suggest in allowed node types
              if (!allowedNodeTypes.includes(currentNodeType)) {
                return
              }

              // Only proceed if there's no current suggestion
              if (PLUGIN_KEY.getState(state)?.find().length) {
                return
              }

              // Fetch text before and after cursor for context
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

              // Generate suggestion
              debouncedSuggestion({ previousText, nextText }, (suggestion: string | null) => {
                if (!suggestion)
                  return

                const decoration = Decoration.widget(cursorPos, () => {
                  const span = document.createElement('span')

                  if (!suggestion) {
                    return span
                  }

                  const lastChar = view.state.doc.textBetween(
                    Math.max(0, cursorPos - 1),
                    cursorPos,
                  )

                  // Add leading space if needed
                  if (lastChar
                    && lastChar !== ' '
                    && lastChar !== '\n'
                    && !suggestion.startsWith(' ')) {
                    suggestion = ` ${suggestion}`
                  }

                  span.textContent = suggestion
                  span.className = 'autocomplete-suggestion'

                  // Add hover functionality
                  if (options.hoverToApply) {
                    span.classList.add('suggestion-hover-enabled')

                    // Add click handler to apply suggestion
                    span.addEventListener('click', () => {
                      applySuggestion(view)
                    })
                  }

                  return span
                }, { side: 1 })

                const decorations = DecorationSet.create(state.doc, [decoration])
                view.dispatch(
                  state.tr
                    .setMeta(PLUGIN_KEY, { decorations })
                    .setMeta('addToHistory', false),
                )
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
