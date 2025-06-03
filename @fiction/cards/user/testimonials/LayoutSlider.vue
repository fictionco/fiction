<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { Testimonial, UserConfig } from './index.js'
import { vue } from '@fiction/core'
import { pathCheck } from '@fiction/core/utils/schemas.js'
import EffectCarousel from '@fiction/ui/effect/EffectCarousel.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../../CardText.vue'
import NavDots from '../../el/NavDots.vue'

import { schema } from './config'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const items = vue.computed(() => uc.value.items || [])

const activeIndex = vue.ref(0)

const carouselOptions = {
  draggable: !props.card.isActive.value,
}

function onSlideChange(index: number) {
  activeIndex.value = index
}

function getBgClass(_args: { slide: Testimonial, index: number }) {
  return 'text-theme-950 bg-theme-100 border-theme-50 dark:bg-theme-800 dark:border-theme-700 dark:text-theme-0'
}
</script>

<template>
  <div class="">
    <EffectCarousel
      v-model:active-index="activeIndex"
      :slides="items"
      :options="carouselOptions"
      @slide-change="onSlideChange"
    >
      <template #default="{ slide, index }">
        <blockquote
          class="carousel-cell w-[80%] md:w-[55%] lg:w-[40%] max-w-[600px] mr-6 md:mr-16 lg:mr-40"
        >
          <div
            class="transition-all duration-500"
            :class="[index === activeIndex ? 'scale-110 opacity-100' : 'opacity-30 hover:opacity-100 cursor-pointer']"
            @click="activeIndex = index"
          >
            <div class="relative speech-bubble">
              <div class=" rounded-2xl  relative border [perspective:1000px]" :class="getBgClass({ slide, index })">
                <div class="p-4 md:p-6">
                  <div class="flex gap-2 lg:gap-4 flex-col lg:flex-row relative">
                    <div class="space-y-[2vw] w-fit">
                      <CardText
                        tag="div"
                        class="text-xl md:text-2xl leading-snug w-fit x-font-title"
                        :card
                        :path="pathCheck(`items.${index}.content`, schema)"
                        animate="fade"
                        :schema
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
              <div>
                <XMedia
                  :card
                  :path="pathCheck(`items.${index}.user.media`, schema)"
                  :media="slide.user?.media"
                  class="size-16 rounded-full overflow-clip ring-2 ring-white"
                />
              </div>
              <div class="text-center">
                <CardText
                  tag="div"
                  class="text-sm md:text-lg x-font-title dark:text-theme-200 font-medium  truncate whitespace-nowrap"
                  :card
                  :path="pathCheck(`items.${index}.user.label`, schema)"
                  animate="fade"
                />
                <CardText
                  tag="div"
                  class="text-xs md:text-sm font-sans dark:text-theme-400 text-theme-500 "
                  :card
                  :path="pathCheck(`items.${index}.user.subLabel`, schema)"
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
      :wrap-selector="`[data-card-id='${card.cardId}']`"
      :items="items"
      class="mt-16 z-20 justify-center "
    />
  </div>
</template>
