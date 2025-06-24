<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './config.js'
import { pathCheck, vue } from '@fiction/core'
import TransitionSlide from '@fiction/ui/anim/TransitionSlide.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import XEntry from '@fiction/ui/prose/XEntry.vue'
import CardText from '../../CardText.vue'
import CardWrap from '../../CardWrap.vue'
import CardActionArea from '../../el/CardActionArea.vue'
import { schema } from './config.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})

// Only toggle mode: each item can be opened/closed independently
const openItems = vue.ref<Set<number>>(new Set())

function toggleItem(index: number) {
  const newSet = new Set(openItems.value)
  if (newSet.has(index)) {
    newSet.delete(index)
  }
  else {
    newSet.add(index)
  }
  openItems.value = newSet
}

function isItemOpen(index: number) {
  return openItems.value.has(index)
}
</script>

<template>
  <CardWrap :card>
    <div class="mx-auto max-w-2xl">
      <div
        v-for="(item, i) in uc.items"
        :key="i"
        class="py-4 border-b border-theme-100 dark:border-theme-800 last:border-b-0"
      >
        <!-- Question Row -->
        <div
          class="flex items-center gap-2 cursor-pointer group justify-between"
          @click="toggleItem(i)"
        >
          <CardText
            :card
            :path="pathCheck(`items.${i}.title`, schema)"
            class="x-font-title text-lg sm:text-xl font-medium text-theme-900 dark:text-theme-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors tracking-tight"
          />
          <span class="flex-shrink-0 ml-3">
            <XIcon
              :media="{ class: isItemOpen(i) ? 'i-tabler-x' : 'i-tabler-plus' }"
              class="size-5 text-theme-400 group-hover:text-primary-500 transition-all duration-200"
              :style="isItemOpen(i) ? 'transform: rotate(45deg);' : 'transform: rotate(0deg);'"
            />
          </span>
        </div>
        <!-- Content Area with Slide Animation -->
        <TransitionSlide>
          <div v-show="isItemOpen(i)" class="">
            <div v-if="item.media" class="flex justify-center my-5">
              <XMedia
                :media="item.media"
                :animate="true"
                class="rounded-lg overflow-hidden shadow-sm border border-theme-200 dark:border-theme-700 bg-theme-50 dark:bg-theme-900 aspect-video w-full max-w-md"
              />
            </div>
            <XEntry>
              <CardText
                :card
                :path="pathCheck(`items.${i}.content`, schema)"
                class="text-base sm:text-lg text-theme-700 dark:text-theme-300 !leading-relaxed mt-2 sm:mt-3 mb-1 sm:mb-2"
              />
            </XEntry>
          </div>
        </TransitionSlide>
      </div>
    </div>

    <!-- Support Section -->
    <div
      v-if="uc.support?.text || uc.support?.action?.buttons?.length"
      class="mt-4 text-center max-w-xl mx-auto space-y-4 border-t border-theme-100 dark:border-theme-800 pt-4"
    >
      <CardText
        v-if="uc.support.text"
        :card
        :path="pathCheck(`support.text`, schema)"
        class="text-base text-theme-600 dark:text-theme-400 x-font-title"
      />
      <CardActionArea
        v-if="uc.support.action"
        :card
        :base-path="pathCheck(`support.action`, schema)"
        :action="uc.support.action"
        :classes="{ buttons: 'flex gap-4 justify-center flex-wrap' }"
      />
    </div>
  </CardWrap>
</template>
