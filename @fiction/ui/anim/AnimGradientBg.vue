<!-- AnimatedGradient.vue -->
<script setup lang="ts">
import type { ColorScale, ColorTheme } from '@fiction/core'
import { getColorScheme, vue } from '@fiction/core'
import { animate, SimplexNoise } from './gradientUtil'

const props = defineProps<{
  color1?: ColorTheme
  color1Scale?: ColorScale
  color2?: ColorTheme
  color2Scale?: ColorScale
  speed?: number
}>()

const canvas = vue.ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let animId: number | null = null
const simplex = new SimplexNoise()
const clock = vue.ref(0)
const resolution = 110

function setup() {
  if (!canvas.value)
    return
  ctx = canvas.value.getContext('2d', { willReadFrequently: true })
  if (!ctx)
    return
  canvas.value.width = resolution
  canvas.value.height = resolution
}

function loop() {
  if (!ctx)
    return

  const c1 = props.color1 ? getColorScheme(props.color1, { outputFormat: 'hex' })[props.color1Scale || '500'] : '#3490dc'
  const c2 = props.color2 ? getColorScheme(props.color2, { outputFormat: 'hex' })[props.color2Scale || '500'] : '#9333ea'

  clock.value = animate(
    ctx,
    resolution,
    c1,
    c2,
    props.speed || 5000,
    clock.value,
    simplex,
  )
  animId = requestAnimationFrame(loop)
}

vue.onMounted(() => {
  setup()
  loop()
})

vue.onUnmounted(() => {
  if (animId)
    cancelAnimationFrame(animId)
})

vue.watch([() => props.color1, () => props.color2], setup)
</script>

<template>
  <canvas ref="canvas" class="absolute inset-0 w-full h-full" />
</template>
