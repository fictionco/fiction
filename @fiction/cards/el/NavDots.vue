<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'

const props = defineProps({
  items: { type: Array, required: true },
  containerId: { type: String, required: true },
  activeItem: { type: Number, default: 0 },
  itemClass: { type: String, default: 'slide' },
  mode: { type: String as vue.PropType<'dots' | 'lines'>, default: 'dots' },
})

const emit = defineEmits<{
  (event: 'update:activeItem', payload: number): void
}>()

async function setActiveItem(index: number, withScroll: boolean) {
  emit('update:activeItem', index)

  if (withScroll) {
    await waitFor(50) // wait for class and dom to update
    scrollToActive()
  }
}

async function scrollToActive() {
  const element = document.querySelector(`#${props.containerId} .scroll-placer-active`)
  if (element)
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
}

const observer = vue.ref<IntersectionObserver>()
function createObserver() {
  const options = { root: null, rootMargin: '0px', threshold: 0.5 }

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const e = entry.target as HTMLElement
      if (entry.isIntersecting) {
        const activeItem = Number.parseInt(e.dataset.index || '0')
        setActiveItem(activeItem, false)
      }
    })
  }, options)
}

vue.onMounted(() => {
  createObserver()

  vue.watch(() => props.items, () => {
    const slides = document.querySelectorAll(`#${props.containerId} .${props.itemClass}`)

    slides.forEach((slide) => {
      const computedStyle = window.getComputedStyle(slide)
      if (computedStyle.position !== 'relative' && computedStyle.position !== 'absolute') {
        (slide as HTMLElement).style.position = 'relative'
      }

      const sizer = slide.querySelector(`.scroll-placer`)

      if (!sizer) {
        const newSizer = document.createElement('div')
        newSizer.className = `absolute w-1 h-1 left-1/2 top-1/2 scroll-placer pointer-events-none opacity-0`
        slide.appendChild(newSizer)
      }
    })

    const elements = document.querySelectorAll(`#${props.containerId} .scroll-placer`)

    elements.forEach((el, i) => {
      if (observer.value) {
        (el as HTMLElement).dataset.index = i.toString()
        observer.value?.observe(el)
      }
    })
  }, { immediate: true })

  vue.watch(() => props.activeItem, async () => {
    const elements = document.querySelectorAll(`#${props.containerId} .scroll-placer`)

    elements.forEach((el, i) => {
      if (i === props.activeItem)
        el.classList.add(`scroll-placer-active`)
      else
        el.classList.remove(`scroll-placer-active`)
    })
  })
})
</script>

<template>
  <div>
    <div v-if="items?.length && items.length > 1" class="h-5 nav flex items-center justify-center space-x-3 ">
      <div
        v-for="(s, i) in items"
        :key="i"
        class="group dots-nav flex justify-center items-center rounded-full transition-all text-theme-400 dark:text-theme-0 relative"
        :class="i === activeItem ? 'is-active' : 'cursor-pointer' "
        :data-test-id="`nav-dot-${i}`"
        @click="setActiveItem(i, true)"
      >
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-theme-600/50 dark:bg-theme-0 group-active:opacity-50 transition-all duration-1000" :class="i === activeItem ? 'opacity-0 size-5' : 'opacity-100 size-2' " />
        <svg class="size-6 text-theme-600/50 dark:text-theme-0" viewBox="0 0 66 66" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
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
