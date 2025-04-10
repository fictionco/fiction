<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'
import { pathCheck, vue } from '@fiction/core'

import EffectFitText from '@fiction/ui/effect/EffectFitText.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../CardText.vue'
import NavDots from '../el/NavDots.vue'
import { schema } from './config'

type Slide = { title?: string, subTitle?: string, media?: any, textBlend?: string }

const { card } = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => card.userConfig.value)
const currentItemIndex = vue.ref(0)
const slides = vue.computed(() => uc.value.items || [])
const slideTime = 15000
const timer = vue.ref<NodeJS.Timeout>()

// Add unique IDs to slides
const slidesWithIds = vue.computed(() => {
  return slides.value.map((slide: Slide, index) => ({
    ...slide,
    _id: `${card.cardId}-slide-${index}`,
  }))
})

// Circular array of slides with IDs
const circularItems = vue.computed(() => {
  const items = slidesWithIds.value
  if (items.length === 0)
    return []

  const startIndex = ((currentItemIndex.value % items.length) + items.length) % items.length
  return [
    ...items.slice(startIndex),
    ...items.slice(0, startIndex),
  ]
})

const renderItems = vue.computed(() => circularItems.value.slice(0, 5))
const currentItem = vue.computed(() => circularItems.value[0])

// Timer management
function startTimer() {
  if (!uc.value.autoSlide || slides.value.length <= 1)
    return
  stopTimer()

  timer.value = setTimeout(() => {
    if (slides.value.length > 0) {
      setActiveItem(currentItemIndex.value + 1)
    }
  }, slideTime)
}

function stopTimer() {
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = undefined
  }
}

// Slide navigation
function setActiveItem(index: number) {
  if (slides.value.length === 0)
    return

  // Ensure index wraps correctly
  const normalizedIndex = ((index % slides.value.length) + slides.value.length) % slides.value.length
  currentItemIndex.value = normalizedIndex
  startTimer()
}

function setActiveItemByTitle(title?: string) {
  if (!title)
    return
  const index = slidesWithIds.value.findIndex(item => item.title === title)
  if (index !== -1) {
    setActiveItem(index)
  }
}

// Animation
function getItemStyle(index: number) {
  return {
    zIndex: renderItems.value.length - index,
    opacity: 1 - (index * 0.15),
    transform: `translateX(${index * 1.5}vw) translateY(${index * 0.5}vw) scale(${1 - (index * 0.05)})`,
    right: `${index * -1}%`,
  }
}

function animateItems() {
  vue.nextTick(() => {
    const items = document.querySelectorAll(`[data-card-id="${card.cardId}"] .carousel-item`) as NodeListOf<HTMLElement>
    items.forEach((item, index) => {
      const style = getItemStyle(index)
      Object.assign(item.style, {
        transition: 'all 0.5s cubic-bezier(0.25, 1, 0.33, 1)',
        opacity: style.opacity,
        transform: style.transform,
        right: style.right,
      })
    })
  })
}

// Visibility handling
function handleVisibilityChange() {
  if (document.visibilityState === 'visible') {
    stopTimer()
    currentItemIndex.value = 0
    startTimer()
  }
  else {
    stopTimer()
  }
}

// Watchers and lifecycle hooks
vue.watch(currentItemIndex, () => {
  animateItems()
})

vue.watch(() => uc.value.autoSlide, (newValue) => {
  if (newValue) {
    startTimer()
  }
  else {
    stopTimer()
  }
})

vue.watch(() => slides.value.length, (newLength) => {
  if (newLength === 0) {
    currentItemIndex.value = 0
    stopTimer()
  }
  else if (currentItemIndex.value >= newLength) {
    currentItemIndex.value = 0
    startTimer()
  }
}, { immediate: true })

vue.onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
  animateItems()
  startTimer()
})

vue.onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  stopTimer()
})
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <div class="py-24 md:py-4">
      <div v-if="!currentItem && card.site?.isEditable.value" class="p-12 text-center font-sans text-theme-400/80 dark:text-theme-600/80">
        No Slides Added
      </div>
      <div v-else class="md:flex items-center justify-between md:h-[620px] xl:h-[700px] space-y-8 md:space-y-0">
        <div class="relative h-full basis-[33%]">
          <transition
            enter-active-class="transition-all duration-500 ease-[cubic-bezier(0.25,1,0.33,1)]"
            enter-from-class="opacity-0 translate-x-44"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="transition-all duration-500 ease-[cubic-bezier(0.25,1,0.33,1)]"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 -translate-x-44"
            mode="out-in"
          >
            <div
              :key="currentItem._id"
              class="text-theme-900 dark:text-theme-0 w-full md:absolute top-1/2 md:-translate-y-1/2 z-20 space-y-8"
              :class="currentItem?.textBlend === 'difference' ? 'mix-blend-difference text-white dark:text-black' : '[text-shadow:_1px_1px_2px_rgba(0,0,0,0.1)]'"
            >
              <EffectFitText
                :lines="2"
                :content="currentItem?.title || ''"
                class="x-font-title z-20 font-bold md:w-[170%]"
                :min-size="40"
              >
                <CardText :card tag="span" :path="pathCheck(`items.${currentItemIndex}.title`, schema)" />
              </EffectFitText>
              <EffectFitText
                v-if="currentItem?.subTitle"
                :lines="1"
                :min-size="28"
                :content="currentItem?.subTitle || ''"
                class="x-font-title z-20 font-medium md:w-[160%] mt-4"
              >
                <CardText animate="fade" :card tag="span" :path="pathCheck(`items.${currentItemIndex}.subTitle`, schema)" />
              </EffectFitText>
            </div>
          </transition>
        </div>
        <div class="h-[400px] md:h-full relative basis-[67%] [perspective:1000px] z-10">
          <div class="absolute md:relative w-full h-full flex justify-end items-center">
            <div
              v-for="(item, i) in renderItems"
              :key="item._id"
              class="carousel-item absolute w-full h-full cursor-pointer"
              :style="getItemStyle(i)"
              @click="setActiveItemByTitle(item.title)"
            >
              <XMedia
                :media="item.media"
                class="w-full h-full object-cover rounded-[20px] overflow-hidden shadow-[10px_-10px_10px_-8px_rgba(0_0_0/0.3)]"
              />
            </div>
            <NavDots
              class=" mt-6 justify-center z-10 absolute bottom-4 right-0 w-full"
              :active-item="currentItemIndex"
              :items="slidesWithIds"
              :wrap-selector="`[data-card-id='${card.cardId}']`"
              :overlay="true"
              @update:active-item="setActiveItem($event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
