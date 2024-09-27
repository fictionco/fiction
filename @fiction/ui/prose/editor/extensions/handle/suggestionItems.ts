import type { Editor, Range } from '@tiptap/core'
import { CheckSquare, Code, Heading1, Heading2, Heading3, Image, List, ListOrdered, Text, TextQuote } from 'lucide-vue-next'

export interface SuggestionItem {
  title: string
  description: string
  icon: any
  command: (props: { editor: Editor, range: Range }) => void
}

export function getSuggestionItems({ query }: { query: string }) {
  const items: SuggestionItem[] = [
    {
      title: 'Image',
      description: 'Upload an image from your computer.',
      icon: Image,
      command: ({ editor, range }) => {
        editor.chain().focus(null, { scrollIntoView: false }).insertContent({
          type: 'xImage',
          attrs: { /* attributes if any */ },
        }).run()
      },
    },
    {
      title: 'Quote',
      description: 'Capture a quote.',
      icon: TextQuote,
      command: ({ editor, range }) => editor.chain().focus(null, { scrollIntoView: false }).toggleNode('paragraph', 'paragraph').toggleBlockquote().run(),
    },
    {
      title: 'Code',
      description: 'Capture a code snippet.',
      icon: Code,
      command: ({ editor, range }) => editor.chain().focus(null, { scrollIntoView: false }).toggleCodeBlock().run(),

    },
    {
      title: 'Heading 1',
      description: 'Big section heading.',
      icon: Heading1,
      command: ({ editor, range }) => editor.chain().focus(null, { scrollIntoView: false }).toggleHeading({ level: 1 }).run(),
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading.',
      icon: Heading2,
      command: ({ editor, range }) => editor.chain().focus(null, { scrollIntoView: false }).toggleHeading({ level: 2 }).run(),
    },
    {
      title: 'Heading 3',
      description: 'Small section heading.',
      icon: Heading3,
      command: ({ editor, range }) => editor.chain().focus(null, { scrollIntoView: false }).toggleHeading({ level: 3 }).run(),
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list.',
      icon: List,
      command: ({ editor, range }) => editor.chain().focus(null, { scrollIntoView: false }).toggleBulletList().run(),
    },
    {
      title: 'Numbered List',
      description: 'Create a list with numbering.',
      icon: ListOrdered,
      command: ({ editor, range }) => editor.chain().focus(null, { scrollIntoView: false }).toggleOrderedList().run(),
    },
    {
      title: 'Text',
      description: 'Just start typing with plain text.',
      icon: Text,
      command: ({ editor, range }) => editor.chain().focus(null, { scrollIntoView: false }).toggleNode('paragraph', 'paragraph').run(),
    },
    {
      title: 'To-do List',
      description: 'Track tasks with a to-do list.',
      icon: CheckSquare,
      command: ({ editor, range }) => editor.chain().focus(null, { scrollIntoView: false }).toggleTaskList().run(),
    },
  ]

  if (typeof query === 'string' && query.length > 0) {
    const search = query.toLowerCase()
    return items.filter(item =>
      item.title.toLowerCase().includes(search)
      || item.description.toLowerCase().includes(search),
    )
  }

  return items
}
