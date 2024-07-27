<script setup lang="ts" generic="T">
import { vue, waitFor } from '@fiction/core'
import Flickity from 'flickity'
import 'flickity/css/flickity.css'

const props = defineProps<{
  options?: Partial<Flickity.Options>
  slides: T[]
  activeIndex: number
}>()

const emit = defineEmits<{
  (e: 'update:activeIndex', index: number): void
}>()

const carouselRef = vue.ref<HTMLElement | null>(null)
let flkty: Flickity | null = null

function initFlickity() {
  if (carouselRef.value) {
    flkty = new Flickity(carouselRef.value, {
      selectedAttraction: 0.03, // Default is 0.025
      friction: 0.3, // Default is 0.28
      accessibility: true,
      adaptiveHeight: false,

      // groupCells: false,
      initialIndex: props.activeIndex,
      wrapAround: true,
      // autoPlay: false,
      // cellAlign: 'center',
      // cellSelector: undefined,
      // contain: true,
      draggable: true,
      dragThreshold: 3,
      // freeScroll: false,
      lazyLoad: true,
      percentPosition: true,
      prevNextButtons: false,
      pageDots: false,
      // resize: true,
      // rightToLeft: false,
      setGallerySize: true,
      // watchCSS: false,
      ...props.options,
    })

    flkty.on('change', (index: number) => {
      emit('update:activeIndex', index)
    })
  }
}

vue.onMounted(async () => {
  await waitFor(200) // attempt better height calculation
  initFlickity()
})

vue.onBeforeUnmount(() => {
  if (flkty) {
    flkty.destroy()
  }
})

vue.watch(() => props.slides, () => {
  if (flkty) {
    flkty.destroy()
  }
  vue.nextTick(() => {
    initFlickity()
  })
}, { deep: true })

vue.watch(() => props.activeIndex, (newIndex) => {
  if (flkty && flkty.selectedIndex !== newIndex) {
    flkty.select(newIndex)
  }
})
</script>

<template>
  <div ref="carouselRef" class="carousel">
    <slot v-for="(slide, index) in slides" :key="index" :slide="slide" :index="index" />
  </div>
</template>

<style lang="less">
.flickity-viewport {
  transition: height 0.2s;
}
</style>
