<script lang="ts" setup>
import { vue } from '@fiction/core'
import { twMerge } from 'tailwind-merge'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  text: { type: String, default: '' },
  inputClass: { type: String, default: '' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: boolean): void
}>()

const attrs = vue.useAttrs()
const slots = vue.useSlots()
function handleEmit(target: EventTarget | null): void {
  const el = target as HTMLInputElement
  emit('update:modelValue', el.checked)
}

const classes = [
  'cursor-pointer',
  'mr-[.8em]',
  'h-[1.1em]',
  'w-[1.1em]',
  'appearance-none',
  'rounded-[.25em]',
  'focus:outline-none',
  'focus:ring-0',
  'focus:ring-offset-0',
  // 'focus:ring-offset-transparent',
  'bg-theme-100 hover:bg-theme-200 dark:bg-theme-800 dark:hover:bg-theme-500',

  // 'text-theme-700 dark:text-theme-50',
]

const inputClasses = vue.computed(() => twMerge(classes, props.inputClass))
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <label class="text-input-size flex cursor-pointer items-center">
    <input
      v-bind="attrs"
      type="checkbox"
      :class="inputClasses"
      :checked="modelValue"
      @input="handleEmit($event.target)"
    >

    <span v-if=" text" class="checkbox-label text-theme-700 dark:text-theme-50 hover:text-theme-500 text-xs">
      {{ text }}
    </span>
  </label>
</template>
