<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import { Check, Trash } from 'lucide-vue-next'
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
  props.editor.chain().focus().setLink({ href }).run()

  val.value = ''

  emit('update:modelValue', { href })
}
</script>

<template>
  <div class="w-60 flex gap-2">
    <input
      ref="inputRef"
      v-model="val"
      type="text"
      placeholder="Paste a link"
      class="flex-1 p-1 px-2 text-sm outline-none border-none focus:outline-none focus:ring-0 appearance-none bg-theme-0 dark:bg-theme-700 dark:text-theme-0 rounded-sm"
      @keyup.enter="addLink()"
    >

    <div
      class="flex items-center p-1 transition-all rounded-sm hover:opacity-85 cursor-pointer"
      @click="addLink()"
    >
      <Check class="w-4 h-4" />
    </div>
  </div>
</template>
