<script lang="ts" setup>
import { shortId, vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '../anim/index.js'
import ClipPathAnim from '../anim/AnimClipPath.vue'

const props = defineProps({
  intensity: { type: Number, default: 25 },
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
  const progress = (state.scrollY + state.viewportHeight - state.offsetTop) / (state.viewportHeight + state.cardHeight)
  const multiplier = props.direction === 'reverse' ? 1 : -1
  state.parallaxY = progress * props.intensity * multiplier - (props.intensity / 2 * multiplier)
}

function handleScroll() {
  state.scrollY = getWindow().scrollY
  updateParallax()
}

vue.onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  const cardElement = document.querySelector('.parallax-card') as HTMLElement
  if (cardElement) {
    state.cardHeight = cardElement.offsetHeight
    state.offsetTop = cardElement.offsetTop
  }
  updateParallax()
})

vue.onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const cardStyle = vue.computed(() => ({
  transform: `translateY(${state.parallaxY}px)`,
  transition: 'transform 0.1s ease-out', // Smoother transition
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
