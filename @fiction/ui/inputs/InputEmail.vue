<script lang="ts" setup>
import type { ColorThemeUser } from '@fiction/core'
import type { UiElementSize } from '../utils'
import { textInputClasses } from './theme'

const {
  modelValue = '',
  placeholder = 'Type an email...',
  inputClass = '',
  uiSize = 'md',
} = defineProps<{
  modelValue?: string
  placeholder?: string
  inputClass?: string
  theme?: ColorThemeUser
  uiSize?: UiElementSize
}>()

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
    :class="textInputClasses({ inputClass, uiSize, theme })"
    type="email"
    autocomplete="email"
    :value="modelValue"
    :placeholder="placeholder"
    @input="handleEmit($event.target)"
  >
</template>
