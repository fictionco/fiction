<script lang="ts" setup>
import type { StandardSize, vue } from '@fiction/core'
import { textInputClasses } from './theme'

defineProps({
  modelValue: { type: [String], default: '' },
  placeholder: { type: [String], default: 'https://' },
  inputClass: { type: String, default: '' },
  uiSize: { type: String as vue.PropType<StandardSize>, default: 'md' },
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
    type="url"
    :value="modelValue"
    autocomplete="on"
    name="url"
    :placeholder="placeholder"
    @input="handleEmit($event.target)"
  >
</template>
