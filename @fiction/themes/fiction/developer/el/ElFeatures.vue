<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import FigurePlugins from './fig/FigurePlugins.vue'
import FigurePoweredBy from './fig/FigurePoweredBy.vue'
import FigureThemes from './fig/FigureThemes.vue'

export type UserConfig = any
defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const features = [
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
</svg>`,
    title: `Modern Tech`,
    text: `Use the latest open-source libraries built for simplicity and performance.`,
    figure: FigurePoweredBy,
    link: { path: '/docs', text: 'View Docs' },
  },

  {
    title: `Advanced Plugins`,
    text: `Leverage a growing library of pre-made plugins or create your own.`,
    figure: FigurePlugins,
    link: { path: '/plugins', text: 'View Plugins' },
  },
  {
    title: 'Quick Setup',
    text: `FictionOS is built to be easy to use and quick to set up. Get started in minutes.`,
    figure: FigureThemes,
    link: { path: '/showcase', text: 'View Showcase' },
  },
]
</script>

<template>
  <section class="w-full">
    <div
      v-for="(feature, i) in features"
      :key="i"
      class="py-16 lg:py-0"
    >
      <div
        class="min-h-4/5 grid items-center gap-20 lg:grid-cols-2"
        :class="[i % 2 === 0 ? 'even' : 'odd lg:grid-flow-row-dense']"
      >
        <div
          class="min-w-0"
          :class="[
            i % 2 === 0
              ? 'lg:col-start-1 lg:justify-self-end'
              : 'lg:col-start-2',
          ]"
        >
          <div class="max-w-full px-6 pt-12 pb-4 lg:max-w-xl lg:py-40">
            <div
              v-if="feature.icon"
              class="bg-primary-500 dark:bg-primary-950 mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-primary-400 dark:border-primary-800 shadow-md"
            >
              <div class="h-6 w-6 text-white" v-html="feature.icon" />
            </div>

            <h2 class="mb-6 text-4xl lg:text-6xl tracking-tight font-bold x-font-title">
              {{ feature.title }}
            </h2>
            <div class="mb-4 text-xl lg:text-3xl text-theme-500 dark:text-theme-100 leading-relaxed text-balance ">
              {{ feature.text }}
            </div>
          </div>
        </div>
        <div
          class="relative flex h-full min-w-0 items-center justify-center"
          :class="[
            i % 2 === 0 ? 'lg:col-start-2' : 'lg:col-start-1 lg:justify-end',
          ]"
        >
          <component :is="feature.figure" />
        </div>
      </div>
    </div>
  </section>
</template>
