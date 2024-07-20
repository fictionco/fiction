<!-- AnimatedGradient.vue -->
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { SimplexNoise, animate } from './gradientUtil'

const props = defineProps({
  baseColor: {
    type: String,
    default: '#3490dc',
  },
  speed: {
    type: Number,
    default: 1000,
  },
  blendingMode: {
    type: String,
    default: 'linear',
  },
})

const container = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationId: number | null = null
const simplex = new SimplexNoise()

const resolution = 110
const clock = ref(0)

function setup() {
  if (!canvas.value || !container.value)
    return

  ctx = canvas.value.getContext('2d')
  if (!ctx)
    return

  canvas.value.width = resolution
  canvas.value.height = resolution
}

function animationLoop() {
  if (!ctx)
    return

  clock.value = animate(ctx, resolution, props.baseColor, props.speed, props.blendingMode, clock.value, simplex)
  animationId = requestAnimationFrame(animationLoop)
}

onMounted(() => {
  setup()
  animationLoop()
})

onUnmounted(() => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
  }
})

watch(() => props.baseColor, setup)
</script>

<template>
  <div ref="container" class="relative w-full h-full overflow-hidden">
    <canvas ref="canvas" class="absolute inset-0 w-full h-full" />
  </div>
</template>
