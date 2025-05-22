<script lang="ts" setup>
import type { ImageFilterValueSchema, MediaObject } from '@fiction/core'
import type { z } from 'zod/v4'
import { vue } from '@fiction/core'
import FictionLogo from '../brand/FictionLogo.vue'
import XButton from '../buttons/XButton.vue'
import XMedia from '../media/XMedia.vue'
import { createStockMediaHandler } from '../stock/index.js'

const darkMode = vue.ref(false)

const animationOptions = ['', 'swipe', 'expand'] as const
const imageModes = ['cover', 'contain', 'inline'] as const

const containerScenarios = [
  { label: 'Square', class: 'h-64' },
  { label: 'Landscape', class: 'h-36' },
  { label: 'Portrait', class: 'h-96' },
  { label: 'Banner', class: ' h-32' },
  { label: 'Thumbnail', class: 'h-16' },
]

const stock = vue.ref<Awaited<ReturnType<typeof createStockMediaHandler>>>()

async function generateMediaObjects(): Promise<MediaObject[]> {
  if (!stock.value) {
    stock.value = await createStockMediaHandler()
  }
  else {
    stock.value.resetUsedMedia()
  }
  return [
    // Image
    {
      ...stock.value.getRandomByAspectRatio('aspect:square', { format: 'image' }),
      alt: 'Square image',
      format: 'image',
      blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
    },
    // Video
    {
      ...stock.value.getRandomMedia({ format: 'video' }),
      format: 'video',
      blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
    },
    // HTML (SVG)
    {
      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="currentColor" />
      </svg>`,
      format: 'html',
    },
    // Component
    {
      el: FictionLogo,
      format: 'component',
    },
  ]
}

const mediaObjects = vue.ref<MediaObject[]>([])

async function refreshMedia() {
  mediaObjects.value = await generateMediaObjects()
}
type ImageFilterValue = z.infer<typeof ImageFilterValueSchema>

const filters: ImageFilterValue[] = [
  { type: 'brightness', value: 150 },
  { type: 'contrast', value: 200 },
  { type: 'grayscale', value: 90 },
  { type: 'blur', value: 5 },
] as const

const overlays = [
  { color: 'rgba(255, 0, 0, 0.5)', opacity: 0.5 },
  { gradient: { angle: 45, stops: [{ color: '#00ff00', percent: 0 }, { color: '#0000ff', percent: 100 }] }, opacity: 0.7 },
]

vue.onMounted(async () => {
  mediaObjects.value = await generateMediaObjects()
})
</script>

<template>
  <div id="test-xmedia" class="min-h-screen p-8" :class="{ dark: darkMode }">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold x-font-title">
          Media Handling
        </h1>
        <div class="space-x-4">
          <XButton rounding="full" @click="refreshMedia">
            Refresh Media
          </XButton>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          v-for="(media, mediaIndex) in mediaObjects"
          :key="mediaIndex"
          class="bg-white dark:bg-theme-800 p-6 rounded-lg shadow-lg"
        >
          <h2 class="text-xl font-semibold mb-4 text-theme-800 dark:text-white">
            {{ media.format }} {{ media.alt ? `(${media.alt})` : '' }}
          </h2>

          <div v-for="scenario in containerScenarios" :key="scenario.label" class="mb-6">
            <h3 class="text-sm font-medium mb-2 text-theme-600 dark:text-theme-300">
              {{ scenario.label }}
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="animate in animationOptions" :key="animate" class="space-y-2">
                <p class="text-xs text-theme-500 dark:text-theme-400">
                  Animation: {{ animate || 'None' }}
                </p>
                <div v-for="imageMode in imageModes" :key="imageMode" class="space-y-1">
                  <p class="text-xs text-theme-500 dark:text-theme-400">
                    Mode: {{ imageMode }}
                  </p>
                  <div class="bg-theme-100 dark:bg-theme-700 rounded relative overflow-hidden" :class="[scenario.class]">
                    <XMedia
                      :media="media"
                      :animate="animate"
                      :image-mode="imageMode"
                      class="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Filters Section -->
          <div class="mb-6">
            <h3 class="text-sm font-medium mb-2 text-theme-600 dark:text-theme-300">
              Filters
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="filter in filters" :key="filter.type" class="space-y-1">
                <p class="text-xs text-theme-500 dark:text-theme-400">
                  {{ filter.type }}: {{ filter.value }}
                </p>
                <div class="w-full h-32 bg-theme-100 dark:bg-theme-700 rounded relative overflow-hidden">
                  <XMedia
                    :media="{ ...media, effects: { filters: [filter] } }"
                    image-mode="cover"
                    class="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Overlays Section -->
          <div class="mb-6">
            <h3 class="text-sm font-medium mb-2 text-theme-600 dark:text-theme-300">
              Overlays
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="(overlay, index) in overlays" :key="index" class="space-y-1">
                <p class="text-xs text-theme-500 dark:text-theme-400">
                  Overlay {{ index + 1 }}
                </p>
                <div class="w-full h-32 bg-theme-100 dark:bg-theme-700 rounded relative overflow-hidden">
                  <XMedia
                    :media="{ ...media, effects: { overlay } }"
                    image-mode="cover"
                    class="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
