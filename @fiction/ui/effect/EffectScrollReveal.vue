<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'
import { splitLetters } from '../anim/index.js'

const { fromTop = 80, disable = false } = defineProps<{ fromTop?: number, disable?: boolean }>()

// Register ScrollTrigger plugin with GSAP

const revealText = vue.ref<HTMLElement | null>(null)
const originalHtml = vue.ref<string>()

// Load GSAP and ScrollTrigger in client only as problems in node
async function getGsap() {
  const { gsap } = await import('gsap')

  const { ScrollTrigger } = await import('gsap/ScrollTrigger')

  gsap.registerPlugin(ScrollTrigger)

  return { gsap }
}

async function clearGsap() {
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
}

async function revertToOriginal() {
  const el = revealText.value

  if (!el) {
    throw new Error('Element not found for scroll reveal effect')
  }

  if (!originalHtml.value) {
    return
  }

  el.innerHTML = originalHtml.value
}

vue.onUnmounted(async () => {
  await clearGsap()
})

async function loadRevealText() {
  const el = revealText.value

  if (!el) {
    throw new Error('Element not found for scroll reveal effect')
  }

  originalHtml.value = el.innerHTML

  const { gsap } = await getGsap()

  splitLetters({ el })

  const bits = el.querySelectorAll(`.word`)
  const elHeight = el.offsetHeight

  gsap.from(bits, {
    scrollTrigger: {
      trigger: el,
      start: () => `top ${fromTop + 10}%`,
      end: () => `top+=${elHeight} ${fromTop}%`,
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
  await waitFor(200)

  vue.watch(() => disable, async () => {
    if (!disable) {
      loadRevealText()
    }
    else {
      await clearGsap()
      revertToOriginal()
    }
  }, { immediate: true })
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
