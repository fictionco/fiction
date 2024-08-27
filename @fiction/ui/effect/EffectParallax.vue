<script lang="ts" setup>
import { vue } from '@fiction/core'
import ClipPathAnim from '../anim/AnimClipPath.vue'

const props = defineProps({
  maxMovement: { type: Number, default: 50 }, // Maximum movement in pixels
  direction: { type: String as vue.PropType<'normal' | 'reverse'>, default: 'normal' },
  animate: { type: Boolean, default: true },
})

const state = vue.reactive({
  scrollY: 0,
  viewportHeight: 0,
  cardHeight: 0,
  offsetTop: 0,
  parallaxY: 0,
})

const cardRef = vue.ref<HTMLElement | null>(null)

const getWindow = () => (typeof window !== 'undefined' && window) ? window : { innerHeight: 0, scrollY: 0 }

function updateParallax() {
  const entryPosition = state.offsetTop - state.viewportHeight
  const exitPosition = state.offsetTop + state.cardHeight

  const progress = (state.scrollY - entryPosition) / (exitPosition - entryPosition)
  const clampedProgress = Math.max(0, Math.min(1, progress))

  const multiplier = props.direction === 'reverse' ? 1 : -1
  const movement = clampedProgress * props.maxMovement * 2 - props.maxMovement

  state.parallaxY = movement * multiplier
}

function handleScroll() {
  state.scrollY = getWindow().scrollY
  requestAnimationFrame(updateParallax)
}

function updateDimensions() {
  state.viewportHeight = getWindow().innerHeight
  if (cardRef.value) {
    state.cardHeight = cardRef.value.offsetHeight
    state.offsetTop = cardRef.value.getBoundingClientRect().top + getWindow().scrollY
  }
  updateParallax()
}

vue.onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', updateDimensions)
  updateDimensions()
})

vue.onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', updateDimensions)
})

const cardStyle = vue.computed(() => ({
  transform: `translateY(${state.parallaxY}px)`,
  transition: 'transform 0.3s ease-out',
}))
</script>

<template>
  <div ref="cardRef" class="parallax-card h-full w-full drop-shadow-md" :style="cardStyle">
    <ClipPathAnim :animate="animate" class="h-full w-full">
      <slot />
    </ClipPathAnim>
  </div>
</template>

<style lang="less">
.parallax-card {
  will-change: transform;
  backface-visibility: hidden;
}
</style>
