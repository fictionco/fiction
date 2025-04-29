<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'
import type { HeroConfig, OverlayConfig } from './config.js'
import { pathCheck, vue } from '@fiction/core'
import EffectParallax from '@fiction/ui/effect/EffectParallax.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../../CardText.vue'
import CardWrap from '../../CardWrap.vue'
import CardActionArea from '../../el/CardActionArea.vue'
import XSuperTitle from '../../el/SuperTitle.vue'
import { schema } from './config.js'

const { card } = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => card.userConfig.value || {})

function getClasses(item: HeroConfig) {
  const layout = item.layout || 'center'
  const isLeftOrRight = ['left', 'right'].includes(layout)
  return {
    layout,
    wrapper: [
      'items-center relative',
      isLeftOrRight ? `flex flex-col ${layout === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} lg:gap-16` : 'text-center',
    ],
    text: [
      isLeftOrRight ? 'lg:basis-1/2' : 'mx-auto',
      layout === 'center' ? 'px-4' : '',
    ],
    textWrap: [
      layout === 'justify' ? 'lg:flex justify-between text-left items-end gap-8' : '',
      layout === 'left' || layout === 'right' ? 'text-left' : '',
      layout === 'center' ? 'mx-auto text-left md:text-center' : '',
    ],
    media: {
      wrap: [
        isLeftOrRight ? 'lg:basis-1/2' : 'mt-12 mx-auto',
        'relative',
      ],
    },
    aspectRatio: item.media?.aspect === 'square' ? 'aspect-square' : item.media?.aspect === 'portrait' ? 'aspect-[3/4]' : item.media?.aspect === 'landscape' ? 'aspect-[16/9]' : '',
  }
}

// Overlay positioning system - simplified for better usability
const overlayStyles = {
  top: { top: '8%', left: '50%', transform: 'translateX(-50%)', transformOrigin: 'center bottom' },
  bottom: { bottom: '-5%', left: '50%', transform: 'translateX(-50%)', transformOrigin: 'center top' },
  left: { left: '-5%', top: '50%', transform: 'translateY(-50%)', transformOrigin: 'right center' },
  right: { right: '-5%', top: '50%', transform: 'translateY(-50%)', transformOrigin: 'left center' },
  center: { left: '50%', top: '50%', transform: 'translate(-50%, -50%)', transformOrigin: 'center center' },
  bottomRight: { right: '-5%', bottom: '-5%', transform: 'translate(0, 0)', transformOrigin: 'left top' },
  topRight: { right: '-5%', top: '8%', transform: 'translate(10%, 0)', transformOrigin: 'left bottom' },
  bottomLeft: { left: '-5%', bottom: '8%', transform: 'translate(0, 0)', transformOrigin: 'right top' },
  topLeft: { left: '-5%', top: '8%', transform: 'translate(0, 0)', transformOrigin: 'right bottom' },
} as const

function getOverlayStyle(overlay: OverlayConfig) {
  const { position = 'bottomRight', widthPercent = 30 } = overlay
  return { ...overlayStyles[position], width: `${widthPercent}%` }
}
</script>

<template>
  <CardWrap :card>
    <div class="space-y-48">
      <div v-for="(item, i) in uc.items" :key="i" :class="getClasses(item).wrapper">
        <!-- Content Section -->
        <div :class="getClasses(item).text">
          <div class="space-y-6 ">
            <div
              :class="getClasses(item).textWrap"
              class="space-y-4 @container/header"
              data-option-path="layout"
              :data-layout="getClasses(item).layout"
            >
              <div class="max-w-screen-md space-y-4" :class="item.layout === 'justify' ? 'lg:min-w-[50%]' : 'mx-auto'">
                <XSuperTitle
                  :card
                  :base-path="pathCheck(`items.${i}.superTitle`, schema)"
                  :class="[item.layout === 'center' || !item.layout ? 'md:justify-center' : '']"
                />
                <CardText
                  tag="h1"
                  :card
                  class="x-font-title font-semibold md:text-balance text-3xl @[300px]/header:text-4xl @[600px]/header:text-5xl !leading-[1.2]"
                  :path="pathCheck(`items.${i}.title`, schema)"
                  placeholder="Title"
                  animate="fade"
                />
              </div>
              <div class="max-w-screen-md space-y-4" :class="item.layout === 'justify' ? 'lg:max-w-[40%]' : 'mx-auto'">
                <CardText
                  tag="h3"
                  :card
                  class="text-lg  @[300px]/header:text-xl @[600px]/header:text-2xl md:text-balance text-theme-800 dark:text-theme-300 !leading-relaxed"
                  :class="item.layout === 'justify' ? 'lg:text-right' : ''"
                  :path="pathCheck(`items.${i}.subTitle`, schema)"
                  placeholder="Sub Title"
                  animate="fade"
                />
                <CardActionArea
                  v-if="item.layout === 'justify'"
                  :base-path="pathCheck(`items.${i}.action`, schema)"
                  :card
                  :classes="{ buttons: ['flex gap-4 lg:gap-6 justify-start md:justify-end'].join(' ') }"
                  size="md"
                />
              </div>
            </div>
            <CardActionArea
              v-if="item.layout !== 'justify'"
              :base-path="pathCheck(`items.${i}.action`, schema)"
              :card
              :classes="{
                buttons: [['justify', 'left', 'right'].includes(item.layout || '') ? 'justify-start' : 'justify-start md:justify-center', 'flex gap-4'].join(' '),
              }"
              size="lg"
            />
          </div>
        </div>

        <!-- Media Section -->
        <div
          v-if="item.media?.url || item.media?.html"
          class="flow-root relative [perspective:1000px] w-full"
          :class="getClasses(item).media.wrap"
        >
          <!-- Main Image -->
          <div :class="getClasses(item).aspectRatio" class="overflow-hidden rounded-lg">
            <XMedia
              data-option-path="media"
              :media="item.media"
              class="w-full h-full object-cover"
              :image-mode="!getClasses(item).aspectRatio ? 'inline' : 'cover'"
              :path="pathCheck(`items.${i}.media`, schema)"
              :card
            />
          </div>

          <!-- Overlay Images -->
          <template v-if="item.overlays?.length">
            <div
              v-for="(overlay, ii) in item.overlays"
              :key="ii"
              class="absolute z-10"
              :style="getOverlayStyle(overlay)"
            >
              <EffectParallax class="z-0 mx-auto w-full h-full scale-90 md:scale-100">
                <XMedia
                  class="rounded-lg shadow-sm"
                  :media="overlay?.media"
                  image-mode="inline"
                  :path="pathCheck(`items.${i}.overlays.${ii}.media`, schema)"
                  :card
                />
              </EffectParallax>
            </div>
          </template>
        </div>
      </div>
    </div>
  </CardWrap>
</template>
