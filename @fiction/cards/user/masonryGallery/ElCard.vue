<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { MediaItem, UserConfig } from './config'
import { vue } from '@fiction/core'
import MasonryEffect from '@fiction/ui/effect/EffectMasonry.vue'
import ElLightbox from '@fiction/ui/media/ElLightbox.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'

const props = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => props.card.userConfig.value || {})
const items = vue.computed(() => uc.value.items || [])
const layout = vue.computed(() => uc.value.layout || {})

// Calculate gutter height based on size
const gutterHeight = vue.computed(() => ({
  none: 0,
  sm: 15,
  md: 30,
  lg: 45,
})[layout.value.gapSize || 'md'])

// Base height per row with gutter calculations
const baseRowHeight = vue.computed(() => layout.value.baseRowHeight || 250)

const masonryOptions = vue.computed(() => ({
  percentPosition: true,
  gutter: gutterHeight.value,
}))

const currentLightboxIndex = vue.ref(-1)

function calculateHeight(rows: string) {
  const numRows = Number.parseInt(rows || '1')
  const baseHeight = baseRowHeight.value
  const gutterSpace = (numRows - 1) * gutterHeight.value
  return baseHeight * numRows + gutterSpace
}

function getItemStyle(item: MediaItem) {
  const height = calculateHeight(item.rows || '1')
  return {
    height: `${height}px`,
    maxHeight: `${height}px`,
  }
}

function getItemClasses(item: MediaItem) {
  const cols = item?.cols || '1'

  return [
    'masonry-grid-item',
    'float-left w-full',
    'relative cursor-pointer overflow-hidden rounded-xl',
    'transition-all duration-300',
    {
      'md:w-[23%]': cols === '1',
      'md:w-[48%]': cols === '2',
      'md:w-[74%]': cols === '3',
      'md:w-full': cols === '4',
      'group': true,
    },
  ]
}

function getContentClasses(item: MediaItem) {
  const style = item?.theme || 'primary'
  const showText = item?.showText || layout.value.showAllText

  return [
    'text-white text-left',
    'relative z-10',
    'space-y-2 p-6',
    'max-w-md w-full',
    'transition-all duration-300',
    !showText ? 'opacity-0 group-hover:opacity-100' : '',
    `theme-${style}`,
  ]
}

function getOverlayClasses(item: MediaItem) {
  const showText = item?.showText || layout.value.showAllText

  return [
    'absolute inset-0',
    'transition-all duration-300',
    // Base gradient for always-visible text
    showText ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent' : '',
    'before:absolute before:inset-0',
    'before:bg-black/50',
    'before:opacity-0 group-hover:before:opacity-100',
    'before:transition-opacity before:duration-300',
  ]
}

function showLightbox(index: number) {
  currentLightboxIndex.value = index
}
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <MasonryEffect
      :items="items"
      :options="masonryOptions"
      :class="layout.animation"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="getItemClasses(item)"
        :style="getItemStyle(item)"
        @click="showLightbox(index)"
      >
        <!-- Media Layer -->
        <XMedia
          :media="item?.media"
          :animate="true"
          class="absolute inset-0 object-cover group-hover:scale-110 transition-all duration-500 ease-out"
        />

        <!-- Overlay Layer with Gradient -->
        <div :class="getOverlayClasses(item)" />

        <!-- Content Layer -->
        <div class="absolute inset-0 flex items-end">
          <div :class="getContentClasses(item)">
            <h3
              class="text-xl md:text-2xl font-semibold x-font-title transform "
            >
              {{ item?.title }}
            </h3>
            <p
              class="text-base md:text-lg opacity-90 line-clamp-3"
            >
              {{ item?.content }}
            </p>
          </div>
        </div>
      </div>
    </MasonryEffect>

    <ElLightbox
      v-if="currentLightboxIndex >= 0"
      v-model:active-index="currentLightboxIndex"
      :items="items"
      :show-caption="true"
    />
  </div>
</template>
