import type { Editor, Range } from '@tiptap/core'
import { Extension } from '@tiptap/core'
import { VueRenderer } from '@tiptap/vue-3'
import Suggestion from '@tiptap/suggestion'
import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion'

import tippy from 'tippy.js'

import { CheckSquare, Code, Heading1, Heading2, Heading3, Image, List, ListOrdered, Text, TextQuote } from 'lucide-vue-next'

import ElSlashPanel from './ElSlashPanel.vue'
// import Magic from "../icons/magic.vue";

export interface SuggestionItem {
  title: string
  description: string
  icon: any
}

type CProps = {
  editor: Editor
  range: Range
  props: Record<string, any>

}

function getSuggestionItems({ query }: { query: string }) {
  return [
    // {
    //   title: 'Continue writing',
    //   description: 'Use AI to expand your thoughts.',
    //   searchTerms: ['gpt'],
    //   icon: Sparkles,
    // },
    // {
    //   title: 'Send Feedback',
    //   description: 'Let us know how we can improve.',
    //   icon: MessageSquarePlus,
    //   command: ({ editor, range }: CommandProps) => {
    //     editor.chain().focus().deleteRange(range).run()
    //     window.open('/feedback', '_blank')
    //   },
    // },
    {
      title: 'Image',
      description: 'Upload an image from your computer.',
      searchTerms: ['photo', 'picture', 'media'],
      icon: Image,
      command: ({ editor, range }: CProps) => {
        editor.chain().focus().deleteRange(range).insertContent({
          type: 'xImage',
          attrs: { /* attributes if any */ },
        }).run()
      },
    },
    {
      title: 'Quote',
      description: 'Capture a quote.',
      searchTerms: ['blockquote'],
      icon: TextQuote,
      command: ({ editor, range }: CProps) =>
        editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').toggleBlockquote().run(),
    },
    {
      title: 'Code',
      description: 'Capture a code snippet.',
      searchTerms: ['codeblock'],
      icon: Code,
      command: ({ editor, range }: CProps) =>
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },

    {
      title: 'Heading 1',
      description: 'Big section heading.',
      searchTerms: ['title', 'big', 'large'],
      icon: Heading1,
      command: ({ editor, range }: CProps) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
      },
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading.',
      searchTerms: ['subtitle', 'medium'],
      icon: Heading2,
      command: ({ editor, range }: CProps) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
      },
    },
    {
      title: 'Heading 3',
      description: 'Small section heading.',
      searchTerms: ['subtitle', 'small'],
      icon: Heading3,
      command: ({ editor, range }: CProps) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
      },
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list.',
      searchTerms: ['unordered', 'point'],
      icon: List,
      command: ({ editor, range }: CProps) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run()
      },
    },
    {
      title: 'Numbered List',
      description: 'Create a list with numbering.',
      searchTerms: ['ordered'],
      icon: ListOrdered,
      command: ({ editor, range }: CProps) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run()
      },
    },
    {
      title: 'Text',
      description: 'Just start typing with plain text.',
      searchTerms: ['p', 'paragraph'],
      icon: Text,
      command: ({ editor, range }: CProps) => {
        editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').run()
      },
    },

    {
      title: 'To-do List',
      description: 'Track tasks with a to-do list.',
      searchTerms: ['todo', 'task', 'list', 'check', 'checkbox'],
      icon: CheckSquare,
      command: ({ editor, range }: CProps) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run()
      },
    },
  ].filter((item) => {
    if (typeof query === 'string' && query.length > 0) {
      const search = query.toLowerCase()
      return (
        item.title.toLowerCase().includes(search)
        || item.description.toLowerCase().includes(search)
        || (item.searchTerms
        && item.searchTerms.some((term: string) => term.includes(search)))
      )
    }
    return true
  })
}

const SlashCommand = Extension.create({
  name: 'slash-command',
  addProseMirrorPlugins() {
    return [
      Suggestion({
        char: '/',
        items: getSuggestionItems,
        editor: this.editor,
        command: (_) => {
          _.props.command(_)
        },
        render: () => {
          let component: VueRenderer | null = null
          let popup: any | null = null

          return {
            onStart: (props: SuggestionProps) => {
              component = new VueRenderer(ElSlashPanel, { props, editor: props.editor })

              const domRect = props.clientRect?.()
              if (!domRect)
                return
              const content = component.element

              if (!content)
                throw new Error('No content element')

              popup = tippy('body', {
                getReferenceClientRect: () => domRect,
                appendTo: () => document.body,
                content,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              })
            },
            onUpdate: (props: SuggestionProps) => {
              component?.updateProps(props)
              if (popup) {
                popup[0].setProps({ getReferenceClientRect: props.clientRect })
              }
            },
            onKeyDown: (props: SuggestionKeyDownProps) => {
              if (props.event.key === 'Escape') {
                popup?.[0].hide()

                return true
              }

              return component?.ref?.onKeyDown(props.event)
            },
            onExit: (_props: SuggestionProps) => {
              popup?.[0].destroy()
              component?.destroy()
            },
          } as const
        },
      }),
    ]
  },
})

export default SlashCommand
