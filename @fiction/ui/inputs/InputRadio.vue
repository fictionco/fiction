<script lang="ts" setup>
import { normalizeList, vue } from '@fiction/core'
import { twMerge } from 'tailwind-merge'
import type { ListItem, StandardSize } from '@fiction/core'

const props = defineProps({
  modelValue: { type: [String, Number, Boolean], default: null },
  list: { type: Array as vue.PropType<ListItem[]>, default: () => [] },
  uiSize: { type: String as vue.PropType<StandardSize>, default: 'md' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string | number | boolean): void
}>()

const selected = vue.ref(props.modelValue)
const parsedList = normalizeList(props.list)

vue.watch(
  () => selected.value,
  (v) => {
    emit('update:modelValue', v)
  },
)

function getClasses(uiSize: StandardSize) {
  const baseClasses = {
    container: 'radio f-input',
    label: 'my-2 flex cursor-pointer items-center',
    input: [
      'form-radio',
      'appearance-none',
      'border',
      'border-theme-300',
      'dark:border-theme-0',
      'text-primary-500',
      'dark:text-primary-500',
      'focus:border-theme-900',
      'focus:outline-none',
      'focus:ring-0',
      'focus:ring-theme-100',
      'dark:focus:ring-theme-200',
      'focus:ring-offset-0',
      'bg-theme-100 focus:bg-theme-200 hover:bg-primary-500 dark:bg-theme-800',

    ],
    text: 'font-sans dark:text-theme-100 text-theme-600 dark:hover:text-theme-200 hover:text-theme-500 ml-[.5em]',
    selected: 'bg-primary-500 dark:bg-primary-600',
  }

  const sizeClasses = {
    'xxs': { label: 'text-[10px]', input: 'w-3 h-3', text: 'text-[10px]' },
    'xs': { label: 'text-xs', input: 'w-3.5 h-3.5', text: 'text-xs' },
    'sm': { label: 'text-sm', input: 'w-4 h-4', text: 'text-sm' },
    'md': { label: 'text-md', input: 'w-5 h-5', text: 'text-md' },
    'lg': { label: 'text-lg', input: 'w-6 h-6', text: 'text-lg' },
    'xl': { label: 'text-xl', input: 'w-7 h-7', text: 'text-xl' },
    '2xl': { label: 'text-2xl', input: 'w-8 h-8', text: 'text-2xl' },
  }

  return {
    container: baseClasses.container,
    label: twMerge(baseClasses.label, sizeClasses[uiSize].label),
    input: twMerge(baseClasses.input, sizeClasses[uiSize].input),
    text: twMerge(baseClasses.text, sizeClasses[uiSize].text),
    selected: baseClasses.selected,
  }
}

const cls = vue.computed(() => getClasses(props.uiSize))

function isSelected(value: string | number | boolean | undefined): boolean {
  return selected.value === value
}
</script>

<template>
  <div :class="cls.container">
    <label
      v-for="(option, i) in parsedList"
      :key="i"
      :class="cls.label"
      :for="String(option.value)"
    >
      <input
        :id="String(option.value)"
        v-model="selected"
        type="radio"
        :class="[cls.input, isSelected(option.value) ? cls.selected : '']"
        name="radio-colors"
        :value="option.value"
        v-bind="$attrs"
      >
      <span :class="cls.text">{{ option.name }}</span>
    </label>
  </div>
</template>
