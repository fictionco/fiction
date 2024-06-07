<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { UiElementSize } from '../utils'
import { textInputClasses } from './theme'

defineProps({
  modelValue: { type: [String], default: '' },
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
    type="text"
    autocomplete="one-time-code"
    placeholder="••••••"
    size="6"
    :value="modelValue"
    @input="handleEmit($event.target)"
  >
</template>
