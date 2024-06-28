<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { UiElementSize } from '../utils'
import ProseEditor from '../prose/editor/ProseEditor.vue'
import { textInputClasses } from './theme'

defineProps({
  modelValue: { type: [String, Number], default: '' },
  inputClass: { type: String, default: '' },
  uiSize: { type: String as vue.PropType<UiElementSize>, default: 'md' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

function handleEmit(target: EventTarget | null): void {
  const el = target as HTMLInputElement
  emit('update:modelValue', el.value)
}

const attrs = vue.useAttrs()

function handleClick(target: EventTarget | null): void {
  const el = target as HTMLInputElement
  if (attrs.readonly)
    el.select()
}
</script>

<template>
  <div class="prose prose-xs  dark:prose-invert">
    <ProseEditor />
  </div>
</template>
