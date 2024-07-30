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
const activeItem = vue.computed(() => items.value[activeIndex.value] || items.value[0])

function setActiveItem(index: number) {
  activeIndex.value = index
}
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <div class="relative aspect-none lg:aspect-[5/3] xl:aspect-[2.5/1] rounded-2xl shadow-lg overflow-hidden mx-auto flex flex-col lg:flex-wrap">
      <transition name="fade">
        <ElImage class="w-full lg:w-[50%] h-64 lg:h-full" :media="activeItem?.media" />
      </transition>
      <blockquote class="flex flex-col justify-center h-full w-full lg:w-[50%] backdrop-blur-md bg-white  ">
        <div>
          <div class="p-10 space-y-6 xl:space-y-12">
            <div class="flex gap-5">
              <div class="relative pt-1 opacity-30">
                <svg class="size-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M13 14.725c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275zm-13 0c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275z" /></svg>
              </div>
              <div class="space-y-[2vw]">
                <CardText
                  :key="activeIndex"
                  tag="div"
                  animate="rise"
                  class="text-2xl  2xl:text-4xl  !leading-[1.4] font-semibold x-font-title"
                  :card="card"
                  :path="`items.${activeIndex}.content`"
                />
              </div>
            </div>
            <div class="flex gap-6 md:ml-12 flex-wrap">
              <div v-for="(item, i) in items" :key="i" class="transition-opacity duration-500 cursor-pointer" :class="activeIndex === i ? 'opacity-100' : 'opacity-40 hover:opacity-100'" @click="setActiveItem(i)">
                <div class="flex justify-center flex-col items-center gap-2">
                  <div><ElImage :media="item.user?.avatar" class="size-12 md:size-16 rounded-full overflow-clip ring-2 ring-white" /></div>
                  <div class="text-center" :class="activeIndex === i ? 'font-semibold' : ''">
                    <CardText
                      tag="div"
                      class="text-xs md:text-sm font-sans"

                      :card
                      :path="`items.${i}.user.fullName`"
                      animate="fade"
                    />
                    <CardText
                      tag="div"
                      class="text-xs md:text-sm font-sans opacity-50"
                      :card
                      :path="`items.${i}.user.title`"
                      animate="fade"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </blockquote>
    </div>
  </div>
</template>

<style lang="less">

</style>
