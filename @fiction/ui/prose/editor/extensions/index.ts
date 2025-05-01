import type { FictionAi } from '@fiction/plugin-ai'
import type { Extensions } from '@tiptap/core'
import type { EditorSupplementary } from '../utils/editor'
import { InputRule } from '@tiptap/core'
import CodeBlock from '@tiptap/extension-code-block'
// import Focus from '@tiptap/extension-focus'
import HighlightText from '@tiptap/extension-highlight'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import ImageUrl from '@tiptap/extension-image'
import TextLink from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { TaskItem } from '@tiptap/extension-task-item'
import { TaskList } from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import TextUnderline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import AutoJoiner from 'tiptap-extension-auto-joiner'
import { AutocompleteExtension } from './ai/aiAutocomplete'
import CustomDragHangle from './handle'
import { xImage } from './image'

export function getExtensions(args: {
  fictionAi: FictionAi
  getSupplemental: () => EditorSupplementary
  checkContentCompletionDisabled: () => boolean
}): Extensions {
  const { fictionAi, getSupplemental, checkContentCompletionDisabled } = args
  return [
    xImage,
    CustomDragHangle,
    AutocompleteExtension.configure({
      fictionAi,
      getSupplemental,
      checkContentCompletionDisabled,
    }),
    StarterKit.configure({
      codeBlock: false,
      horizontalRule: false,
      dropcursor: { width: 2, class: 'rounded-lg text-theme-500 opacity-40 border-dashed' },
    }),

    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'heading') {
          return 'Enter heading...'
        }
        else if (node.type.name === 'codeBlock') {
          return 'Enter code...'
        }

        return 'Start writing...'
      },
    }),

    TaskList.configure({ HTMLAttributes: { class: 'not-prose pl-2' } }),
    TaskItem.configure({ HTMLAttributes: { class: 'flex items-start my-4' }, nested: true }),
    Superscript,
    Subscript,
    CodeBlock,
    TextStyle,
    TextUnderline,
    ImageUrl,
    HighlightText,
    TextLink,
    AutoJoiner, // improves list handling
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      defaultAlignment: 'left',
      alignments: ['left', 'center', 'right', 'justify'],
    }),
    HorizontalRule.extend({
      addInputRules() {
        return [
          new InputRule({
            find: /^(?:---|—-|___\s|\*\*\*\s)$/u,
            handler: ({ state, range }) => {
              const attributes = {}

              const { tr } = state
              const start = range.from
              const end = range.to

              tr.insert(start - 1, this.type.create(attributes)).delete(
                tr.mapping.map(start),
                tr.mapping.map(end),
              )
            },
          }),
        ]
      },

    }).configure({ HTMLAttributes: { class: 'mt-4 mb-6 border-t border-theme-300 dark:border-theme-700' } }),

  ]
}
