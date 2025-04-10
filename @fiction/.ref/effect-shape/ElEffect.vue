<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { Shape, UserConfig } from './config'
import { getColorScheme, vue } from '@fiction/core'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const config = vue.computed(() => props.card.fullConfig.value || {})
const shapes = vue.computed(() => config.value.shapes || [])
const containerRef = vue.ref<HTMLElement | null>(null)

// SVG path definitions for each shape type
const SHAPE_PATHS: Record<NonNullable<Shape['shape']>, string> = {
  circle: 'M50 0a50 50 0 100 100A50 50 0 0050 0z',
  square: 'M0 0h100v100H0z',
  triangle: 'M50 0L100 100H0z',
  hexagon: 'M50 0L93.3 25L93.3 75L50 100L6.7 75L6.7 25Z',
  diamond: 'M50 0L100 50L50 100L0 50Z',
  star: 'M50 0L61 35H97L68 57L79 91L50 70L21 91L32 57L3 35H39Z',
}

// Position transformation mappings
const ORIGIN_TRANSFORMS: Record<string, { x: number, y: number, translate: { x: number, y: number } }> = {
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

// Viewport-based responsive scaling
const responsiveScale = vue.computed(() => {
  if (typeof window === 'undefined')
    return 1

  const { mobileScale = 1, tabletScale = 1 } = {}
  if (window.innerWidth < 768)
    return mobileScale
  if (window.innerWidth < 1024)
    return tabletScale
  return 1
})

// Split the styles into position/scale and rotation
function getShapeStyles(shape: Shape, index: number) {
  const { style = {}, position = {}, animation = {} } = shape
  const { origin = 'topRight', offsetX = 0, offsetY = 0, zIndex = 0 } = position
  const { scale = 1, blendMode = 'multiply' } = style
  const { rotate = 0, duration = 30, delay = 0 } = animation

  const baseTransform = ORIGIN_TRANSFORMS[origin]
  const finalScale = scale * responsiveScale.value

  // Calculate position with mouse follow effect if enabled
  const finalX = baseTransform.x + offsetX
  const finalY = baseTransform.y + offsetY

  // Hover effects
  const hoverScale = 1
  const hoverRotate = 0

  return {
    container: {
      left: `${finalX}%`,
      top: `${finalY}%`,
      zIndex,
      opacity: style.opacity ? style.opacity / 100 : 0.1,
    },
    wrapper: {
      transform: `translate(${baseTransform.translate.x}%, ${baseTransform.translate.y}%) scale(${finalScale * hoverScale}) rotate(${hoverRotate}deg)`,
      mixBlendMode: blendMode,
    },
    rotator: {
      animation: rotate ? `spin${rotate < 0 ? 'Reverse' : ''} ${duration}s linear infinite ${delay}s` : 'none',
    },
  }
}

// Get shape color with theme support
function getShapeColor(shape: Shape): string {
  const { style = {} } = shape
  const { color, theme } = style

  // Use specified color or theme color
  if (color)
    return color

  if (theme) {
    const t = getColorScheme(theme, { outputFormat: 'hex' })
    return t[500]
  }

  return `rgba(var(--theme-500)/1)`
}
</script>

<template>
  <div
    ref="containerRef"
    class="absolute inset-0 pointer-events-none z-[-1]"
  >
    <div
      v-for="(shape, i) in shapes"
      :key="i"
      class="absolute pointer-events-none select-none will-change-transform size-[calc(2.5rem+4.5vw)]"
      :style="getShapeStyles(shape, i).container"
    >
      <div

        class="w-full h-full transition-transform duration-300"
        :style="getShapeStyles(shape, i).wrapper"
      >
        <!-- Rotator element -->
        <div
          class="w-full h-full"
          :style="getShapeStyles(shape, i).rotator"
        >
          <svg
            class="animate-item"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              :d="SHAPE_PATHS[shape.shape || 'circle']"
              :fill="getShapeColor(shape)"
              class="transition-colors duration-300"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes spinReverse {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}
</style>
