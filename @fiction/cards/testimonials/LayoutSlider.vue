<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import EffectCarousel from '@fiction/ui/effect/EffectCarousel.vue'
import ElImage from '@fiction/ui/media/ElImage.vue'
import CardText from '../CardText.vue'
import NavDots from '../el/NavDots.vue'

import type { Testimonial, UserConfig } from './index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const items = vue.computed(() => uc.value.items || [])

const activeIndex = vue.ref(0)

const carouselOptions = {
}

function onSlideChange(index: number) {
  activeIndex.value = index
}

function getBgClass(args: { slide: Testimonial, index: number }) {
  const { index } = args
  return index === activeIndex.value
    ? 'text-primary-50 bg-primary-600 border-primary-600 dark:text-primary-50 dark:bg-primary-950 dark:border-primary-600'
    : 'text-primary-50 bg-primary-500 border-primary-600 dark:bg-theme-700/70 dark:border-theme-700'
}
</script>

<template>
  <div class="">
    <EffectCarousel v-model:activeIndex="activeIndex" :slides="items" :options="carouselOptions" @slide-change="onSlideChange">
      <template #default="{ slide, index }">
        <blockquote class="carousel-cell w-[80%] md:w-[55%] lg:w-[30%] max-w-[600px] mr-6 md:mr-16 lg:mr-64">
          <div class="transition-all duration-500" :class="index === activeIndex ? 'scale-110' : ''">
            <div class="relative speech-bubble">
              <div class=" rounded-2xl  relative border [perspective:1000px]" :class="getBgClass({ slide, index })">
                <div class="p-4 md:p-8">
                  <div class="flex gap-2 lg:gap-5 flex-col lg:flex-row">
                    <div class="relative pt-1 opacity-20">
                      <svg class="size-6 md:size-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M13 14.725c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275zm-13 0c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275z" /></svg>
                    </div>
                    <div class="space-y-[2vw] w-fit">
                      <CardText
                        tag="div"
                        class="text-xl md:text-3xl leading-snug w-fit"
                        :card="card"
                        :path="`items.${index}.content`"
                        animate="fade"
                      />
                    </div>
                  </div>
                </div>

                <span
                  :class="getBgClass({ index, slide })"
                  class=" border-r border-b bg-bottom-arrow absolute w-7 h-7 block rounded-br-lg overflow-hidden top-full left-1/2 -mt-[14px] -translate-x-1/2 transition-all duration-200 ease-in-out "
                  :style="{ transform: `translateX(-50%) rotateX(30deg) rotateZ(45deg)` }"
                />
              </div>
            </div>
            <div class="flex justify-center pt-9 flex-col items-center gap-2">
              <div><ElImage :media="slide.user?.avatar" class="size-16 rounded-full overflow-clip ring-2 ring-white" /></div>
              <div class="text-center">
                <CardText
                  tag="div"
                  class="text-sm md:text-lg x-font-title dark:text-theme-200 font-medium  truncate whitespace-nowrap"
                  :card
                  :path="`items.${index}.user.fullName`"
                  animate="fade"
                />
                <CardText
                  tag="div"
                  class="text-xs md:text-sm font-sans dark:text-theme-400 text-theme-500 "
                  :card
                  :path="`items.${index}.user.title`"
                  animate="fade"
                />
              </div>
            </div>
          </div>
        </blockquote>
      </template>
    </EffectCarousel>
    <NavDots
      v-model:active-item="activeIndex"
      :container-id="card.cardId"
      :items="items"
      class="mt-16 z-20"
    />
  </div>
</template>

<style lang="less">
.carousel-cell{
  opacity: .4;
  &.is-selected{
    opacity: 1
  }
}
</style>
