<script lang="ts" setup>
import ElSpinner from '@factor/ui/ElSpinner.vue'

defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  loading: { type: Boolean, default: false },
})
</script>

<template>
  <div class="rounded-md border border-slate-300">
    <div
      v-if="title"
      class="border-b border-slate-200 py-2 px-3 text-sm text-theme-500"
    >
      <div class="flex items-center">
        <div class="font-semibold">
          {{ title }}
        </div>

        <div v-if="description" class="description group relative ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-theme-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div
            class="pointer-events-none absolute top-0 left-full z-10 w-40 rounded-md bg-white p-3 text-xs opacity-0 shadow-lg group-hover:opacity-100"
          >
            {{ description }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center p-8">
      <div class="h-6 w-6 text-theme-300">
        <ElSpinner />
      </div>
    </div>

    <template v-else>
      <slot />
    </template>
  </div>
</template>
