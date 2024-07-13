<script lang="ts" setup>
import { getNavComponentType, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import type { UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const loaded = vue.ref(false)
const uc = vue.computed(() => props.card.userConfig.value)

const temp = vue.computed(() => {
  const it = []
  // for loop 10 times
  for (let i = 0; i < 15; i++) {
    const items = uc.value.items || []
    // add it to the end of the array
    it.push(...items)
  }

  return it
})

function getStagger(index: number): string {
  if (!uc.value.stagger)
    return ''

  const staggerClasses = [
    'translate-y-[10px]',
    'translate-y-[-20px]',
    'translate-y-[30px]',
    'translate-y-[-10px]',
    'translate-y-[20px]',
    'translate-y-[-30px]',
  ]

  return staggerClasses[index % staggerClasses.length] || ''
}

vue.onMounted(() => {
  useElementVisible({
    selector: `#${props.card.cardId}`,
    onVisible: async () => {
      await animateItemEnter({ targets: `#${props.card.cardId} .x-action-item`, themeId: 'fade', config: { overallDelay: 100, isRandom: true } })
      loaded.value = true
    },
  })
})
</script>

<template>
  <div class="marquee relative z-10 mx-auto " :class="loaded ? '' : 'invisible'">
    <div class="marquee-track" :class="uc.direction === 'right' ? 'reverse' : ''">
      <div class="marquee-grid grid">
        <component
          :is="getNavComponentType(item)"
          v-for="(item, i) in temp"
          :key="i"
          :to="item.href"
          :href="item.href"
          class=" marquee-item relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.33,1)]"
          :class="[getStagger(i), item.href ? 'hover:-translate-y-1 hover:scale-105' : '']"
          :data-display-items="temp.length"
          :data-display-direction="uc.direction || 'left'"
        >
          <div class=" x-action-item absolute inset-0 transition-all duration-1000  opacity-0">
            <div v-if="item.media" class="item-media absolute inset-0 bg-white">
              <img
                :src="item.media.url"
                class="absolute inset-0 h-full w-full object-cover object-center"
              >
              <div class="grad absolute inset-0 transition-all show-on-hover" />
            </div>
            <div class="absolute bottom-0 p-6 text-white show-on-hover">
              <h2 class="font-semibold text-xl x-font-title">
                {{ item.name }}
              </h2>
              <div class="opacity-70 font-medium ">
                {{ item.desc }}
              </div>
            </div>
          </div>
        </component>
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
    animation: marqueeDesktop calc(var(--card-speed, 7s) * var(--card-count, 20)) linear infinite;
    &.reverse {
      animation-direction: reverse; // Reverses the animation direction
    }
    &:hover {
      animation-play-state: paused;
    }
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
      background: radial-gradient( circle at left bottom,  rgba(0, 0, 0, 0.55) 0,  transparent 70%  );

    }

    .show-on-hover{
      opacity: 1;
      transition: opacity 0.3s;
    }
    &:hover .show-on-hover{
      opacity: 1;
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
