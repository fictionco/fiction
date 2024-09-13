<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './index.js'
import CardText from '@fiction/cards/CardText.vue'
import { vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim/index.js'
import EffectFitText from '@fiction/ui/effect/EffectFitText.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const layout = vue.computed(() => uc.value.layout || 'default')

const isDefaultLayout = vue.computed(() => !uc.value.layout || uc.value.layout === 'default')

vue.onMounted(() => {
  useElementVisible({
    selector: `#${props.card.cardId}`,
    onVisible: async () => {
      await animateItemEnter({ targets: `#${props.card.cardId} .x-action-item`, themeId: 'rise', config: { overallDelay: 600, totalAnimationTime: 2000 } })
    },
  })
})
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <div
      class="mx-auto"
      :class="[
        !isDefaultLayout ? 'max-w-screen-xl' : 'max-w-screen-lg',
      ]"
    >
      <div
        class="flex flex-col lg:gap-12 xl:gap-32 justify-center"
        :class="[
          uc.layout === 'left' ? 'lg:flex-row-reverse' : '',
          uc.layout === 'right' ? 'lg:flex-row' : '',
        ]"
      >
        <div
          v-if="uc.media"
          class="w-full relative "
          :class="[
            !isDefaultLayout ? 'lg:w-[45%] lg:mb-0 hidden lg:flex  items-center justify-center  mb-16 py-12 ' : 'hidden',
          ]"
        >
          <div class="relative h-full max-h-[800px]" :class="[layout === 'right' ? 'right-0' : '', !isDefaultLayout ? 'w-full' : 'w-full']">
            <XMedia :animate="true" :media="uc.media" class="w-full h-full object-cover rounded-lg overflow-hidden" />
          </div>
        </div>
        <div
          class="w-full"
          :class="[
            !isDefaultLayout ? 'lg:w-[55%]' : '',
          ]"
        >
          <EffectFitText :content="uc.title || ''" class="max-w-screen-md mx-auto text-center mb-16 x-font-title font-medium" :lines="1">
            <CardText :card tag="span" path="title" animate="rise" />
          </EffectFitText>
          <div
            :class="[
              isDefaultLayout ? 'grid lg:grid-cols-[1fr_1fr] gap-16' : 'space-y-16',
            ]"
          >
            <div
              v-for="(item, i) in uc.items"
              :key="i"
              class="flex flex-col md:flex-row items-start gap-6 x-action-item"
              :class="[
                isDefaultLayout ? [
                  i % 2 === 0 ? 'lg:col-start-1' : 'lg:col-start-2',
                  i % 2 === 0 ? 'lg:row-span-2' : 'lg:row-start-[calc(var(--row)*2)]',
                ] : '',
              ]"
              :style="isDefaultLayout ? { '--row': Math.floor(i / 2) + 1 } : {}"
            >
              <div class="flex-shrink-0 size-16 bg-primary-200/20 dark:bg-primary-700/30 text-primary-400 dark:text-primary-500 rounded-full flex items-center justify-center">
                <span class="text-4xl font-semibold font-sans">{{ i + 1 }}</span>
              </div>
              <div>
                <p class="text-2xl x-font-title leading-relaxed">
                  {{ item.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
