<script lang="ts" setup>
import { textInputClasses } from './theme'

defineProps({
  modelValue: { type: [String], default: '' },
  inputClass: { type: String, default: '' },
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
    :class="textInputClasses({ inputClass })"
    type="date"
    :value="modelValue"
    @input="handleEmit($event.target)"
  >
</template>
