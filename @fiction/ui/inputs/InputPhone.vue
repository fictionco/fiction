<script lang="ts" setup>
import { vue } from '@fiction/core'
import { textInputClasses } from './theme'
import type { UiElementSize } from '../utils'

defineProps({
  modelValue: { type: [String], default: '' },
  inputClass: { type: String, default: '' },
  uiSize: { type: String as vue.PropType<UiElementSize>, default: 'md' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

const attrs = vue.useAttrs() as { autocomplete: string, [key: string]: string }

function handleEmit(target: EventTarget | null): void {
  const el = target as HTMLInputElement

  emit('update:modelValue', el.value)
}
</script>

<template>
  <input
    :class="textInputClasses({ inputClass, uiSize })"
    type="tel"
    :value="modelValue"
    :autocomplete="attrs.autocomplete || 'tel'"
    placeholder="+1 (555) 555-5555"
    @input="handleEmit($event.target)"
  >
</template>
