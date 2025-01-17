<script setup lang="ts">
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import { pathCheck, vue } from '@fiction/core'
import ClipPathAnim from '@fiction/ui/anim/AnimClipPath.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../CardText.vue'
import CardActionArea from '../el/CardActionArea.vue'
import SuperTitle from '../el/SuperTitle.vue'
import { schema } from './config'
import {
  getContentStyles,
  getGradientStyle,
  getGridStyle,
  getItemStyles,
  getPositionStyles,
  getTextOverlayStyles,
} from './utils'

const props = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => props.card.userConfig.value)
const bentoWrapEl = vue.ref<HTMLElement | null>(null)
const gapClass = vue.computed(() => {
  const gapMap = {
    'xxs': 'gap-1',
    'xs': 'gap-3',
    'sm': 'gap-4',
    'md': 'gap-4 lg:gap-8',
    'lg': 'gap-4 lg:gap-12',
    'xl': 'gap-4 lg:gap-16',
    '2xl': 'gap-4 lg:gap-24',
  }

  return gapMap[uc.value.gapSize || 'md']
})
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <div ref="bentoWrapEl" class="grid grid-cols-12 auto-rows-[200px]" :class="[gapClass]">
      <ClipPathAnim
        v-for="(item, i) in uc.items"
        :key="i"
        :animate="uc.animate || 'expand'"
        caller="bento"
        class="bento-item relative overflow-hidden group rounded-3xl transition-all duration-300 @container"
        :style="[getGridStyle(item).style, getItemStyles(item, bentoWrapEl)]"
        :class="getGridStyle(item).class"
      >
        <div
          class="relative h-full  flex flex-col z-10 pointer-events-none"
          :style="[
            getPositionStyles(item),
            item.bg?.url ? getTextOverlayStyles(item) : {},
          ]"
        >
          <div
            class="flex flex-col h-full "
          >
            <div v-if="(!item.verticalPosition || item.verticalPosition !== 'top')" class="h-full">
              <XMedia
                v-if="item.media"
                :media="item.media"
                class="h-full w-full"
                :style="{ width: item.media.displayWidthPercent ? `${item.media.displayWidthPercent}%` : 'auto' }"
              />
            </div>
            <div class="px-6 py-8 @xs:px-8 @xs:py-10 @2xl:p-12 @4xl:p-16 space-y-6 ">
              <div class="space-y-4 max-w-[650px] pointer-events-auto">
                <SuperTitle
                  :card
                  :base-path="pathCheck(`items.${i}.superTitle`, schema)"
                  :classes="{ text: 'text-sm @lg:text-base @2xl:text-lg font-medium opacity-90 font-sans' }"
                  :theme="item.bg?.url ? 'overlay' : (item.theme || 'default')"
                />

                <div class="space-y-4 xl:space-y-6 ">
                  <CardText
                    v-if="item.title"
                    :card
                    :path="pathCheck(`items.${i}.title`, schema)"
                    tag="h3"
                    class="text-2xl @xs:text-3xl @xl:text-4xl @5xl:text-6xl @xl:mb-2 @5xl:mb-4 text-balance font-semibold  x-font-title"
                    :style="getContentStyles(item, 'text', bentoWrapEl)"
                  />

                  <CardText
                    v-if="item.content"
                    :card
                    :path="pathCheck(`items.${i}.content`, schema)"
                    tag="p"
                    class="line-clamp-3 opacity-90 @xs:text-lg @xl:text-xl @5xl:text-2xl text-balance"
                    :style="getContentStyles(item, 'sub', bentoWrapEl)"
                  />
                </div>
              </div>

              <CardActionArea
                :card
                class="pointer-events-auto"
                :base-path="pathCheck(`items.${i}.action`, schema)"
                :classes="{ buttons: 'flex gap-4' }"
                design="outline"
                :theme="(item.bg?.url ? 'overlay' : (item.theme || 'default'))"
              />
            </div>

            <div v-if=" item.verticalPosition === 'top'" class="grow h-full">
              <XMedia
                v-if="item.media"
                :media="item.media"
                class="h-full w-full"
                :style="{ width: item.media.displayWidthPercent ? `${item.media.displayWidthPercent}%` : 'auto' }"
              />
            </div>
          </div>
        </div>

        <a
          v-if="item.href"
          :href="item.href"
          class="absolute inset-0 z-20"
          @click="card.goto(item.href)"
        />

        <div
          v-if="item.bg"
          class="z-[5] absolute inset-0 mix-blend-multiply pointer-events-none"
          :style="getGradientStyle(item)"
        />

        <XMedia
          v-if="item.bg"
          :media="item.bg"
          class="absolute inset-0 z-0 pointer-events-auto"
          image-mode="cover"
        />
      </ClipPathAnim>
    </div>
  </div>
</template>
