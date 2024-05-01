import { type NavItem, onResetUi, vue } from '@fiction/core'
import type { Editor } from '@tiptap/core'
import BubbleLinkMenu from './BubbleLinkMenu.vue'

export type MenuType = 'text' | 'image' | 'none'
export class BubbleMenuTools {
  subMenu = vue.ref()
  e: Editor
  selectedMenu = vue.ref<MenuType>('text')
  focusEl = vue.ref<HTMLElement>()

  constructor(args: { editor: Editor }) {
    const { editor } = args
    this.e = editor

    onResetUi(() => {
      this.subMenu.value = undefined
    })

    this.e.on('selectionUpdate', () => {
      setTimeout(() => {
        this.focusEl.value = (this.e.view.dom.querySelector('.has-focus') as HTMLElement) || undefined
        this.selectedMenu.value = this.focusEl.value?.dataset.menu as MenuType || 'text'
      }, 10)
    })
  }

  activeMenu = vue.computed(() => {
    switch (this.selectedMenu.value) {
      case 'image':
        return this.imageMenu()
      case 'none':
        return []
      default:
        return this.textMenu()
    }
  })

  textMenu(): NavItem[] {
    return [
      ...this.textFormatting(),
      ...this.headings(),
      ...this.link(),
      ...this.align(),
    ]
  }

  imageMenu(): NavItem[] {
    return [
      ...this.link(),
    ]
  }

  textFormatting(): NavItem[] {
    return [
      {
        name: 'bold',
        isActive: this.e.isActive('bold'),
        icon: 'i-tabler-bold',
        onClick: () => this.e.chain().focus().toggleBold().run(),
      },
      {
        name: 'italic',
        isActive: this.e.isActive('italic'),
        icon: 'i-tabler-italic',
        onClick: () => this.e.chain().focus().toggleItalic().run(),
      },
      {
        name: 'strike',
        isActive: this.e.isActive('strike'),
        icon: 'i-tabler-strikethrough',
        onClick: () => this.e.chain().focus().toggleStrike().run(),
      },
      {
        name: 'highlight',
        isActive: this.e.isActive('highlight'),
        icon: 'i-tabler-highlight',
        onClick: () => this.e.chain().focus().toggleHighlight().run(),
      },
    ]
  }

  headings(): NavItem[] {
    return [{
      name: 'heading',
      isActive: this.subMenu.value === 'heading',
      icon: 'i-tabler-heading',
      onClick: ({ item }) => this.subMenu.value = item?.name,
      items: [
        {
          name: 'heading-h1',
          isActive: this.e.isActive('heading', { level: 1 }) || false,
          icon: 'i-ci-heading-h1',
          onClick: () => this.e.chain().focus().toggleHeading({ level: 1 }).run(),
        },
        {
          name: 'heading-h2',
          isActive: this.e.isActive('heading', { level: 2 }) || false,
          icon: 'i-ci-heading-h2',
          onClick: () => this.e.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
          name: 'heading-h3',
          isActive: this.e.isActive('heading', { level: 3 }) || false,
          icon: 'i-ci-heading-h3',
          onClick: () => this.e.chain().focus().toggleHeading({ level: 3 }).run(),
        },
        {
          name: 'heading-h4',
          isActive: this.e.isActive('heading', { level: 4 }) || false,
          icon: 'i-ci-heading-h4',
          onClick: () => this.e.chain().focus().toggleHeading({ level: 4 }).run(),
        },
        {
          name: 'heading-h5',
          isActive: this.e.isActive('heading', { level: 5 }) || false,
          icon: 'i-ci-heading-h5',
          onClick: () => this.e.chain().focus().toggleHeading({ level: 5 }).run(),
        },
        {
          name: 'heading-h6',
          isActive: this.e.isActive('heading', { level: 6 }) || false,
          icon: 'i-ci-heading-h6',
          onClick: () => this.e.chain().focus().toggleHeading({ level: 6 }).run(),
        },
        {
          name: 'paragraph',
          isActive: this.e.isActive('paragraph') || false,
          icon: 'i-ci-paragraph',
          onClick: () => this.e.chain().focus().setParagraph().run(),
        },
      ],
    }]
  }

  link(): NavItem[] {
    return [{
      name: 'link',
      isActive: this.subMenu.value === 'link',
      icon: 'i-tabler-link',
      onClick: ({ item }) => this.subMenu.value = item?.name,
      items: [
        {
          name: 'linkInput',
          icon: 'i-tabler-link',
          figure: {
            el: BubbleLinkMenu,
            props: {
              'onUpdate:modelValue': () => {
                this.subMenu.value = undefined
              },
              'modelValue': { href: this.e.getAttributes('link').href || '' },
            },
          },
        },
        {
          name: 'linkTrash',
          icon: 'i-tabler-trash',
          onClick: () => {
            this.e.chain().focus().unsetLink().run()
            this.subMenu.value = undefined
          },
        },
      ],
    }]
  }

  align(): NavItem[] {
    return [{
      name: 'align',
      isActive: this.subMenu.value === 'align',
      icon: 'i-tabler-align-left',
      onClick: ({ item }) => this.subMenu.value = item?.name,
      items: [
        {
          name: 'left',
          isActive: this.e.isActive({ textAlign: 'left' }),
          icon: 'i-tabler-align-left',
          onClick: () => this.e.chain().focus().setTextAlign('left').run(),
        },
        {
          name: 'center',
          isActive: this.e.isActive({ textAlign: 'center' }),
          icon: 'i-tabler-align-center',
          onClick: () => this.e.chain().focus().setTextAlign('center').run(),
        },
        {
          name: 'right',
          isActive: this.e.isActive({ textAlign: 'right' }),
          icon: 'i-tabler-align-right',
          onClick: () => this.e.chain().focus().setTextAlign('right').run(),
        },
        {
          name: 'justify',
          isActive: this.e.isActive({ textAlign: 'justify' }),
          icon: 'i-tabler-align-justified',
          onClick: () => this.e.chain().focus().setTextAlign('justify').run(),
        },
      ],
    }]
  }
}
