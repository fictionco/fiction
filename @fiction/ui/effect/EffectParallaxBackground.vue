<script lang="ts" setup>
import type { MediaDisplayObject } from '@fiction/core'
import { vue } from '@fiction/core'

const props = defineProps({
  media: { type: Object as vue.PropType<MediaDisplayObject>, required: true },
  parallaxStrength: { type: Number, default: 0.2 }, // Adjust this value to control the parallax intensity
})

const parallaxWrap = vue.ref<HTMLElement | null>(null)
const parallaxMedia = vue.ref<HTMLElement | null>(null)

const mediaComponent = vue.computed(() => {
  switch (props.media.format) {
    case 'video':
      return 'video'
    case 'iframe':
      return 'iframe'
    case 'html':
      return 'div'
    case 'audio':
      return 'audio'
    case 'text':
      return 'div'
    default:
      return 'img'
  }
})

const mediaProps = vue.computed(() => {
  const commonProps = {
    class: props.media.classes,
    style: props.media.filters ? { filter: props.media.filters.join(' ') } : {},
  }
  switch (props.media.format) {
    case 'video':
      return { ...commonProps, src: props.media.url, autoplay: true, loop: true, muted: true, playsinline: true }
    case 'iframe':
      return { ...commonProps, src: props.media.url, frameborder: 0 }
    case 'html':
      return { ...commonProps, innerHTML: props.media.html }
    case 'audio':
      return { ...commonProps, src: props.media.url, controls: true }
    case 'text':
      return { ...commonProps, innerHTML: props.media.text }
    default:
      return { ...commonProps, src: props.media.url }
  }
})
// Parallax effect
let observer: IntersectionObserver | null = null
let animationFrame: number | null = null

function updateParallax(entries: IntersectionObserverEntry[]) {
  const [entry] = entries
  if (entry.isIntersecting) {
    animationFrame = requestAnimationFrame(animate)
  }
  else if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
}

function animate() {
  if (!parallaxWrap.value || !parallaxMedia.value)
    return

  const rect = parallaxWrap.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const scrollPercentage = (viewportHeight - rect.top) / (viewportHeight + rect.height)

  const translateY = (scrollPercentage - 0.5) * props.parallaxStrength * 100
  const scale = 1 + Math.abs(translateY) / 1000 // Adjust the divisor to control the scale effect

  parallaxMedia.value.style.transform = `translateY(${translateY}%) scale(${scale})`

  animationFrame = requestAnimationFrame(animate)
}

vue.onMounted(() => {
  if (parallaxWrap.value) {
    observer = new IntersectionObserver(updateParallax, { threshold: 0 })
    observer.observe(parallaxWrap.value)
  }
})

vue.onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<template>
  <div ref="parallaxWrap" class="parallax-wrap overflow-hidden">
    <component
      :is="mediaComponent"
      ref="parallaxMedia"
      v-bind="mediaProps"
      class="parallax-media w-full h-full object-cover"
    />
  </div>
</template>

<style scoped>
.parallax-wrap {
  position: relative;
  overflow: hidden;
}

.parallax-media {
  position: absolute;
  top: -5%;
  left: 0;
  width: 110%;
  height: 110%;
  will-change: transform;
}
</style>
