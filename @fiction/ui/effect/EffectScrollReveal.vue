<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'
import { splitLetters } from '../anim/index.js'

const props = defineProps({
  fromTop: { type: Number, default: 80 },
})

// Register ScrollTrigger plugin with GSAP

const revealText = vue.ref<HTMLElement | null>(null)

// Load GSAP and ScrollTrigger in client only as problems in node
async function getGsap() {
  const { gsap } = await import('gsap')

  const { ScrollTrigger } = await import('gsap/ScrollTrigger')

  gsap.registerPlugin(ScrollTrigger)

  return { gsap }
}

vue.onUnmounted(async () => {
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})

async function loadRevealText() {
  const el = revealText.value

  if (!el) {
    throw new Error('Element not found for scroll reveal effect')
  }

  const { gsap } = await getGsap()

  splitLetters({ el })

  const bits = el.querySelectorAll(`.word`)
  const elHeight = el.offsetHeight

  gsap.from(bits, {
    scrollTrigger: {
      trigger: el,
      start: () => `top ${props.fromTop + 10}%`,
      end: () => `top+=${elHeight} ${props.fromTop}%`,
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
  await loadRevealText()
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
