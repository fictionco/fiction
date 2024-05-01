<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import type { Selection } from '@tiptap/pm/state'
import type { NavItem } from '@fiction/core'
import { onResetUi, vue } from '@fiction/core'
import BubbleMenuEngine from './BubbleMenuEngine.vue'
import BubbleLinkMenu from './BubbleLinkMenu.vue'

const props = defineProps({
  editor: { type: Object as vue.PropType<Editor>, required: true },
})

const bubbleSubMenu = vue.ref<string>()

onResetUi(() => {
  bubbleSubMenu.value = undefined
})

const bubbleMenuButtons = vue.computed<NavItem[]>(() => {
  const e = props.editor

  if (!e)
    return []

  const element = e.view.domAtPos(e.state.selection.from)
  console.log('STATE', element)

  return [
    {
      name: 'heading',
      isActive: bubbleSubMenu.value === 'heading',
      icon: 'i-tabler-heading',
      onClick: ({ item }) => bubbleSubMenu.value = item?.name,
      items: [
        {
          name: 'heading-h1',
          isActive: e.isActive('heading', { level: 1 }) || false,
          icon: 'i-ci-heading-h1',
          onClick: () => e.chain().focus().toggleHeading({ level: 1 }).run(),
        },
        {
          name: 'heading-h2',
          isActive: e.isActive('heading', { level: 2 }) || false,
          icon: 'i-ci-heading-h2',
          onClick: () => e.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
          name: 'heading-h3',
          isActive: e.isActive('heading', { level: 3 }) || false,
          icon: 'i-ci-heading-h3',
          onClick: () => e.chain().focus().toggleHeading({ level: 3 }).run(),
        },
        {
          name: 'heading-h4',
          isActive: e.isActive('heading', { level: 4 }) || false,
          icon: 'i-ci-heading-h4',
          onClick: () => e.chain().focus().toggleHeading({ level: 4 }).run(),
        },
        {
          name: 'heading-h5',
          isActive: e.isActive('heading', { level: 5 }) || false,
          icon: 'i-ci-heading-h5',
          onClick: () => e.chain().focus().toggleHeading({ level: 5 }).run(),
        },
        {
          name: 'heading-h6',
          isActive: e.isActive('heading', { level: 6 }) || false,
          icon: 'i-ci-heading-h6',
          onClick: () => e.chain().focus().toggleHeading({ level: 6 }).run(),
        },
        {
          name: 'paragraph',
          isActive: e.isActive('paragraph') || false,
          icon: 'i-ci-paragraph',
          onClick: () => e.chain().focus().setParagraph().run(),
        },
      ],
    },

    {
      name: 'bold',
      isActive: e.isActive('bold'),
      icon: 'i-tabler-bold',
      onClick: () => e.chain().focus().toggleBold().run(),
    },
    {
      name: 'italic',
      isActive: e.isActive('italic'),
      icon: 'i-tabler-italic',
      onClick: () => e.chain().focus().toggleItalic().run(),
    },
    {
      name: 'strike',
      isActive: e.isActive('strike'),
      icon: 'i-tabler-strikethrough',
      onClick: () => e.chain().focus().toggleStrike().run(),
    },
    {
      name: 'highlight',
      isActive: e.isActive('highlight'),
      icon: 'i-tabler-highlight',
      onClick: () => e.chain().focus().toggleHighlight().run(),
    },
    {
      name: 'link',
      isActive: bubbleSubMenu.value === 'link',
      icon: 'i-tabler-link',
      onClick: ({ item }) => bubbleSubMenu.value = item?.name,
      items: [
        {
          name: 'linkInput',
          icon: 'i-tabler-link',
          figure: {
            el: BubbleLinkMenu,
            props: {
              'onUpdate:modelValue': () => {
                bubbleSubMenu.value = undefined
              },
              'modelValue': { href: e.getAttributes('link').href || '' },
            },
          },
        },
        {
          name: 'linkTrash',
          icon: 'i-tabler-trash',
          onClick: () => {
            e.chain().focus().unsetLink().run()
            bubbleSubMenu.value = undefined
          },
        },
      ],
    },
    {
      name: 'align',
      isActive: bubbleSubMenu.value === 'align',
      icon: 'i-tabler-align-left',
      onClick: ({ item }) => bubbleSubMenu.value = item?.name,
      items: [
        {
          name: 'left',
          isActive: e.isActive({ textAlign: 'left' }),
          icon: 'i-tabler-align-left',
          onClick: () => e.chain().focus().setTextAlign('left').run(),
        },
        {
          name: 'center',
          isActive: e.isActive({ textAlign: 'center' }),
          icon: 'i-tabler-align-center',
          onClick: () => e.chain().focus().setTextAlign('center').run(),
        },
        {
          name: 'right',
          isActive: e.isActive({ textAlign: 'right' }),
          icon: 'i-tabler-align-right',
          onClick: () => e.chain().focus().setTextAlign('right').run(),
        },
        {
          name: 'justify',
          isActive: e.isActive({ textAlign: 'justify' }),
          icon: 'i-tabler-align-justified',
          onClick: () => e.chain().focus().setTextAlign('justify').run(),
        },
      ],
    },

  ]
})
</script>

<template>
  <BubbleMenuEngine class="bubble-menu-text" :class="bubbleSubMenu" :items="bubbleMenuButtons" :editor="editor" />
</template>isDarkOrLightMode,
