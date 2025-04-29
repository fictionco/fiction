<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './index.js'
import { pathCheck, vue } from '@fiction/core'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../../CardText.vue'

import { schema } from './config'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const items = vue.computed(() => uc.value.items || [])

const activeIndex = vue.ref(0)
const activeItem = vue.computed(() => items.value[activeIndex.value] || items.value[0])
const navItemsRef = vue.ref<HTMLDivElement[]>([])

function setActiveItem(index: number) {
  activeIndex.value = index

  // Wait for the DOM to update before scrolling
  vue.nextTick(() => {
    if (navItemsRef.value[index]) {
      navItemsRef.value[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  })
}
</script>

<template>
  <div>
    <div class="relative aspect-none lg:aspect-[5/3] xl:aspect-[2.5/1] rounded-2xl shadow-xl dark:shadow-primary-500/10 bg-white dark:bg-theme-800 overflow-hidden mx-auto flex flex-col lg:flex-wrap">
      <div class="w-full lg:w-[50%] h-64 lg:h-full relative">
        <transition
          enter-active-class="ease-out duration-500"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="ease-in duration-500"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <XMedia :key="activeItem.content" class="absolute inset-0 object-cover" :media="activeItem?.media || activeItem?.user?.media" />
        </transition>
      </div>
      <blockquote class="flex flex-col justify-between h-full w-full lg:w-[50%] border-y border-r overflow-hidden rounded-r-2xl border-black/10 p-4 lg:p-10 space-y-6 xl:space-y-12">
        <div class="flex flex-col items-center lg:flex-row  justify-center gap-3 lg:gap-5 grow">
          <div class="flex flex-col items-start lg:flex-row  justify-center gap-3 lg:gap-5 grow">
            <div class="relative pt-1 text-theme-600/60">
              <svg class="size-6 lg:size-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M13 14.725c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275zm-13 0c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275z" /></svg>
            </div>
            <div class="  shrink inline-block">
              <CardText
                :key="activeIndex"
                tag="span"
                animate="rise"
                class="text-xl lg:text-2xl  2xl:text-3xl font-serif !leading-[1.6] font-medium x-font-title line-clamp-6  "
                :card
                :path="pathCheck(`items.${activeIndex}.content`, schema)"
              />
            </div>
          </div>
        </div>
        <!-- Navigation dots -->
        <div class="w-full">
          <div class="flex gap-2">
            <div
              v-for="(item, i) in items.slice(0, 5)"
              :key="i"
              class="transition-opacity duration-500 cursor-pointer text-center min-w-0"
              :class="activeIndex === i ? 'opacity-100' : 'opacity-40 hover:opacity-80'"
              :style="{ flexBasis: `${100 / items.length}%` }"
              @click="setActiveItem(i)"
            >
              <div class="flex flex-col items-center p-2 gap-2">
                <div>
                  <XMedia :media="item.user?.media" class="size-8 md:size-10 rounded-full overflow-clip ring-2 ring-white" />
                </div>
                <div class="text-center w-full" :class="activeIndex === i ? '' : ''">
                  <CardText
                    tag="div"
                    class="text-xs font-sans truncate w-full"
                    :card
                    :path="pathCheck(`items.${i}.user.label`, schema)"
                    animate="fade"
                  />
                  <CardText
                    tag="div"
                    class="text-[10px] md:text-xs font-sans opacity-50 truncate w-full"
                    :card
                    :path="pathCheck(`items.${i}.user.subLabel`, schema)"
                    animate="fade"
                  />
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
.mega-shadow{
  box-shadow:
  0px 5px 71px -66px rgba(0, 0, 0, 0.74),
  0px 10.2px 89.1px -66px rgba(0, 0, 0, 0.359),
  0px 18px 101px -66px rgba(0, 0, 0, 0.23)
;
}
</style>
