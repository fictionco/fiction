<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'

const {
  items = [],
  wrapSelector,
  activeItem = 0,
  itemClass = 'slide',
  overlay = false,
} = defineProps<{
  items?: any[]
  wrapSelector: string
  activeItem?: number
  itemClass?: string
  mode?: 'dots' | 'lines'
  overlay?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:activeItem', payload: number): void
}>()

const intersectingItem = vue.ref(activeItem)
const isManualNavigation = vue.ref(false)

async function setActiveItem(index: number, withScroll: boolean) {
  if (withScroll) {
    isManualNavigation.value = true
    emit('update:activeItem', index)
    await waitFor(50)
    scrollToActive()
    // Reset after animation completes
    setTimeout(() => {
      isManualNavigation.value = false
    }, 1000)
  }
  else if (!isManualNavigation.value) {
    // Only update intersectingItem when not in manual navigation
    intersectingItem.value = index
    // Only emit if different from current activeItem
    if (intersectingItem.value !== activeItem) {
      emit('update:activeItem', index)
    }
  }
}

async function scrollToActive() {
  const element = document.querySelector(`${wrapSelector} .scroll-placer-active`)
  if (element) {
    const currentScrollY = window.scrollY

    element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })

    window.scrollTo({
      top: currentScrollY,
      behavior: 'instant', // Use instant to prevent visible jump
    })
  }
}

const observer = vue.ref<IntersectionObserver>()
function createObserver() {
  const options = { root: null, rootMargin: '0px', threshold: 0.5 }

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const e = entry.target as HTMLElement
      if (entry.isIntersecting) {
        const index = Number.parseInt(e.dataset.index || '0')
        setActiveItem(index, false)
      }
    })
  }, options)
}

vue.onMounted(() => {
  createObserver()

  vue.watch(() => items, () => {
    const slides = document.querySelectorAll(`${wrapSelector} .${itemClass}`)

    slides.forEach((slide) => {
      const computedStyle = window.getComputedStyle(slide)
      if (computedStyle.position !== 'relative' && computedStyle.position !== 'absolute') {
        (slide as HTMLElement).style.position = 'relative'
      }

      if (!slide.querySelector('.scroll-placer')) {
        const sizer = document.createElement('div')
        sizer.className = 'absolute w-1 h-1 left-1/2 top-1/2 scroll-placer pointer-events-none opacity-0'
        slide.appendChild(sizer)
      }
    })

    const elements = document.querySelectorAll(`${wrapSelector} .scroll-placer`)
    elements.forEach((el, i) => {
      if (observer.value) {
        (el as HTMLElement).dataset.index = i.toString()
        observer.value.observe(el)
      }
    })
  }, { immediate: true })

  vue.watch(() => activeItem, () => {
    if (isManualNavigation.value || activeItem !== intersectingItem.value) {
      const elements = document.querySelectorAll(`${wrapSelector} .scroll-placer`)
      elements.forEach((el, i) => {
        if (i === activeItem) {
          el.classList.add('scroll-placer-active')
        }
        else {
          el.classList.remove('scroll-placer-active')
        }
      })

      if (!isManualNavigation.value) {
        scrollToActive()
      }
    }
  })
})

const colorClass = vue.computed(() => ({
  dot: overlay ? 'bg-theme-0' : 'bg-theme-600/50 dark:bg-theme-0',
  circle: overlay ? 'text-theme-0' : 'text-theme-600/50 dark:text-theme-0',
}))
</script>

<template>
  <div v-if="items?.length && items.length > 1" class="h-5 nav flex items-center space-x-3 ">
    <div
      v-for="(s, i) in items"
      :key="i"
      class="group dots-nav flex justify-center items-center rounded-full transition-all relative"
      :class="[i === activeItem ? 'is-active' : 'cursor-pointer']"
      :data-test-id="`nav-dot-${i}`"
      @click.stop="setActiveItem(i, true)"
    >
      <div :class="[colorClass.dot, i === activeItem ? 'opacity-0 size-5' : 'opacity-100 size-2 hover:opacity-80']" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full group-active:opacity-50 transition-all duration-1000" />
      <svg class="size-6" :class="colorClass.circle" viewBox="0 0 66 66" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <circle
          class="time"
          stroke-width="5"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-dashoffset="0"
          cx="33"
          cy="33"
          r="28"
        />
      </svg>
    </div>
  </div>
</template>

<style lang="less">
.dots-nav{
  circle{
    transition: stroke-dashoffset 0.5s;
    stroke-dashoffset: 180;
    stroke-dasharray: 179;
  }
  &.is-active{
    circle{
      stroke-dashoffset: 8;
    }
  }
}
</style>
