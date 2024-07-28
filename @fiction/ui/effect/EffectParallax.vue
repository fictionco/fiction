<script lang="ts" setup>
import { vue } from '@fiction/core'
import ClipPathAnim from '../anim/AnimClipPath.vue'

const props = defineProps({
  intensity: { type: Number, default: 125 },
  direction: { type: String as vue.PropType<'normal' | 'reverse'>, default: 'normal' },
  animate: { type: Boolean, default: true },
})

const getWindow = () => typeof window !== 'undefined' && window || { innerHeight: 0, scrollY: 0 }

const state = vue.reactive({
  scrollY: 0,
  viewportHeight: getWindow().innerHeight,
  cardHeight: 0,
  offsetTop: 0,
  parallaxY: 0,
})

function updateParallax() {
  // Calculate the position where the element enters the viewport
  const entryPosition = state.offsetTop - state.viewportHeight

  // Calculate progress based on the entry position
  const progress = (state.scrollY - entryPosition) / (state.viewportHeight + state.cardHeight)

  const multiplier = props.direction === 'reverse' ? 1 : -1

  // Adjust the parallax calculation to start at -50%
  state.parallaxY = (progress - 0.7) * props.intensity * multiplier
}

function handleScroll() {
  state.scrollY = getWindow().scrollY
  updateParallax()
}

vue.onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', updateDimensions)
  updateDimensions()
  updateParallax()
})

vue.onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', updateDimensions)
})

function updateDimensions() {
  state.viewportHeight = getWindow().innerHeight
  const cardElement = document.querySelector('.parallax-card') as HTMLElement
  if (cardElement) {
    state.cardHeight = cardElement.offsetHeight
    state.offsetTop = cardElement.getBoundingClientRect().top + getWindow().scrollY
  }
  updateParallax()
}

const cardStyle = vue.computed(() => ({
  transform: `translateY(${state.parallaxY}px)`,
  transition: 'transform 0.1s ease-out',
}))
</script>

<template>
  <div class="parallax-card h-full w-full drop-shadow-md" :style="cardStyle">
    <ClipPathAnim :animate class="h-full w-full">
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
