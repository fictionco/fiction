<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'
import type { Card } from '@fiction/site'
import fitty from 'fitty'
import NavDots from '../el/NavDots.vue'

import type { UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const mediaItems = vue.computed(() => {
  return uc.value.items
})

const activeItem = vue.ref(0)
</script>

<template>
  <div class="relative h-screen w-full">
    <div class="absolute inset-0 flex overflow-x-auto no-scrollbar snap-mandatory snap-x">
      <div v-for="(item, i) in mediaItems" :key="i" :data-index="i" class=" relative flex-shrink-0 snap-center w-full h-full">
        <div class="absolute inset-0 bg-opacity-50 bg-black/50 z-10" />
        <template v-if="item.media">
          <template v-if="item.media.format === 'video'">
            <video class="object-cover w-full h-full" autoplay muted loop>
              <source :src="item.media.url" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </template>
          <template v-else>
            <img :src="item.media.url" alt="Media" class="object-cover w-full h-full">
          </template>
        </template>
        <div class="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4 z-20">
          <div class="max-w-screen-lg space-y-8 p-6">
            <h1 class="  text-6xl lg:text-[calc(20px+6vw)] font-bold x-font-title text-balance">
              {{ item.header }}
            </h1>
            <p class="mt-2 text-3xl lg:text-[calc(16px+3vw)] text-balance leading-none">
              {{ item.subHeader }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <NavDots v-model:active-item="activeItem" :items="mediaItems || []" :container-id="card.cardId" class="absolute bottom-4 z-20" />
  </div>
</template>
