<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { MediaItem } from '@fiction/core'
import type { Card } from '@fiction/site'

export type UserConfig = {
  items: MediaItem[]
}

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const uc = vue.computed(() => props.card.userConfig.value)

const temp = vue.computed(() => {
  const it = []
  // for loop 10 times
  for (let i = 0; i < 15; i++) {
    // add it to the end of the array
    it.push(...uc.value.items)
  }

  return it
})

function isVideo(url?: string) {
  if (!url)
    return false
  return url.match(/\.(mp4|webm|ogg)$/) !== null
}
</script>

<template>
  <div class="media-grid relative z-10 mx-auto">
    <div class="media-grid-track">
      <div class="media-grid-grid grid">
        <div
          v-for="(item, i) in temp"
          :key="i"
          class="media-grid-item group relative overflow-hidden"
        >
          <div v-if="item.media" class="item-media absolute inset-0">
            <video
              v-if="isVideo(item.media.url)"
              playsinline
              autoplay
              loop
              muted="true"
              width="360"
              height="270"
              class="absolute inset-0 h-full w-full object-cover object-center"
              :src="item.media.url"
            />
            <img
              v-else
              :src="item.media.url"
              class="absolute inset-0 h-full w-full object-cover object-center"
            >
            <div
              class="grad absolute inset-0 opacity-0 transition-all group-hover:opacity-100"
            />
          </div>
          <div
            class="absolute bottom-0 p-6 text-white opacity-0 transition-all group-hover:opacity-100"
          >
            <h2 class="font-bold">
              {{ item.name }}
            </h2>
            <div class="opacity-60">
              {{ item.desc }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.media-grid {
  --card-media-width: 360px;
  --card-media-height: 270px;
  --grid-gap: 32px;
  --card-count: v-bind(temp.length);
  display: grid;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 48px;
  justify-items: center;
  gap: var(--grid-gap);
  .media-grid-track {
    display: grid;
    grid-auto-columns: min-content;
    grid-auto-flow: column;
    width: fit-content;
    gap: var(--grid-gap);
  }
  .media-grid-grid {
    grid-auto-columns: min-content;
    grid-auto-flow: column;
    width: fit-content;
    gap: var(--grid-gap);
  }

  .media-grid-item {
    width: var(--card-media-width);
    height: var(--card-media-height);
    clip-path: inset(0 round 20px);
    .grad {
      background: radial-gradient(
        circle at left bottom,
        rgba(0, 0, 0, 0.85) 0,
        transparent 60%
      );
    }
  }
}
</style>
