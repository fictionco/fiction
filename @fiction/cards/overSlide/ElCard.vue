<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'
import { vue } from '@fiction/core'
import EffectFitText from '@fiction/ui/effect/EffectFitText.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../CardText.vue'
import NavDots from '../el/NavDots.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value)

const currentItemIndex = vue.ref(0)

const slides = vue.computed(() => uc.value.slides || [])

const circularItems = vue.computed(() => {
  const originalItems = slides.value
  if (originalItems.length === 0)
    return []

  const startIndex = currentItemIndex.value

  return [
    ...originalItems.slice(startIndex),
    ...originalItems.slice(0, startIndex),
  ]
})

const renderItems = vue.computed(() => circularItems.value.slice(0, 5))

const currentItem = vue.computed(() => circularItems.value[0])

const slideTime = 15000

let timer: NodeJS.Timeout | undefined = undefined
function autoSlideTimer() {
  const isActive = uc.value.autoSlide

  if (!isActive)
    return

  if (timer)
    clearTimeout(timer)

  timer = setTimeout(() => {
    const slides = uc.value.slides || []
    currentItemIndex.value = (currentItemIndex.value + 1) % slides.length
    autoSlideTimer()
  }, slideTime)
}

vue.onBeforeUnmount(() => {
  if (timer)
    clearTimeout(timer)
})

vue.onMounted(() => {
  autoSlideTimer()
  animateItems()
})

function setActiveItem(index: number) {
  currentItemIndex.value = index
  autoSlideTimer()
}

function setActiveItemByTitle(title?: string) {
  const index = slides.value.findIndex(item => item.title === title)
  if (index !== -1 && title) {
    setActiveItem(index)
  }
}

function getItemStyle(index: number) {
  return {
    zIndex: renderItems.value.length - index,
    opacity: 1 - (index * 0.15),
    transform: `translateX(${index * 20}px) translateY(${index * 10}px) scale(${1 - (index * 0.05)})`,
    right: `${index * -1}%`,
  }
}

function animateItems() {
  vue.nextTick(() => {
    const items = document.querySelectorAll('.carousel-item') as NodeListOf<HTMLElement>
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

vue.watch(currentItemIndex, () => {
  animateItems()
})

async function handleVisibilityChange() {
  if (document.visibilityState === 'visible') {
    currentItemIndex.value = 0
  }
}

vue.onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

vue.onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <div class="py-24 md:py-4">
      <div v-if="!currentItem" class="p-12 text-center font-sans opacity-30">
        No Slides Added
      </div>
      <div v-else class="md:flex items-center justify-between md:h-[680px]">
        <div class="relative h-full basis-[30%]">
          <transition
            enter-active-class="transition-all duration-500 ease-[cubic-bezier(0.25,1,0.33,1)]"
            enter-from-class="opacity-0 translate-x-44"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="transition-all duration-500 ease-[cubic-bezier(0.25,1,0.33,1)]"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 -translate-x-44"
            mode="out-in"
          >
            <div :key="currentItemIndex" class="text-theme-900 dark:text-theme-0 w-full md:absolute top-1/2 md:-translate-y-1/2 z-20 space-y-8" :class="currentItem?.textBlend === 'difference' ? 'mix-blend-difference text-white dark:text-black' : '[text-shadow:_1px_1px_2px_rgba(0,0,0,0.1)]'">
              <EffectFitText
                :lines="3"
                :content="currentItem?.title || ''"
                class="x-font-title z-20 font-bold md:w-[170%]"
                :min-size="40"
              >
                <CardText :card tag="span" :path="`slides.${currentItemIndex}.title`" />
              </EffectFitText>
              <EffectFitText
                v-if="currentItem?.subTitle"
                :lines="2"
                :min-size="28"
                :content="currentItem?.subTitle || ''"
                class="x-font-title z-20 font-medium md:w-[160%] mt-4 !leading-[1.4]"
              >
                <CardText animate="fade" :card tag="span" :path="`slides.${currentItemIndex}.subTitle`" />
              </EffectFitText>
            </div>
          </transition>
        </div>
        <div class="h-[400px] md:h-full relative basis-[70%] [perspective:1000px] z-10">
          <div class="absolute md:relative w-full h-full flex justify-end items-center">
            <div
              v-for="(item, i) in renderItems"
              :key="item.title"
              class="carousel-item absolute w-full md:w-[90%] md:h-[80%] aspect-[5/3] md:aspect-[4.5/3] cursor-pointer"
              :style="getItemStyle(i)"
              @click="setActiveItemByTitle(item.title)"
            >
              <XMedia
                :media="item.media"
                class="w-full h-full object-cover rounded-[20px] overflow-hidden shadow-[10px_-10px_10px_-8px_rgba(0_0_0/0.3)]"
              />
            </div>
          </div>
        </div>
      </div>
      <NavDots class="mt-6 md:mt-0" :active-item="currentItemIndex" :items="uc.slides || []" :container-id="card.cardId" @update:active-item="setActiveItem($event)" />
    </div>
  </div>
</template>
