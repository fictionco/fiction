<script setup lang="ts">
import type { NavListItem } from '@fiction/core'
import type { Editor } from '@tiptap/core'
import { vue } from '@fiction/core'
import XButton from '../../buttons/XButton.vue'
import XDropDown from '../../common/XDropDown.vue'
import XIcon from '../../media/XIcon.vue'

const { editor } = defineProps<{
  editor: Editor
}>()

// Text formatting dropdown items
const textFormatItems = vue.computed<NavListItem[]>(() => [
  {
    label: 'Bold',
    isActive: editor.isActive('bold'),
    icon: { class: 'i-tabler-bold' },
    onClick: () => editor.chain().toggleBold().run(),
  },
  {
    label: 'Italic',
    isActive: editor.isActive('italic'),
    icon: { class: 'i-tabler-italic' },
    onClick: () => editor.chain().toggleItalic().run(),
  },
  {
    label: 'Strike',
    isActive: editor.isActive('strike'),
    icon: { class: 'i-tabler-strikethrough' },
    onClick: () => editor.chain().toggleStrike().run(),
  },
  {
    label: 'Inline Code',
    isActive: editor.isActive('code'),
    icon: { class: 'i-tabler-code' },
    onClick: () => editor.chain().toggleCode().run(),
  },
  {
    label: 'Superscript',
    isActive: editor.isActive('superscript'),
    icon: { class: 'i-tabler-superscript' },
    onClick: () => editor.chain().toggleSuperscript().run(),
  },
  {
    label: 'Subscript',
    isActive: editor.isActive('subscript'),
    icon: { class: 'i-tabler-subscript' },
    onClick: () => editor.chain().toggleSubscript().run(),
  },
])

// Alignment options
const alignmentItems = vue.computed<NavListItem[]>(() => [
  {
    label: 'Left',
    isActive: editor.isActive({ textAlign: 'left' }),
    icon: { class: 'i-tabler-align-left' },
    onClick: () => editor.chain().setTextAlign('left').run(),
  },
  {
    label: 'Center',
    isActive: editor.isActive({ textAlign: 'center' }),
    icon: { class: 'i-tabler-align-center' },
    onClick: () => editor.chain().setTextAlign('center').run(),
  },
  {
    label: 'Right',
    isActive: editor.isActive({ textAlign: 'right' }),
    icon: { class: 'i-tabler-align-right' },
    onClick: () => editor.chain().setTextAlign('right').run(),
  },
  {
    label: 'Justify',
    isActive: editor.isActive({ textAlign: 'justify' }),
    icon: { class: 'i-tabler-align-justified' },
    onClick: () => editor.chain().setTextAlign('justify').run(),
  },
])

const headingItems = vue.computed<NavListItem[]>(() => [
  {
    label: 'Paragraph',
    isActive: editor.isActive('paragraph'),
    icon: { class: 'i-tabler-align-left' },
    onClick: () => editor.chain().setParagraph().run(),
  },
  {
    label: 'Heading 1',
    isActive: editor.isActive('heading', { level: 1 }),
    icon: { class: 'i-tabler-h-1' },
    onClick: () => editor.chain().toggleHeading({ level: 1 }).run(),
  },
  {
    label: 'Heading 2',
    isActive: editor.isActive('heading', { level: 2 }),
    icon: { class: 'i-tabler-h-2' },
    onClick: () => editor.chain().toggleHeading({ level: 2 }).run(),
  },
  {
    label: 'Heading 3',
    isActive: editor.isActive('heading', { level: 3 }),
    icon: { class: 'i-tabler-h-3' },
    onClick: () => editor.chain().toggleHeading({ level: 3 }).run(),
  },
  {
    label: 'Heading 4',
    isActive: editor.isActive('heading', { level: 4 }),
    icon: { class: 'i-tabler-h-4' },
    onClick: () => editor.chain().toggleHeading({ level: 4 }).run(),
  },
])

const blockItems = vue.computed<NavListItem[]>(() => [
  {
    label: 'Blockquote',
    isActive: editor.isActive('blockquote'),
    icon: { class: 'i-tabler-quote' },
    onClick: () => editor.chain().toggleBlockquote().run(),
  },
  {
    label: 'Code Block',
    isActive: editor.isActive('codeBlock'),
    icon: { class: 'i-tabler-code-box' },
    onClick: () => editor.chain().toggleCodeBlock().run(),
  },
  {
    label: 'Horizontal Rule',
    icon: { class: 'i-tabler-minus' },
    onClick: () => editor.chain().setHorizontalRule().run(),
  },
])

const listItems = vue.computed<NavListItem[]>(() => [
  {
    label: 'Bullet List',
    isActive: editor.isActive('bulletList'),
    icon: { class: 'i-tabler-list' },
    onClick: () => editor.chain().toggleBulletList().run(),
  },
  {
    label: 'Ordered List',
    isActive: editor.isActive('orderedList'),
    icon: { class: 'i-tabler-list-numbers' },
    onClick: () => editor.chain().toggleOrderedList().run(),
  },
  {
    label: 'Task List',
    isActive: editor.isActive('taskList'),
    icon: { class: 'i-tabler-list-check' },
    onClick: () => editor.chain().toggleTaskList().run(),
  },
])

const activeHeadingType = vue.computed(() => {
  if (editor.isActive('heading', { level: 1 }))
    return { label: 'H1', icon: 'i-tabler-h-1' }
  if (editor.isActive('heading', { level: 2 }))
    return { label: 'H2', icon: 'i-tabler-h-2' }
  if (editor.isActive('heading', { level: 3 }))
    return { label: 'H3', icon: 'i-tabler-h-3' }
  if (editor.isActive('heading', { level: 4 }))
    return { label: 'H4', icon: 'i-tabler-h-4' }
  return { label: 'Text', icon: 'i-tabler-align-left' }
})

function clearFormatting() {
  editor.chain().clearNodes().unsetAllMarks().run()
}
</script>

<template>
  <div class="prose-toolbar ">
    <div class="flex flex-wrap items-center gap-1 p-1">
      <!-- Common Format Buttons -->
      <div class="flex items-center gap-1">
        <XButton
          v-for="item in textFormatItems.slice(0, 3)"
          :key="item.label"
          size="xs"
          :icon="item.icon"
          :title="item.label"
          rounding="md"
          :theme="item.isActive ? 'primary' : 'default'"
          @click.prevent="item.onClick?.({ event: $event, item })"
        />
      </div>

      <!-- More Text Formatting -->
      <XDropDown :items="textFormatItems.slice(3)" mode="hover" placement="bottom">
        <template #default="{ isActive }">
          <XButton
            size="xs"
            :theme="isActive ? 'primary' : 'default'"
            icon="i-tabler-text-plus"
            icon-after="i-tabler-chevron-down"
            rounding="md"
            title="More Formatting"
          />
        </template>
      </XDropDown>

      <!-- Text Alignment -->
      <XDropDown :items="alignmentItems" mode="hover" placement="bottom">
        <template #default="{ isActive }">
          <XButton
            size="xs"
            :theme="isActive ? 'primary' : 'default'"
            icon="i-tabler-align-left"
            icon-after="i-tabler-chevron-down"
            rounding="md"
            title="Text Alignment"
          />
        </template>
      </XDropDown>

      <!-- Heading Styles -->
      <XDropDown :items="headingItems" mode="hover" placement="bottom">
        <template #default="{ isActive }">
          <XButton
            size="xs"
            :theme="isActive ? 'primary' : 'default'"
            :icon="activeHeadingType.icon"
            icon-after="i-tabler-chevron-down"
            rounding="md"
            :title="activeHeadingType.label"
          >
            <span class="hidden lg:inline">{{ activeHeadingType.label }}</span>
          </XButton>
        </template>
      </XDropDown>

      <!-- Lists -->
      <XDropDown :items="listItems" mode="hover" placement="bottom">
        <template #default="{ isActive }">
          <XButton
            size="xs"
            :theme="isActive ? 'primary' : 'default'"
            icon="i-tabler-list"
            icon-after="i-tabler-chevron-down"
            rounding="md"
            title="Lists"
          >
            <span class="hidden lg:inline">List</span>
          </XButton>
        </template>
      </XDropDown>

      <!-- Block Elements -->
      <XDropDown :items="blockItems" mode="hover" placement="bottom">
        <template #default="{ isActive }">
          <XButton
            size="xs"
            :theme="isActive ? 'primary' : 'default'"
            icon="i-tabler-box"
            icon-after="i-tabler-chevron-down"
            rounding="md"
            title="Block Elements"
          >
            <span class="hidden lg:inline">Block</span>
          </XButton>
        </template>
      </XDropDown>

      <!-- Clear Formatting -->
      <XButton
        size="xs"
        icon="i-tabler-eraser"
        rounding="md"
        title="Clear Formatting"
        @click.prevent="clearFormatting"
      >
        <span class="hidden xl:inline">Clear</span>
      </XButton>

      <!-- History Controls -->
      <div class="flex items-center gap-1 ml-auto">
        <XButton
          size="xs"
          icon="i-tabler-arrow-back-up"
          rounding="md"
          title="Undo"
          @click.prevent="editor.chain().undo().run()"
        />
        <XButton
          size="xs"
          icon="i-tabler-arrow-forward-up"
          rounding="md"
          title="Redo"
          @click.prevent="editor.chain().redo().run()"
        />
      </div>
    </div>
  </div>
</template>

<style>

</style>
