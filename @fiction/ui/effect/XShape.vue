<script lang="ts" setup>
import { type ColorThemeUser, type DecorationShape, getColorScheme, isDarkOrLightMode, vue } from '@fiction/core'

type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten'
type ColorMode = 'dark' | 'light' | 'auto'

const props = defineProps<{
  // Shape appearance
  shape?: DecorationShape
  color?: string
  theme?: ColorThemeUser | 'primary' | 'theme'
  opacity?: number
  blendMode?: BlendMode
  colorMode?: ColorMode
  // Animation
  rotate?: number
  duration?: number
  delay?: number
  // Optional scale transform
  scale?: number
}>()

const SHAPE_PATHS: Record<DecorationShape, string> = {
  circle: 'M50 0a50 50 0 100 100A50 50 0 0050 0z',
  square: 'M0 0h100v100H0z',
  triangle: 'M50 0L100 100H0z',
  hexagon: 'M50 0L93.3 25L93.3 75L50 100L6.7 75L6.7 25Z',
  diamond: 'M50 0L100 50L50 100L0 50Z',
  star: 'M50 0L63 35H95L70 57L80 90L50 73L20 90L30 57L5 35H37Z',
  // 4-pointed star with balanced proportions
  star4: 'M50 0L70 30L100 50L70 70L50 100L30 70L0 50L30 30Z',
  // 8-pointed star with even spacing
  star8: 'M50 0L61 25L85 15L75 39L100 50L75 61L85 85L61 75L50 100L39 75L15 85L25 61L0 50L25 39L15 15L39 25Z',
  none: '',
}

const containerRef = vue.ref<HTMLElement | null>(null)

const currentMode = vue.computed(() => {
  if (props.colorMode === 'dark')
    return 'dark'
  if (props.colorMode === 'light')
    return 'light'
  return isDarkOrLightMode(containerRef.value)
})

function getShapeColor(): string {
  const { color, theme } = props
  const mode = currentMode.value
  const opacity = (props.opacity ?? 10) / 100

  // Direct color value
  if (color)
    return color

  // Handle special theme values that use CSS variables
  if (theme === 'primary' || theme === 'theme') {
    const prefix = theme === 'primary' ? '--primary' : '--theme'
    // Use different color scales for dark/light modes
    const scale = mode === 'dark' ? 600 : 200
    return `rgba(var(${prefix}-${scale}) / ${opacity})`
  }

  // Handle regular color themes
  if (theme) {
    const t = getColorScheme(theme, { outputFormat: 'rgb' })
    // Use more contrasting scales for dark/light modes
    const scale = mode === 'dark' ? 600 : 200
    return `rgba(${t[scale]} / ${opacity})`
  }

  // Default fallback using theme CSS variable
  const defaultScale = mode === 'dark' ? 600 : 200
  return `rgba(var(--theme-${defaultScale}) / ${opacity})`
}

const shapeStyles = vue.computed(() => {
  const {
    blendMode = currentMode.value === 'dark' ? 'screen' : 'multiply',
    scale = 1,
    rotate = 0,
    duration = 45,
    delay = 0,
  } = props

  return {
    wrapper: {
      transform: `scale(${scale})`,
      mixBlendMode: blendMode,
    },
    rotator: {
      animation: rotate ? `spin${rotate < 0 ? 'Reverse' : ''} ${duration}s linear infinite ${delay}s` : 'none',
    },
  }
})
</script>

<template>
  <div>
    <div
      ref="containerRef"
      class="pointer-events-none w-full h-full select-none"
      :style="shapeStyles.wrapper"
      :data-color-mode="currentMode"
    >
      <div
        class="w-full h-full"
        :style="shapeStyles.rotator"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            :d="SHAPE_PATHS[props.shape || 'circle']"
            :fill="getShapeColor()"
            class="transition-colors duration-300"
          />
        </svg>
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
