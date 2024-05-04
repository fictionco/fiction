<script lang="ts" setup>
import { vue } from '@fiction/core'
import { textInputClasses } from './theme'

defineProps({
  modelValue: { type: [String], default: '' },
  inputClass: { type: String, default: '' },
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
    :class="textInputClasses({ inputClass })"
    type="tel"
    :value="modelValue"
    :autocomplete="attrs.autocomplete || 'tel'"
    @input="handleEmit($event.target)"
  >
</template>
