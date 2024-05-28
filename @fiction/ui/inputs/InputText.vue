<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { UiElementSize } from '../utils'
import { textInputClasses } from './theme'

defineProps({
  modelValue: { type: [String, Number], default: '' },
  inputClass: { type: String, default: '' },
  size: { type: String as vue.PropType<UiElementSize>, default: 'md' },
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
    :class="textInputClasses({ inputClass, size })"
    type="text"
    :value="modelValue"
    spellcheck="false"
    @input="handleEmit($event.target)"
    @click="handleClick($event.target)"
  >
</template>
