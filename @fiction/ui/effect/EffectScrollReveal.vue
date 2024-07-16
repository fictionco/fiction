<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { splitLetters } from '../anim/index.js'

// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger)

const revealText = vue.ref<HTMLElement | null>(null)

function loadRevealText() {
  const el = revealText.value

  if (!el) {
    throw new Error('Element not found for scroll reveal effect')
  }

  splitLetters({ el })

  const bits = el.querySelectorAll(`.word`)
  const elHeight = el.offsetHeight

  gsap.from(bits, {
    scrollTrigger: {
      trigger: el,
      start: () => 'top 95%',
      end: () => `top+=${elHeight} 85%`,
      scrub: 0,
    },
    x: 0,
    y: 0,
    opacity: 0.3,
    duration: 3,
    stagger: 1,
  })
}

vue.onMounted(async () => {
  await waitFor(50)
  loadRevealText()
})

vue.onUnmounted(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<template>
  <div ref="revealText" class="scroll-reveal-text relative">
    <slot />
  </div>
</template>

<style lang="less">
.scroll-reveal-text {
  will-change: transform, opacity;
}
</style>
