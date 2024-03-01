<script lang="ts" setup>
import { vue } from '@factor/api'

const props = defineProps({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
  selected: { type: Boolean, default: false },
})
const showIcon = vue.computed(() => {
  if (props.selected) {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
</svg>`
  }
  else {
    return props.icon
  }
})
</script>

<template>
  <label
    class="focus-within:ring-primary-500 relative block cursor-pointer select-none rounded-lg border border-slate-300 bg-white p-4 shadow-sm focus-within:ring-1 focus-within:ring-offset-2 hover:border-slate-400 sm:flex sm:justify-between"
    :class="
      selected ? 'bg-theme-800 text-white border-slate-800' : 'border-slate-300'
    "
  >
    <div class="flex items-center">
      <div class="text-sm">
        <p id="server-size-0-label" class="font-semibold">
          {{ name }}
        </p>
        <div class="opacity-50">
          {{ description }}
        </div>
      </div>
    </div>
    <div
      class="mt-2 flex flex-col justify-center text-sm opacity-50 hover:opacity-30 sm:mt-0 sm:ml-4 sm:text-right"
    >
      <div class="h-6 w-6" v-html="showIcon" />
    </div>
    <div
      class="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent"
      aria-hidden="true"
    />
  </label>
</template>
