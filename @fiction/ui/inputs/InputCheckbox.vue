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

function handleEmit(target: EventTarget | null): void {
  const el = target as HTMLInputElement
  emit('update:modelValue', el.checked)
}

const classes = [
  'cursor-pointer',
  'mr-[.8em]',
  'h-[1.4em]',
  'w-[1.4em]',
  'appearance-none',
  'rounded-[.25em]',
  'focus:outline-none',
  'focus:ring-0',
  'focus:ring-offset-0',
  'bg-theme-100 focus:bg-theme-200 hover:bg-primary-500 dark:bg-theme-800',
  'active:bg-primary-500 selected:bg-primary-500',
]

function inputClasses() {
  return vue.computed(() => {
    const sel = props.modelValue ? 'bg-primary-500 dark:bg-primary-700' : ''
    return twMerge(classes, props.inputClass, sel)
  })
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <label class="flex cursor-pointer items-center">
    <input
      v-bind="attrs"
      type="checkbox"
      :class="inputClasses().value"
      :checked="modelValue"
      @input="handleEmit($event.target)"
    >

    <span v-if=" text" class="checkbox-label text-theme-700 dark:text-theme-50 dark:hover:text-theme-0 hover:text-theme-500 font-sans">
      {{ text }}
    </span>
  </label>
</template>
