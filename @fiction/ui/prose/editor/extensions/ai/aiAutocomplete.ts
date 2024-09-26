import type { FictionAi } from '@fiction/plugins/plugin-ai'
import { debounce } from '@fiction/core'
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

const PLUGIN_KEY = new PluginKey<DecorationSet>('suggestion')

interface AutocompleteOptions {
  applySuggestionKey: string
  suggestionDebounce: number
  previousTextLength: number
  getSuggestion: (args: { previousText: string, fictionAi?: FictionAi }) => Promise<string | undefined>
  fictionAi?: FictionAi
}

export const AutocompleteExtension = Extension.create<AutocompleteOptions>({
  name: 'autocomplete',

  addOptions() {
    return {
      applySuggestionKey: 'Tab',
      suggestionDebounce: 1500,
      previousTextLength: 4000,
      getSuggestion: async (args: { previousText: string, fictionAi?: FictionAi }) => {
        const { previousText, fictionAi } = args

        if (previousText.length < 10 || previousText.trim().endsWith('/'))
          return

        const r = await fictionAi?.requests.AiCompletion.projectRequest({
          _action: 'completion',
          objectives: {
            previousText: `continue from previous text: ${previousText}`,
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

    const debouncedSuggestion = debounce(async (previousText: string, cb: (suggestion: string | null) => void) => {
      // Replace this with your actual API call
      const suggestion = await options.getSuggestion({ previousText, fictionAi: options.fictionAi })
      if (suggestion)
        cb(suggestion)
    }, options.suggestionDebounce)

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
            return false
          },
        },
        view(editorView) {
          return {
            update(view, prevState) {
              const { state } = view
              const selection = state.selection
              const cursorPos = selection.$head.pos

              if (prevState && prevState.doc.eq(state.doc)) {
                return
              }

              // Reset suggestion
              view.dispatch(state.tr.setMeta(PLUGIN_KEY, { decorations: DecorationSet.empty }))

              // Fetch new suggestion
              const previousText = state.doc.textBetween(
                Math.max(0, cursorPos - options.previousTextLength),
                cursorPos,
                ' ',
              )
              debouncedSuggestion(previousText, (suggestion: string | null) => {
                if (!suggestion)
                  return

                const decoration = Decoration.widget(cursorPos, () => {
                  const span = document.createElement('span')
                  span.textContent = suggestion.startsWith(' ') ? suggestion : ` ${suggestion}`
                  span.className = 'autocomplete-suggestion'
                  return span
                }, { side: 1 })

                const decorations = DecorationSet.create(state.doc, [decoration])
                view.dispatch(state.tr.setMeta(PLUGIN_KEY, { decorations }).setMeta('addToHistory', false))
              })
            },
          }
        },
      }),
    ]
  },
})
