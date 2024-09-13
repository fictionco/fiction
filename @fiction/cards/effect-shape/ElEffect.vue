<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { Shape, UserConfig } from './index.js'
import { isDarkOrLightMode, normalizeColor, vue } from '@fiction/core'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const shapes = vue.computed(() => props.card.fullConfig.value?.shapes || [])

const SHAPE_PATHS: Record<NonNullable<Shape['shape']>, string> = {
  square: 'M0 0h100v100H0z',
  circle: 'M50 0a50 50 0 100 100A50 50 0 0050 0z',
  triangle: 'M50 0L100 100H0z',
  hexagon: 'M25 0L75 0L100 50L75 100L25 100L0 50Z',
  star: 'M50 0L61 35H97L68 57L79 91L50 70L21 91L32 57L3 35H39Z',
  pentagon: 'M50 0L100 38L81 100H19L0 38Z',
  octagon: 'M29.3 0H70.7L100 29.3V70.7L70.7 100H29.3L0 70.7V29.3L29.3 0Z',
  diamond: 'M50 0L100 50L50 100L0 50Z',
  cross: 'M35 0H65V35H100V65H65V100H35V65H0V35H35V0Z',
  heart: 'M50 90C22.4 69.5 0 51.6 0 29.9 0 13.5 12.4 0 27.6 0 36.5 0 45.1 4.2 50 11.9 54.9 4.2 63.5 0 72.4 0 87.6 0 100 13.5 100 29.9 100 51.6 77.6 69.5 50 90Z',
}

const ORIGIN_TRANSFORMS: Record<NonNullable<Shape['position']['origin']>, { x: number, y: number, translate: { x: number, y: number }, transformOrigin?: string }> = {
  topLeft: { x: 0, y: 0, translate: { x: 0, y: 0 } },
  topCenter: { x: 50, y: 0, translate: { x: -50, y: 0 } },
  topRight: { x: 100, y: 0, translate: { x: -100, y: 0 } },
  middleLeft: { x: 0, y: 50, translate: { x: 0, y: -50 } },
  middleCenter: { x: 50, y: 50, translate: { x: -50, y: -50 } },
  middleRight: { x: 100, y: 50, translate: { x: -100, y: -50 } },
  bottomLeft: { x: 0, y: 100, translate: { x: 0, y: -100 } },
  bottomCenter: { x: 50, y: 100, translate: { x: -50, y: -100 } },
  bottomRight: { x: 100, y: 100, translate: { x: -100, y: -100 } },
}

function getShapeStyle(shape: Shape) {
  const { position, scale = 1, rotation = 0, blendMode } = shape
  const { x = 0, y = 0, translate, transformOrigin } = ORIGIN_TRANSFORMS[position.origin || 'topRight']
  const { offsetX = 0, offsetY = 0 } = position
  const transform = [
    `translate(${translate.x || 0}%, ${translate.y}%)`,
    `scale(${scale})`,
    `rotate(${rotation}deg)`,

  ].filter(Boolean).join(' ')

  const ss = {
    transform,
    transformOrigin,
    left: `${x + offsetX}%`,
    top: `${y + offsetY}%`,
    mixBlendMode: blendMode || 'normal',
  }

  return ss
}

const wrapperRef = vue.ref<HTMLElement | null>(null)

function getShapeColor(shape: Shape): string {
  const mode = isDarkOrLightMode(wrapperRef.value)
  const defaultColor = mode === 'dark' ? '#ffffff' : '#000000'
  const color = shape.color || defaultColor
  const opacity = shape.opacity || 1
  return normalizeColor({ color, opacity })
}
</script>

<template>
  <div v-for="(shape, i) in shapes" :key="i" :style="getShapeStyle(shape)" class="absolute z-[-4] size-[15vw] md:size-[10vw] xl:size-[5vw]">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path :d="SHAPE_PATHS[shape.shape || 'circle']" :fill="getShapeColor(shape)" />
    </svg>
  </div>
</template>
