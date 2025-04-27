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

// Layout classes based on user config
const layoutClasses = vue.computed(() => {
  const isWideMedia = !!['landscape', 'wide', 'golden'].includes(uc.value.media?.aspect || '')
  return {
    wrapper: [
      'gap-8  items-center',
      {
        'flex flex-col lg:flex-row-reverse lg:gap-28': layout.value === 'right',
        'flex flex-col lg:flex-row lg:gap-20': layout.value === 'left',
      },
    ],
    text: [
      { 'max-w-xl flex-auto': ['right', 'left'].includes(layout.value) },
    ],
    media: {
      wrap: [
        ['right', 'left'].includes(layout.value)
          ? isWideMedia ? 'w-full' : 'w-full basis-[60%]'
          : 'mt-16 sm:mt-20 w-full',
      ],
      aspect: [
        'w-full',
      ],
    },
  }
})

// Overlay positioning system
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
  <div :class="card.classes.value.contentWidth">
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
        <XMedia
          data-option-path="media"
          :class="layoutClasses.media.aspect"
          :media="uc.media"
          image-mode="inline"
          class="w-full"
          :animate="true"
        />

        <!-- Overlay Images -->
        <template v-if="overlays.length">
          <div
            v-for="(overlay, ii) in overlays"
            :key="ii"
            class="absolute z-10"
            :style="getOverlayStyle(overlay)"
          >
            <EffectParallax class="z-0 mx-auto w-full h-full scale-90 md:scale-100">
              <XMedia
                class="rounded-xl"
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
