<script lang="ts" setup>
import { computed } from 'vue'
import { kaptionDashboard } from '@kaption/app'

const colors = [
  'text-primary-500',
  'text-green-500',
  'text-pink-500',
  'text-red-500',
  'text-orange-500',
  'text-blue-500',
]
const map = computed(() => {
  return kaptionDashboard.widgets.map((_) => {
    const rando = Math.floor(Math.random() * colors.length)
    return {
      ..._,
      textColor: colors[rando],
    }
  })
})
</script>

<template>
  <div class="max-w-screen-3xl m-auto my-12 mx-4 sm:-mx-16 lg:-mx-36">
    <div class="widget-translate grid grid-cols-1 gap-4 sm:grid-cols-12">
      <div
        v-for="(w, i) in map"
        :key="i"
        class="relative col-span-1 flex items-center space-x-6 rounded-lg border border-gray-300 bg-white px-8 py-6 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 sm:col-span-4 lg:col-span-2"
      >
        <div class="shrink-0" :class="w.textColor">
          <div class="h-6 w-6" v-html="w.ui.icon" />
        </div>
        <div class="min-w-0 flex-1 text-left">
          <a href="#" class="focus:outline-none">
            <span class="absolute inset-0" aria-hidden="true" />
            <p class="text-lg font-bold">{{ w.title.value }}</p>
            <p class="truncate text-sm text-theme-500">
              {{ w.description.value }}
            </p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
