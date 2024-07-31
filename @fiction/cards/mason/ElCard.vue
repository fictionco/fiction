<script lang="ts" setup>
import { vue } from '@fiction/core'

import type { Card } from '@fiction/site'
import ElImage from '@fiction/ui/media/ElImage.vue'
import MasonryEffect from '@fiction/ui/effect/EffectMasonry.vue'
import ElLightbox from '@fiction/ui/media/ElLightbox.vue'

import type { MediaItem, UserConfig } from './index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const items = vue.computed(() => uc.value.items || [])

const masonryOptions = {
  percentPosition: true,
  gutter: 30,
}

const currentLightboxIndex = vue.ref(-1)

function getWidthClass(item: MediaItem) {
  const cols = item.columns || '1'
  const ar = item.rows || '1'

  const w = {
    4: '',
    3: 'md:w-[74%]',
    2: 'md:w-[48%]',
    1: 'md:w-[23%]',
  }

  const r = {
    4: 'h-[100dvh]',
    3: 'h-[75dvh]',
    2: 'h-[50dvh]',
    1: 'h-[25dvh]',
  }

  return [w[cols], r[ar]].join(' ')
}

function showLightbox(index: number) {
  currentLightboxIndex.value = index
}
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <MasonryEffect :items="items" :options="masonryOptions" gap="2vw">
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="[getWidthClass(item)]"
        class="masonry-grid-item float-left w-full relative cursor-pointer overflow-hidden rounded-xl"
        @click.stop="showLightbox(index)"
      >
        <ElImage class="absolute inset-0 object-cover" :media="item?.media" :animate="true" />
        <div class="rounded-[20px] absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div class="text-white text-left p-6 max-w-md absolute bottom-0 right-0 space-y-2">
            <h3 class="text-xl font-semibold x-font-title">
              {{ item.title }}
            </h3>
            <p class="line-clamp-3 opacity-75 text-lg">
              {{ item.content }}
            </p>
          </div>
        </div>
      </div>
      <div class="gutter-sizer w-[2%]" />
    </MasonryEffect>

    <ElLightbox v-model:activeIndex="currentLightboxIndex" :items />
  </div>
</template>
