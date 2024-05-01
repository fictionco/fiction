<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import type { NavItem } from '@fiction/core'
import { onResetUi, vue } from '@fiction/core'
import BubbleMenuEngine from './BubbleMenuEngine.vue'

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

  return [

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

  ]
})
</script>

<template>
  <BubbleMenuEngine class="bubble-menu-image" :items="bubbleMenuButtons" :editor="editor" />
</template>
