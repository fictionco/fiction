<script lang="ts" setup>
import type { vue } from '@fiction/core'
import { textInputClasses } from './theme'
import type { UiElementSize } from '../utils'

defineProps({
  modelValue: { type: [String], default: '' },
  placeholder: { type: [String], default: 'Type your email...' },
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
</script>

<template>
  <input
    :class="textInputClasses({ inputClass, uiSize })"
    type="email"
    autocomplete="email"
    :value="modelValue"
    :placeholder="placeholder"
    @input="handleEmit($event.target)"
  >
</template>
