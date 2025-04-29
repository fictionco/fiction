<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { HeroConfig, OverlayConfig } from './config.js'
import { vue } from '@fiction/core'
import EffectParallax from '@fiction/ui/effect/EffectParallax.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardHeader from '../../el/CardHeader.vue'

const { card } = defineProps<{
  card: Card<HeroConfig>
}>()

const uc = vue.computed(() => card.userConfig.value || {})
const layout = vue.computed(() => uc.value.layout || 'center')

// Media aspect handling
const aspectRatio = vue.computed(() => {
  const aspect = uc.value.media?.aspect || 'auto'
  switch (aspect) {
    case 'square': return 'aspect-square'
    case 'portrait': return 'aspect-[3/4]'
    case 'landscape': return 'aspect-[16/9]'
    default: return '' // auto
  }
})

// Layout classes based on golden ratio principles
const layoutClasses = vue.computed(() => {
  const isLeftOrRight = ['left', 'right'].includes(layout.value)

  return {
    wrapper: [
      'items-center relative',
      isLeftOrRight ? `flex flex-col ${layout.value === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} lg:gap-16` : 'text-center',
    ],
    text: [
      isLeftOrRight ? 'lg:w-[38.2%] flex-shrink-0' : 'mx-auto',
      layout.value === 'center' ? 'px-4' : '',
    ],
    media: {
      wrap: [
        isLeftOrRight ? 'lg:w-[61.8%] flex-grow' : 'mt-12 mx-auto',
        'relative',
      ],
    },
  }
})

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

const overlays = vue.computed(() => uc.value.overlays || [])
</script>

<template>
  <div>
    <div :class="layoutClasses.wrapper">
      <!-- Content Section -->
      <div :class="layoutClasses.text">
        <CardHeader :card />
      </div>

      <!-- Media Section -->
      <div
        v-if="uc.media?.url || uc.media?.html"
        class="flow-root relative [perspective:1000px] w-full"
        :class="layoutClasses.media.wrap"
      >
        <!-- Main Image -->
        <div :class="aspectRatio" class="overflow-hidden rounded-lg">
          <XMedia
            data-option-path="media"
            :media="uc.media"
            class="w-full h-full object-cover"
            :image-mode="!aspectRatio ? 'inline' : 'cover'"
          />
        </div>

        <!-- Overlay Images -->
        <template v-if="overlays.length">
          <div
            v-for="(overlay, i) in overlays"
            :key="i"
            class="absolute z-10"
            :style="getOverlayStyle(overlay)"
          >
            <EffectParallax class="z-0 mx-auto w-full h-full scale-90 md:scale-100">
              <XMedia
                class="rounded-lg shadow-sm"
                :media="overlay?.media"
                image-mode="inline"
              />
            </EffectParallax>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
