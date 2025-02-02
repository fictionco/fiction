<script lang="ts" setup>
import { vue } from '@fiction/core'

const props = defineProps<{
  isOpen?: boolean
}>()

const lineClass = vue.computed(() => [
  'absolute h-[3px] w-[75%]',
  'transform-gpu transition-all duration-200 ease-[cubic-bezier(0.25,1,0.33,1)]',
  'bg-theme-400 dark:bg-theme-600',
  'rounded-full',
])

function getLineClass(index: number) {
  if (!props.isOpen) {
    return [
      ...lineClass.value,
      index === 0 ? '-translate-y-2' : '',
      index === 2 ? 'translate-y-2' : '',
    ]
  }

  return [
    ...lineClass.value,
    index === 1 ? 'opacity-0' : '',
    index === 0 ? 'rotate-[-135deg]' : '',
    index === 2 ? 'rotate-[135deg]' : '',
  ]
}
</script>

<template>
  <button
    class="inline-flex items-center justify-center rounded-lg hover:bg-theme-50 focus:outline-none focus:ring-2 focus:ring-theme-100 dark:hover:bg-theme-800 dark:focus:ring-theme-700"
    aria-label="Toggle menu"
    type="button"
  >
    <div class="relative flex h-0.5 w-full items-center justify-center">
      <div v-for="i in 3" :key="i" :class="getLineClass(i - 1)" />
    </div>
  </button>
</template>
