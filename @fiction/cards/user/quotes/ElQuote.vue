<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { Quote, UserConfig } from './config'
import { pathCheck, vue } from '@fiction/core'
import XIcon from '@fiction/ui/media/XIcon.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../CardText.vue'
import NavDots from '../el/NavDots.vue'
import { schema } from './config'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const quotes = vue.computed(() => uc.value.items?.length ? uc.value.items : [])

const hasAuthorImage = (quote: Quote) => quote?.author?.media?.url || quote?.author?.media?.html
const hasOrgImage = (quote: Quote) => quote?.org?.media?.url || quote?.org?.media?.html

const activeItem = vue.ref(0)
</script>

<template>
  <div class="mx-auto max-w-5xl ">
    <div class="flex overflow-x-auto no-scrollbar snap-mandatory snap-x">
      <div v-for="(quote, i) in quotes" :key="i" class="slide shrink-0 w-full snap-center px-10 space-y-6 md:space-y-8">
        <div v-if="hasOrgImage(quote) && quote?.org" class="org text-center">
          <div data-test-id="org-image" class="relative inline-block dark:text-theme-0">
            <XMedia
              class="h-10 md:h-20 aspect-[2/1] object-contain"
              :media="quote.org.media"
              :alt="quote.org.subLabel"
            />
          </div>
        </div>
        <div class="flex justify-center gap-2 md:gap-5">
          <div class="shrink-0 ">
            <XIcon class="size-6 md:ml-0 lg:size-16 rotate-180 text-theme-500 dark:text-theme-400" :media="{ class: 'i-tabler-quote' }" />
          </div>
          <div class="entry min-w-0 text-left text-xl md:text-4xl lg:text-5xl x-font-title !leading-[1.3]">
            <CardText
              tag="span"
              :card
              :path="pathCheck(`items.${i}.text`, schema)"
              animate="fade"
            />
          </div>
        </div>
        <div v-if="quote?.author?.label" class="flex items-center  justify-center gap-4 ">
          <div
            v-if="hasAuthorImage(quote)"
            class="relative aspect-square h-10 md:h-14 overflow-hidden rounded-full dark:ring-2 dark:ring-theme-0 m-1"
          >
            <XMedia
              class="absolute h-full w-full object-cover"
              :media="quote.author.media"
            />
          </div>
          <div class="text-left  space-y-0.5" :class="hasAuthorImage(quote) ? 'text-left' : 'md:text-center'">
            <CardText
              :card
              :path="pathCheck(`items.${i}.author.label`, schema)"
              class="text-lg md:text-2xl font-medium"
              animate="fade"
            />
            <CardText
              class="font-sans text-sm md:text-xl text-theme-500 dark:text-theme-400"
              :card
              :path="pathCheck(`items.${i}.author.subLabel`, schema)"
              animate="fade"
            />
          </div>
        </div>
      </div>
    </div>
    <NavDots
      v-model:active-item="activeItem"
      :wrap-selector="`[data-card-id='${card.cardId}']`"
      :items="quotes"
      class="mt-12 z-20 mb-6 justify-center "
    />
  </div>
</template>

<style lang="less">
@import '@fiction/ui/entry.less';
</style>
