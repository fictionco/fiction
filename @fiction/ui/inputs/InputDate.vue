<script lang="ts" setup>
import { isDarkOrLightMode, vue } from '@fiction/core'
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

const dateEl = vue.ref<HTMLInputElement>()
const mode = vue.ref<'dark' | 'light'>()
vue.onMounted(() => {
  mode.value = isDarkOrLightMode(dateEl.value)
})
</script>

<template>
  <input
    ref="dateEl"
    :class="textInputClasses({ inputClass })"
    type="date"
    :value="modelValue"
    :style="{ colorScheme: mode }"
    @input="handleEmit($event.target)"
  >
</template>
