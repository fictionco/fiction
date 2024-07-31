<script lang="ts" setup>
import { vue } from '@fiction/core'

import type { Card } from '@fiction/site'
import ElImage from '@fiction/ui/media/ElImage.vue'
import MasonryEffect from '@fiction/ui/effect/EffectMasonry.vue'
import CardText from '../CardText.vue'
import CustomLightbox from './CustomLightbox.vue'

import type { MediaItem, UserConfig } from './index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const items = vue.computed(() => uc.value.items || [])

const masonryOptions = {
  percentPosition: true,
  gutter: 20,
}

const lightboxVisible = vue.ref(false)
const currentLightboxIndex = vue.ref(0)
const currentLightboxItem = vue.ref<MediaItem>()

function getWidthClass(item: MediaItem) {
  const cols = item.columns || '1'
  const ar = item.rows || '1'

  const w = {
    4: '',
    3: 'md:w-[74.5%]',
    2: 'md:w-[48%]',
    1: 'md:w-[24.5%]',
  }

  const r = {
    4: 'h-[100dvh]',
    3: 'h-[75dvh]',
    2: 'h-[50dvh]',
    1: 'h-[25dvh]',
  }

  return [w[cols], r[ar]].join(' ')
}

function showLightbox(index: number, item: MediaItem) {
  currentLightboxIndex.value = index
  currentLightboxItem.value = item
}
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <MasonryEffect :items="items" :options="masonryOptions" gap="2vw">
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="[getWidthClass(item)]"
        class="masonry-grid-item float-left w-full relative cursor-pointer"
        @click="showLightbox(index, item)"
      >
        <ElImage class="absolute inset-0 object-cover" :media="item?.media" :animate="true" />
        <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div class="text-white text-center p-4">
            <h3 class="text-xl font-bold">
              {{ item.title }}
            </h3>
            <p>{{ item.content }}</p>
          </div>
        </div>
      </div>
    </MasonryEffect>

    <CustomLightbox
      v-model:item="currentLightboxItem"
      :index="currentLightboxIndex"
    />
  </div>
</template>
