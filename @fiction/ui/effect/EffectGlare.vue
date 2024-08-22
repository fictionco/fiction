<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'
import { twMerge } from 'tailwind-merge'

const props = defineProps({
  wrapClass: { type: String, default: '' },
})

const isHovered = vue.ref(false)

const state = vue.reactive({
  rotation: { x: 0, y: 0 },
  glare: { x: 50, y: 50 },
})

function handleMouseMove(event: MouseEvent) {
  const { clientX, clientY, target } = event
  const rect = (target as HTMLElement).getBoundingClientRect()
  const x = ((clientX - rect.left) / rect.width) * 100
  const y = ((clientY - rect.top) / rect.height) * 100

  state.rotation.x = Math.max(-7, Math.min(7, (y - 50) / 5))
  state.rotation.y = Math.max(-7, Math.min(7, -(x - 50) / 5))
  state.glare.x = x
  state.glare.y = y
}

function handleMouseEnter() {
  isHovered.value = true
}

function handleMouseLeave() {
  isHovered.value = false
  state.rotation.x = 0
  state.rotation.y = 0
  state.glare.x = 50
  state.glare.y = 50
}

const cardStyle = vue.computed(() => {
  const parts = [
    `rotateX(${state.rotation.x}deg)`,
    `rotateY(${state.rotation.y}deg)`,
  ]
  if (isHovered.value) {
    parts.push('translateZ(10px)')
  }
  return {
    transform: parts.join(' '),
  }
})

const glareStyle = vue.computed(() => ({
  background: `radial-gradient(circle at ${state.glare.x}% ${state.glare.y}%, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 70%)`,
}))

const cls = vue.computed(() => twMerge('rounded-lg', props.wrapClass))

const loaded = vue.ref(false)
vue.onMounted(async () => {
  await waitFor(2000)
  loaded.value = true
})
</script>

<template>
  <div class="[perspective:1000px] ">
    <div
      class="overflow-hidden hover flipcard group"
      :class="cls"
      :style="cardStyle"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
      @mouseenter="handleMouseEnter"
    >
      <slot />
      <div :class="loaded ? 'group-hover:opacity-100' : ''" class="opacity-0  card-glare absolute top-0 left-0 w-full h-full pointer-events-none transition-all" :style="glareStyle" />
    </div>
  </div>
</template>

<style lang="less">
.flipcard {
  transition: transform 0.5s;
  transform-style: preserve-3d;
  perspective: 1000px;
  backface-visibility: hidden;
}
</style>
