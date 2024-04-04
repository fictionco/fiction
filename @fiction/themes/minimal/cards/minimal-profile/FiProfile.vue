<script setup lang="ts">
import type { ActionItem, MediaItem, NavItem } from '@fiction/core'
import { vue } from '@fiction/core'
import ElImage from '@fiction/ui/ElImage.vue'
import type { Card } from '@fiction/site/card'
import XText from '@fiction/site/plugin-builder/XText.vue'
import XSocials from '../ui/XSocials.vue'

export type UserConfig = {
  heading?: string
  subHeading?: string
  superHeading?: string
  mediaItems?: MediaItem[]
  detailsTitle?: string
  details?: NavItem[]
  actions?: ActionItem[]
  socials?: NavItem[]
}

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})

const mediaItems = vue.computed(() => {
  return uc.value.mediaItems?.filter(_ => _.media?.url)
})

const activeItem = vue.ref(0)
const activeMediaItem = vue.computed(() => {
  return mediaItems.value?.[activeItem.value]?.media
})

function setActiveItem(index: number) {
  activeItem.value = index
}
</script>

<template>
  <div class="minimal-profile">
    <div :class="card.classes.value.contentWidth">
      <div class="md:flex -mx-2">
        <div class="w-full md:w-[50%] px-2 ">
          <div class="relative">
            <transition
              enter-active-class="transition ease duration-200"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition ease duration-200"
              leave-from-class="opacity-100 "
              leave-to-class="opacity-0"
              mode="out-in"
            >
              <ElImage v-if="activeMediaItem?.url" :key="activeMediaItem.url" :media="activeMediaItem" class="aspect-[5.3/8]" />
            </transition>
            <div v-if="mediaItems?.length && mediaItems.length > 1" class="nav flex w-full justify-center space-x-3 absolute bottom-4 z-20">
              <div
                v-for="(s, i) in mediaItems"
                :key="i"
                class="h-3 rounded-full transition-all duration-700 bg-black/40 ring-2 ring-white shadow-lg"
                :class="
                  i === activeItem
                    ? ' w-5'
                    : 'opacity-40 hover:opacity-100 cursor-pointer w-3'
                "
                @click="setActiveItem(i)"
              />
            </div>
          </div>
        </div>
        <div class="md:w-[50%]  px-2 flex items-center">
          <div class="p-6 md:p-12 xl:p-[calc(1500px*0.06)] flex flex-col justify-center gap-20">
            <div class="details">
              <XText
                tag="h3"
                :card="card"
                class="text-theme-300 mb-4 text-base lg:text-base x-font-sans font-semibold"
                path="superHeading"
              />
              <XText
                tag="h1"
                :card="card"
                class="heading text-3xl font-bold md:text-4xl lg:text-5xl x-font-title tracking-tight lg:leading-[1.1] text-balance"
                path="heading"
              />
              <XText
                tag="div"
                :card="card"
                class="sub-heading mt-6 text-lg  font-medium  entry text-balance"
                path="subHeading"
                :is-markdown="true"
              />
            </div>

            <div class="list">
              <XText
                tag="h3"
                :card="card"
                class="sub-heading  text-theme-300 x-font-sans text-sm font-semibold mb-4"
                path="detailsTitle"
                placeholder="List Title"
              />
              <div class="flex gap-[10%] gap-y-4 flex-wrap font-sans text-sm font-medium">
                <div v-for="(item, i) in uc.details" :key="i" class="w-[45%] ">
                  <XText
                    :card="card"
                    class="font-semibold"
                    :path="`details.${i}.name`"
                  />
                  <XText
                    tag="a"
                    :card="card"
                    :class="item.href ? 'hover:text-primary-500 text-primary-600' : 'text-theme-500'"
                    :path="`details.${i}.desc`"
                    :href="item.href"
                  />
                </div>
              </div>
            </div>

            <XSocials :socials="uc.socials || []" class="flex space-x-6 text-2xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import "@fiction/ui/entry.less";
</style>
