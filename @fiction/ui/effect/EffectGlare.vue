<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'
import { twMerge } from 'tailwind-merge'

const props = defineProps({
  wrapClass: { type: String, default: '' },
})

const isHovered = vue.ref(false)
const trackingEl = vue.ref<HTMLElement | null>(null)

const state = vue.reactive({
  rotation: { x: 0, y: 0 },
  glare: { x: 50, y: 50 },
})

function handleMouseMove(event: MouseEvent) {
  if (!trackingEl.value)
    return
  const rect = trackingEl.value.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2

  const maxTilt = 10
  const tiltMagnitude = Math.min(Math.sqrt(x * x + y * y), 1)
  const tiltAngle = Math.atan2(y, x)

  state.rotation.x = Math.sin(tiltAngle) * maxTilt * tiltMagnitude
  state.rotation.y = -Math.cos(tiltAngle) * maxTilt * tiltMagnitude
  state.glare.x = (x + 1) * 50
  state.glare.y = (y + 1) * 50
}

function handleMouseEnter() {
  if (typeof document === 'undefined')
    return

  isHovered.value = true
  document.addEventListener('mousemove', handleMouseMove)
}

function handleMouseLeave() {
  if (typeof document === 'undefined')
    return

  isHovered.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  state.rotation.x = 0
  state.rotation.y = 0
  state.glare.x = 50
  state.glare.y = 50
}

const cardStyle = vue.computed(() => ({
  transform: `rotateX(${state.rotation.x}deg) rotateY(${state.rotation.y}deg) ${isHovered.value ? 'translateZ(10px)' : ''}`,
}))

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
  <div ref="trackingEl" class="[perspective:1000px]">
    <div
      class="overflow-hidden hover flipcard group w-full h-full"
      :class="cls"
      :style="cardStyle"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <slot />
      <div
        :class="loaded ? 'group-hover:opacity-100' : ''"
        class="opacity-0 card-glare absolute top-0 left-0 w-full h-full pointer-events-none transition-all"
        :style="glareStyle"
      />
    </div>
  </div>
</template>

<style lang="less">
.flipcard {
  transition: transform 0.3s;
  transform-style: preserve-3d;
  perspective: 1000px;
  backface-visibility: hidden;
}
</style>
