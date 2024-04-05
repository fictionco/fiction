<script lang="ts" setup>
import type { MediaItem } from '@fiction/core'
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'

export type UserConfig = {
  items?: MediaItem[]
}

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const temp = vue.computed(() => {
  const it = []
  // for loop 10 times
  for (let i = 0; i < 15; i++) {
    const items = props.card.userConfig.value.items || []
    // add it to the end of the array
    it.push(...items)
  }

  return it
})
</script>

<template>
  <div class="marquee relative z-10 mx-auto overflow-hidden">
    <div class="marquee-track">
      <div class="marquee-grid grid">
        <div
          v-for="(item, i) in temp"
          :key="i"
          class="marquee-item relative overflow-hidden"
        >
          <div v-if="item.media" class="item-media absolute inset-0">
            <img
              :src="item.media.url"
              class="absolute inset-0 h-full w-full object-cover object-center"
            >
            <div class="grad absolute inset-0" />
          </div>
          <div class="absolute bottom-0 p-6 text-white">
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
.marquee {
  --card-media-width: 273px;
  --card-media-height: 340px;
  --grid-gap: 32px;
  --card-count: v-bind(temp.length);
  .marquee-track {
    width: fit-content;
    animation: marqueeDesktop
      calc(var(--card-speed, 7s) * var(--card-count, 20)) linear infinite;
  }
  .marquee-grid {
    grid-auto-columns: -webkit-min-content;
    grid-auto-columns: min-content;
    grid-auto-flow: column;
    width: fit-content;
    gap: var(--grid-gap);
  }

  .marquee-item {
    width: var(--card-media-width);
    height: var(--card-media-height);
    clip-path: inset(0 round 30px);
    .grad {
      background: radial-gradient(
        circle at left bottom,
        rgba(0, 0, 0, 0.85) 0,
        transparent 60%
      );
    }
  }
}
@keyframes marqueeDesktop {
  0% {
    transform: translate3d(0, 0, 0);
  }

  100% {
    transform: translate3d(calc(-50% - 16px), 0, 0);
  }
}
</style>
