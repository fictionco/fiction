<script lang="ts" setup>
import { vue } from '@fiction/core'

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

  state.rotation.x = (y - 50) / 2
  state.rotation.y = -(x - 50) / 2
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
</script>

<template>
  <div
    class="relative rounded-lg overflow-hidden hover flipcard group"
    :style="cardStyle"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    @mouseenter="handleMouseEnter"
  >
    <slot />
    <div class="opacity-0 group-hover:opacity-100 card-glare absolute top-0 left-0 w-full h-full pointer-events-none transition-all" :style="glareStyle" />
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
