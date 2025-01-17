<script setup lang="ts" generic="T">
import type Flickity from 'flickity'
import { vue, waitFor } from '@fiction/core'
import 'flickity/css/flickity.css'

defineOptions({ name: 'EffectCarousel' })

const props = defineProps<{
  options?: Partial<Flickity.Options>
  slides: T[]
  activeIndex: number
}>()

const emit = defineEmits<{
  (e: 'update:activeIndex', index: number): void
  (e: 'staticClick', event: Event, pointer: Event | Touch, cellElement: Element | null, cellIndex: number): void
}>()

type RealFlickity = Flickity & {
  options: Flickity.Options
  updateDraggable: () => void
}

const carouselRef = vue.ref<HTMLElement | null>(null)
let flkty: RealFlickity | null = null
const loading = vue.ref(true)

// Create computed for all options
const flickityOptions = vue.computed<Flickity.Options>(() => ({
  selectedAttraction: 0.03,
  friction: 0.3,
  accessibility: false,
  adaptiveHeight: false,
  initialIndex: props.activeIndex,
  wrapAround: true,
  cellAlign: 'center',
  draggable: props.slides.length > 1,
  dragThreshold: 10,
  lazyLoad: true,
  percentPosition: true,
  prevNextButtons: false,
  pageDots: false,
  setGallerySize: true,
  ...props.options,
  on: {
    /**
     * draggable stuff is messing with content editing
     * this is the fix
     */
    pointerDown: (event: Event) => {
      const target = event.target as HTMLElement

      if (flkty) {
        // Check specifically for contenteditable="true"
        const isContentEditable
      = target?.closest?.('[contenteditable="true"]')
        || target?.getAttribute?.('contenteditable') === 'true'

        if (isContentEditable) {
          flkty.options.draggable = false
          flkty.updateDraggable()
        }
      }
    },
    pointerUp: (event: Event) => {
      if (flkty && flkty.options.draggable === false) {
        flkty.options.draggable = true
        flkty.updateDraggable()
      }
    },

  },
}))

async function initFlickity() {
  if (typeof window === 'undefined')
    return

  if (flkty) {
    flkty.destroy()
  }

  const { default: Flickity } = await import('flickity')

  if (carouselRef.value) {
    flkty = new Flickity(carouselRef.value, flickityOptions.value) as RealFlickity

    flkty.on('change', (index: number) => emit('update:activeIndex', index))

    flkty.on('staticClick', (...args) => emit('staticClick', ...args))
  }

  await waitFor(200) // attempt better height calculation

  loading.value = false
}

vue.onMounted(async () => {
  await waitFor(300) // attempt better height calculation

  vue.watch(() => props.slides.length, () => {
    vue.nextTick(async () => {
      await initFlickity()
    })
  }, { immediate: true })

  vue.watch(() => props.activeIndex, (newIndex) => {
    if (flkty && flkty.selectedIndex !== newIndex) {
      flkty.select(newIndex)
    }
  })
})

vue.onBeforeUnmount(() => {
  if (flkty) {
    flkty.destroy()
  }
})
</script>

<template>
  <div
    ref="carouselRef"
    class="carousel transition-opacity duration-700"
    :class="loading ? 'opacity-0 min-h-[40vh]' : 'opacity-100'"
  >
    <slot
      v-for="(slide, index) in slides"
      :key="index"
      :slide="slide"
      :index="index"
    />
  </div>
</template>

<style lang="less">
.flickity-viewport {
  transition: height 0.2s;
  overflow: visible !important;
}
</style>
