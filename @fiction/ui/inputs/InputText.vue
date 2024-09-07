<script lang="ts" setup>
import { vue } from '@fiction/core'
import { textInputClasses } from './theme'
import type { UiElementSize } from '../utils'

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
  <input
    :class="textInputClasses({ inputClass, uiSize })"
    type="text"
    :value="modelValue"
    spellcheck="false"
    @input="handleEmit($event.target)"
    @click="handleClick($event.target)"
  >
</template>
