<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import { vue } from '@fiction/core'

const props = defineProps({
  editor: { type: Object as vue.PropType<Editor>, required: true },
  modelValue: { type: Object as vue.PropType<{ href: string }>, required: true },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: { href: string }): void
}>()

const val = vue.ref(props.modelValue?.href || '')

const inputRef = vue.ref<HTMLInputElement | null>(null)

function addLink() {
  const url = encodeURIComponent(val.value.trim().replace(/^https?:\/\//, '').replace(/\/$/, ''))
  const href = `https://${url}`
  props.editor.chain().focus(null, { scrollIntoView: false }).setLink({ href }).run()

  val.value = ''

  emit('update:modelValue', { href })
}
</script>

<template>
  <div class=" flex gap-2">
    <input
      ref="inputRef"
      v-model="val"
      type="text"
      placeholder="Paste a link"
      class="w-60 flex-1 p-1 px-2 text-sm font-mono font-normal outline-none border-none focus:outline-none focus:ring-0 appearance-none bg-theme-0 dark:bg-theme-700 dark:text-theme-0 rounded-sm"
      @keyup.enter="addLink()"
    >

    <div
      class="flex items-center p-1 transition-all rounded-sm hover:opacity-85 cursor-pointer"
      @click="addLink()"
    >
      <div class="i-tabler-check text-lg" />
    </div>
  </div>
</template>
