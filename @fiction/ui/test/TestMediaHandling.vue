<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { MediaObject } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import XMediaInline from '../media/XMediaInline.vue'
import { stockMediaHandler } from '../stock/index.js'

const darkMode = vue.ref(false)

const aspectRatios = ['aspect:square', 'aspect:wide', 'aspect:tall', 'aspect:landscape', 'aspect:portrait'] as const
const alignments = ['left', 'center', 'right'] as const

const containerScenarios = [
  { name: 'Header Logo', class: 'h-16 w-48' },
  { name: 'Sidebar Logo', class: 'h-12 w-full max-w-[200px]' },
  { name: 'Footer Logo', class: 'h-10 w-32' },
  { name: 'Mobile Header', class: 'h-8 w-24' },
  { name: 'Logo Grid Item', class: 'h-24 w-full' },
  { name: 'Banner Logo', class: 'h-20 w-64' },
]

function generateMediaObjects(): MediaObject[] {
  return [
    // Typography example
    {
      typography: {
        text: 'Acme Co.',
        font: 'Arial',
        weight: 'bold',
        letterSpacing: '0.05em',
      },
      format: 'typography',
    },
    // HTML (SVG) example
    { html: `<div class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="currentColor" />
      </svg><div>test</div></div>`, format: 'html' },
    // Icon example
    { iconId: 'github', format: 'iconId' },
    // Image examples
    ...aspectRatios.map(aspect => ({
      url: stockMediaHandler.getRandomByAspectRatio(aspect, { format: 'image' }).url,
      alt: `${aspect} image`,
      format: 'image' as const,
    })),
    // Video example
    { url: stockMediaHandler.getRandomMedia({ format: 'video' }).url, format: 'video' },
  ]
}

const mediaObjects = vue.ref(generateMediaObjects())

function refreshMedia() {
  stockMediaHandler.resetUsedMedia()
  mediaObjects.value = generateMediaObjects()
}

function handleFontLoading(fontKey: string) {
  // Implement actual font loading logic here
}
</script>

<template>
  <div id="test-media-inline" class="min-h-screen p-8" :class="{ dark: darkMode }">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold">
          XMediaInline Test
        </h1>
        <div class="space-x-4">
          <XButton @click="refreshMedia">
            Refresh Media
          </XButton>
          <XButton @click="darkMode = !darkMode">
            Toggle Dark Mode
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

          <div v-for="scenario in containerScenarios" :key="scenario.name" class="mb-6">
            <h3 class="text-sm font-medium mb-2 text-theme-600 dark:text-theme-300">
              {{ scenario.name }}
            </h3>
            <div v-for="alignment in alignments" :key="alignment" class="mb-2">
              <p class="text-xs text-theme-500 dark:text-theme-400 mb-1">
                {{ alignment }}
              </p>
              <div class="bg-theme-100 dark:bg-theme-700 rounded" :class="scenario.class">
                <XMediaInline
                  :media="media"
                  :alignment="alignment"
                  class="w-full h-full"
                  @load-font="handleFontLoading"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
