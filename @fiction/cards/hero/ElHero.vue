<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElImage from '@fiction/ui/media/ElImage.vue'
import EffectParallax from '@fiction/ui/effect/EffectParallax.vue'
import CardHeader from '../el/CardHeader.vue'

import type { OverlayConfig, UserConfig } from './index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})

const wrapperClass = vue.computed(() => {
  const out = ['gap-8 lg:gap-20 items-center']

  if (uc.value.layout === 'right')
    out.push('flex flex-col lg:flex-row-reverse')

  else if (uc.value.layout === 'left')
    out.push('flex flex-col lg:flex-row')

  return out.join(' ')
})

const textWrapClass = vue.computed(() => {
  const out = []
  const layout = uc.value.layout || ''

  if (['right', 'left'].includes(layout))
    out.push('max-w-xl flex-auto')

  return out.join(' ')
})

const mediaWrapClass = vue.computed(() => {
  const out = []
  const layout = uc.value.layout || ''

  if (['right', 'left'].includes(layout))
    out.push('w-full lg:w-[50%]')
  else
    out.push('mt-16 sm:mt-20 w-full')

  return out.join(' ')
})

const mediaClass = vue.computed(() => {
  const out = []
  const layout = uc.value.layout || ''

  if (['right', 'left'].includes(layout))
    out.push('aspect-[5/3] w-full')
  else
    out.push('aspect-[2/1]')

  return out.join(' ')
})

function getOverlayStyle(overlay: OverlayConfig) {
  const defaultOffset = '-5%'
  const defaultOffsetIn = '8%'
  const overlayStyles = {
    top: { top: defaultOffsetIn, left: '50%', transform: 'translateX(-50%)' },
    bottom: { bottom: defaultOffset, left: '50%', transform: 'translateX(-50%)' },
    left: { left: defaultOffset, top: '50%', transform: 'translateY(-50%)' },
    right: { right: defaultOffset, top: '50%', transform: 'translateY(-50%)' },
    center: { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' },
    bottomRight: { right: defaultOffset, bottom: defaultOffset, transform: 'translate(0, 0)' },
    topRight: { right: defaultOffset, top: defaultOffsetIn, transform: 'translate(0, 0)' },
    bottomLeft: { left: defaultOffset, bottom: defaultOffsetIn, transform: 'translate(0, 0)' },
    topLeft: { left: defaultOffset, top: defaultOffsetIn, transform: 'translate(0, 0)' },
  } as const

  const width = overlay.widthPercent || 30
  const position = overlay.position || 'bottomRight'
  return { ...overlayStyles[position], width: `${width}%` }
}

const overlays = vue.computed(() => uc.value.overlays || [])
</script>

<template>
  <div>
    <div :class="wrapperClass">
      <div :class="textWrapClass">
        <CardHeader :card />
      </div>

      <div

        v-if="uc.splash"
        class="flow-root relative [perspective:1000px]"
        :class="mediaWrapClass"
      >
        <ElImage
          data-key="splash"
          class="w-full rounded-lg overflow-hidden dark:ring-1 dark:ring-theme-800"
          :class="mediaClass"
          :media="uc.splash"
          :animate="true"
        />
        <template v-if="overlays">
          <div
            v-for="(overlay, ii) in overlays"
            :key="ii"
            class="absolute z-10"
            :style="getOverlayStyle(overlay)"
            :data-position="overlay.position"
          >
            <EffectParallax class="z-0 mx-auto w-full h-full scale-90 md:scale-100 ">
              <img class="rounded-xl" :src="overlay?.media?.url">
            </EffectParallax>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
