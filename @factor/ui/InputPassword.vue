<script lang="ts" setup>
import { vue } from '@factor/api'
import { textInputClasses } from './theme'

defineProps({
  modelValue: { type: String, default: '' },
  inputClass: { type: String, default: '' },

})
const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()
const attrs = vue.useAttrs() as { autocomplete: string, [key: string]: any }
function handleEmit(target: EventTarget | null): void {
  const el = target as HTMLInputElement

  emit('update:modelValue', el.value)
}
</script>

<template>
  <input
    :class="textInputClasses({ inputClass })"
    :value="modelValue"
    :autocomplete="attrs.autocomplete || 'current-password'"
    type="password"
    minlength="6"
    placeholder="Password"
    @input="handleEmit($event.target)"
  >
</template>
