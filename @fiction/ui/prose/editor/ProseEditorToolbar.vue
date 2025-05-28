<script setup lang="ts">
import type { NavListItem } from '@fiction/core'
import type { Editor } from '@tiptap/core'
import { vue } from '@fiction/core'
import XButton from '../../buttons/XButton.vue'
import XDropDown from '../../common/XDropDown.vue'
import ElInput from '../../inputs/ElInput.vue'

defineOptions({ name: 'ProseEditorToolbar' })

const { editor } = defineProps<{
  editor: Editor
}>()

const showLinkInput = vue.ref(false)
const showImageInput = vue.ref(false)
const linkUrl = vue.ref('')
const imageUrl = vue.ref('')

// Functions to handle link editing
function openLinkInput() {
  const attrs = editor.getAttributes('link')
  linkUrl.value = attrs.href || ''
  showLinkInput.value = true
  showImageInput.value = false
  // Focus input after render
  vue.nextTick(() => {
    const input = document.querySelector<HTMLInputElement>('.link-input')
    input?.focus({ preventScroll: true })
    input?.select()
  })
}

function handleLinkSubmit() {
  if (!linkUrl.value) {
    removeLink()
    return
  }

  const url = encodeURIComponent(linkUrl.value.trim().replace(/^https?:\/\//, '').replace(/\/$/, ''))
  const href = `https://${url}`
  editor.chain().focus(null, { scrollIntoView: false }).setLink({ href }).run()
  linkUrl.value = ''
  showLinkInput.value = false
}

// Functions to handle image editing
function openImageInput() {
  const attrs = editor.getAttributes('image')
  imageUrl.value = attrs.src || ''
  showImageInput.value = true
  showLinkInput.value = false
  // Focus input after render
  vue.nextTick(() => {
    const input = document.querySelector<HTMLInputElement>('.image-input')
    input?.focus({ preventScroll: true })
    input?.select()
  })
}

function handleImageSubmit() {
  if (!imageUrl.value) {
    removeImage()
    return
  }

  const url = imageUrl.value.trim()
  editor.chain().focus(null, { scrollIntoView: false }).setImage({ src: url }).run()
  imageUrl.value = ''
  showImageInput.value = false
}

// Remove functions
function removeLink() {
  editor.chain().focus(null, { scrollIntoView: false }).unsetLink().run()
  showLinkInput.value = false
}

function removeImage() {
  editor.chain().focus(null, { scrollIntoView: false }).deleteSelection().run()
  showImageInput.value = false
}

// Close dialogs when selection changes
vue.watch(() => editor.state.selection, () => {
  showLinkInput.value = false
  showImageInput.value = false
})

// Text formatting dropdown items
const textFormatItemsPrimary = vue.computed<NavListItem[]>(() => [
  {
    label: 'Bold',
    isActive: editor.isActive('bold'),
    icon: { class: 'i-tabler-bold' },
    onClick: () => editor.chain().focus(null, { scrollIntoView: false }).toggleBold().run(),
  },
  {
    label: 'Italic',
    isActive: editor.isActive('italic'),
    icon: { class: 'i-tabler-italic' },
    onClick: () => editor.chain().focus(null, { scrollIntoView: false }).toggleItalic().run(),
  },

  {
    label: 'Underline',
    isActive: editor.isActive('underline'),
    icon: { class: 'i-tabler-underline' },
    onClick: () => editor.chain().focus(null, { scrollIntoView: false }).toggleUnderline().run(),
  },
  {
    label: 'Link',
    isActive: editor.isActive('link'),
    icon: { class: 'i-tabler-link' },
    onClick: () => openLinkInput(),
  },

  {
    label: 'Image Upload',
    isActive: editor.isActive('image'),
    icon: { class: 'i-tabler-photo-up' },
    onClick: () => {
      editor.chain().focus(null, { scrollIntoView: false }).insertContent({
        type: 'xImage',
        attrs: { /* attributes if any */ },
      }).run()
    },
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
    icon: { class: 'i-tabler-pilcrow' },
    onClick: () => editor.chain().setParagraph().focus(null, { scrollIntoView: false }).run(),
  },
  {
    label: 'Heading 1',
    isActive: editor.isActive('heading', { level: 1 }),
    icon: { class: 'i-tabler-h-1' },
    onClick: () => editor.chain().toggleHeading({ level: 1 }).focus(null, { scrollIntoView: false }).run(),
  },
  {
    label: 'Heading 2',
    isActive: editor.isActive('heading', { level: 2 }),
    icon: { class: 'i-tabler-h-2' },
    onClick: () => editor.chain().toggleHeading({ level: 2 }).focus(null, { scrollIntoView: false }).run(),
  },
  {
    label: 'Heading 3',
    isActive: editor.isActive('heading', { level: 3 }),
    icon: { class: 'i-tabler-h-3' },
    onClick: () => editor.chain().toggleHeading({ level: 3 }).focus(null, { scrollIntoView: false }).run(),
  },
  {
    label: 'Heading 4',
    isActive: editor.isActive('heading', { level: 4 }),
    icon: { class: 'i-tabler-h-4' },
    onClick: () => editor.chain().toggleHeading({ level: 4 }).focus(null, { scrollIntoView: false }).run(),
  },
])

const listItems = vue.computed<NavListItem[]>(() => [
  {
    label: 'Inline Code',
    isActive: editor.isActive('code'),
    icon: { class: 'i-tabler-code' },
    onClick: () => editor.chain().focus(null, { scrollIntoView: false }).toggleCode().run(),
  },
  {
    label: 'Strike',
    isActive: editor.isActive('strike'),
    icon: { class: 'i-tabler-strikethrough' },
    onClick: () => editor.chain().focus(null, { scrollIntoView: false }).toggleStrike().run(),
  },
  {
    label: 'Image URL',
    isActive: editor.isActive('image'),
    icon: { class: 'i-tabler-photo' },
    onClick: () => openImageInput(),
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
  {
    label: 'Bullet List',
    isActive: editor.isActive('bulletList'),
    icon: { class: 'i-tabler-list' },
    onClick: () => editor.chain().toggleBulletList().focus(null, { scrollIntoView: false }).run(),
  },
  {
    label: 'Ordered List',
    isActive: editor.isActive('orderedList'),
    icon: { class: 'i-tabler-list-numbers' },
    onClick: () => editor.chain().toggleOrderedList().focus(null, { scrollIntoView: false }).run(),
  },
  {
    label: 'Blockquote',
    isActive: editor.isActive('blockquote'),
    icon: { class: 'i-tabler-quote' },
    onClick: () => editor.chain().toggleBlockquote().focus(null, { scrollIntoView: false }).run(),
  },
  {
    label: 'Code Block',
    isActive: editor.isActive('codeBlock'),
    icon: { class: 'i-tabler-code' },
    onClick: () => editor.chain().toggleCodeBlock().focus(null, { scrollIntoView: false }).run(),
  },
  {
    label: 'Horizontal Rule',
    icon: { class: 'i-tabler-minus' },
    onClick: () => editor.chain().setHorizontalRule().focus(null, { scrollIntoView: false }).run(),
  },
  {
    label: 'Task List',
    isActive: editor.isActive('taskList'),
    icon: { class: 'i-tabler-list-check' },
    onClick: () => editor.chain().toggleTaskList().focus(null, { scrollIntoView: false }).run(),
  },
  {
    label: 'Clear Formatting',
    icon: { class: 'i-tabler-eraser' },
    onClick: () => clearFormatting(),

  },
])

function clearFormatting() {
  editor.chain().clearNodes().unsetAllMarks().run()
}

const canUndo = vue.computed(() => editor.can().undo())
const canRedo = vue.computed(() => editor.can().redo())

const dropdownProps = vue.computed(() => {
  return {
    mode: 'click',
    placement: 'bottom',
    classes: { item: 'text-sm' },
  } as const
})
</script>

<template>
  <div class="prose-toolbar relative flex flex-wrap items-center gap-1 w-full">
    <!-- Common Format Buttons -->
    <div class="flex items-center gap-1">
      <XButton
        v-for="item in textFormatItemsPrimary"
        :key="item.label"
        size="xs"

        :icon="item.icon"
        :title="item.label"
        rounding="md"
        design="ghost"
        :theme="item.isActive ? 'primary' : 'default'"
        @click.prevent="item.onClick?.({ event: $event, item })"
      />
    </div>

    <!-- Text Alignment -->
    <XDropDown :items="alignmentItems" v-bind="dropdownProps">
      <template #default="{ isActive }">
        <XButton
          size="xs"
          :theme="isActive ? 'primary' : 'default'"
          :icon="alignmentItems.find((item) => item.isActive)?.icon || 'i-tabler-align-left'"
          icon-after="i-tabler-chevron-down"
          rounding="md"
          design="ghost"
          title="Text Alignment"
        />
      </template>
    </XDropDown>

    <!-- Heading Styles -->
    <XDropDown :items="headingItems" v-bind="dropdownProps">
      <template #default="{ isActive }">
        <XButton
          class="block"
          size="xs"
          :theme="isActive ? 'primary' : 'default'"
          :icon="headingItems.find((item) => item.isActive)?.icon || 'i-tabler-text-recognition'"
          icon-after="i-tabler-chevron-down"
          rounding="md"
          design="ghost"
          :title="headingItems.find((item) => item.isActive)?.label"
        />
      </template>
    </XDropDown>

    <!-- Lists -->
    <XDropDown :items="listItems" v-bind="dropdownProps" dropdown-alignment="end">
      <template #default="{ isActive }">
        <XButton
          class="block"
          size="xs"
          :theme="isActive ? 'primary' : 'default'"
          icon="i-tabler-dots"
          rounding="md"
          design="ghost"
          title="Lists"
        />
      </template>
    </XDropDown>

    <!-- History Controls -->
    <div v-if="canUndo || canRedo" class="flex items-center gap-1">
      <XButton
        v-if="canUndo"
        size="xs"
        icon="i-tabler-arrow-back-up"
        rounding="md"
        design="ghost"
        title="Undo"
        @click.prevent="editor.chain().undo().run()"
      />
      <XButton
        v-if="canRedo"
        size="xs"
        icon="i-tabler-arrow-forward-up"
        rounding="md"
        design="ghost"
        title="Redo"
        @click.prevent="editor.chain().redo().run()"
      />
    </div>

    <!-- Link Input Dialog -->
    <div
      v-if="showLinkInput"
      class="absolute z-50 top-full left-0 mt-1 bg-white dark:bg-theme-800 rounded-md shadow-lg p-2"
    >
      <div class="flex gap-2">
        <ElInput
          v-model="linkUrl"
          input="InputUrl"
          :placeholder="editor.isActive('link') ? 'Edit link URL' : 'Enter URL'"
          @keydown.enter="handleLinkSubmit"
          @keydown.esc="showLinkInput = false"
        />
        <XButton
          size="xs"
          icon="i-tabler-check"
          theme="primary"
          rounding="md"
          @click="handleLinkSubmit"
        />
        <XButton
          v-if="editor.isActive('link')"
          size="xs"
          icon="i-tabler-unlink"
          rounding="md"
          @click="removeLink"
        />
      </div>
    </div>

    <!-- Image Input Dialog -->
    <div
      v-if="showImageInput"
      class="absolute z-50 top-full left-0 mt-1 bg-white dark:bg-theme-800 rounded-md shadow-lg p-2"
    >
      <div class="flex gap-2">
        <ElInput
          v-model="imageUrl"
          input="InputUrl"
          :placeholder="editor.isActive('image') ? 'Edit image URL' : 'Enter image URL'"
          @keydown.enter="handleImageSubmit"
          @keydown.esc="showImageInput = false"
        />
        <XButton
          size="xs"
          icon="i-tabler-check"
          theme="primary"
          @click="handleImageSubmit"
        />
        <XButton
          v-if="editor.isActive('image')"
          size="xs"
          icon="i-tabler-trash"
          @click="removeImage"
        />
      </div>
    </div>
  </div>
</template>

<style>

</style>
