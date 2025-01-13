<script lang="ts" setup>
import type { ListItem } from '@fiction/core'
import { normalizeList, vue } from '@fiction/core'

const { modelValue, list = [], size = 'md' } = defineProps<{
  modelValue?: string | number
  list?: ListItem[]
  size?: 'sm' | 'md' | 'lg'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number | undefined]
}>()

const parsedList = vue.computed(() => normalizeList(list))

// Compute dynamic size classes
const sizeClasses = vue.computed(() => {
  switch (size) {
    case 'sm':
      return 'px-2 py-1 text-[11px]'
    case 'lg':
      return 'px-6 py-2.5 text-base'
    default:
      return 'px-2.5 py-1 text-xs'
  }
})

function getButtonClasses(item: ListItem, index: number): string {
  const isSelected = modelValue === item.value
  const isFirst = index === 0
  const isLast = index === parsedList.value.length - 1

  return [
    // Base classes
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 antialiased',
    'focus:outline-none  ',
    'rounded-lg',
    sizeClasses.value,

    // Border handling
    isFirst ? 'rounded-l-lg' : '',
    isLast ? 'rounded-r-lg' : '',
    'border',

    // Selected state
    isSelected
      ? [
          'border-theme-500 bg-theme-500 text-white',
          'dark:bg-primary-900 dark:border-primary-600 dark:text-white',
          'z-10',
        ]
      : [
          'border-theme-300 bg-white text-theme-700 hover:bg-theme-50',
          'dark:border-theme-600 dark:bg-theme-800 dark:text-theme-200 dark:hover:bg-theme-700',
        ],
  ].flatMap(_ => _).filter(Boolean).join(' ')
}
</script>

<template>
  <div
    class="inline-flex rounded-lg shadow-sm isolate gap-1 flex-wrap"
    role="radiogroup"
  >
    <button
      v-for="(item, index) in parsedList"
      :key="item.value"
      :data-test-id="`radio-button-${item.value}`"
      type="button"
      :class="getButtonClasses(item, index)"
      :aria-checked="modelValue === item.value"
      role="radio"
      @click.prevent="emit('update:modelValue', item.value)"
    >
      {{ item.name }}
    </button>
  </div>
</template>
