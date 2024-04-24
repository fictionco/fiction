<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'
import type { Card } from '@fiction/site'

const props = defineProps({
  items: { type: Array, required: true },
  containerId: { type: String, required: true },
  activeItem: { type: Number, default: 0 },
})

const emit = defineEmits<{
  (event: 'update:activeItem', payload: number): void
}>()

async function setActiveItem(index: number) {
  emit('update:activeItem', index)
  await waitFor(50)
  scrollToActiveQuote()
}

async function scrollToActiveQuote() {
  const element = document.querySelector(`#${props.containerId} .nav-item-active`)
  if (element)
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
}

const observer = vue.ref<IntersectionObserver>()
function createObserver() {
  const options = { root: null, rootMargin: '0px', threshold: 0.5 }

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const e = entry.target as HTMLElement
      if (entry.isIntersecting)
        emit('update:activeItem', Number.parseInt(e.dataset.index || '0'))
    })
  }, options)
}

vue.onMounted(() => {
  createObserver()

  vue.watch(() => props.items, () => {
    const elements = document.querySelectorAll(`#${props.containerId} .nav-item`)

    elements.forEach((el, i) => {
      if (observer.value) {
        (el as HTMLElement).dataset.index = i.toString()
        observer.value?.observe(el)
      }
    })
  }, { immediate: true })

  vue.watch(() => props.activeItem, () => {
    const elements = document.querySelectorAll(`#${props.containerId} .nav-item`)

    elements.forEach((el, i) => {
      if (i === props.activeItem)
        el.classList.add('nav-item-active')
      else
        el.classList.remove('nav-item-active')
    })
  })
})
</script>

<template>
  <div v-if="items?.length && items.length > 1" class="h-5 nav flex items-center w-full justify-center space-x-3 ">
    <div
      v-for="(s, i) in items"
      :key="i"
      class="group dots-nav flex justify-center items-center rounded-full transition-all  text-theme-400 dark:text-theme-0 shadow-lg relative"
      :class="i === activeItem ? 'is-active' : 'cursor-pointer' "
      @click="setActiveItem(i)"
    >
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full size-1.5 bg-theme-0 group-active:opacity-50" />
      <svg class="size-5" viewBox="0 0 66 66" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
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
        /></svg>
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
