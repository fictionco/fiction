<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './config.js'
import { pathCheck, vue } from '@fiction/core'
import TransitionSlide from '@fiction/ui/anim/TransitionSlide.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../CardText.vue'
import CardActionArea from '../el/CardActionArea.vue'
import { schema } from './config.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const layout = vue.computed(() => uc.value.layout || 'accordion')

// Track open state for accordion/toggle layouts
const openItems = vue.ref<Set<number>>(new Set())

function toggleItem(index: number) {
  if (layout.value === 'accordion') {
    openItems.value = new Set(openItems.value.has(index) ? [] : [index])
  }
  else if (layout.value === 'toggle') {
    const newSet = new Set(openItems.value)
    if (newSet.has(index)) {
      newSet.delete(index)
    }
    else {
      newSet.add(index)
    }
    openItems.value = newSet
  }
}

function isItemOpen(index: number) {
  return layout.value === 'visible' || openItems.value.has(index)
}
</script>

<template>
  <div :class="card.classes.value.contentWidth" :data-layout-mode="layout">
    <!-- FAQ Items List -->
    <div class="max-w-screen-lg mx-auto space-y-4">
      <div
        v-for="(item, i) in uc.items"
        :key="i"
        class="group rounded-xl ring ring-theme-300/30 dark:ring-theme-600/30"
        :class="[layout !== 'visible' ? 'cursor-pointer hover:ring-theme-300/50 dark:hover:ring-theme-600/60' : '']"
      >
        <!-- Question/Title Row -->
        <div
          class="relative p-4 lg:p-6 xl:p-8 flex items-start gap-5"
          @click="layout !== 'visible' && toggleItem(i)"
        >
          <!-- Icon -->
          <XIcon
            v-if="item.icon"
            :media="item.icon"
            class="flex-shrink-0 size-7 text-primary-500 dark:text-primary-400"
          />

          <div class="flex-grow">
            <div class="flex justify-between">
              <CardText
                :card
                :path="pathCheck(`items.${i}.title`, schema)"
                class="x-font-title text-xl lg:text-2xl font-semibold text-theme-900 dark:text-theme-100 transition-colors"
                :class="[
                  isItemOpen(i) && 'text-primary-600 dark:text-primary-400',
                ]"
              />
              <!-- Toggle Button -->
              <button
                v-if="layout !== 'visible'"
                type="button"
                class="flex-shrink-0 "
                @click.stop="toggleItem(i)"
              >
                <XIcon
                  :media="{ class: 'i-tabler-chevron-down' }"
                  class="size-6 text-theme-400 transition-transform duration-200"
                  :class="isItemOpen(i) && 'rotate-180'"
                />
              </button>
            </div>

            <!-- Content Area -->
            <TransitionSlide>
              <div v-show="isItemOpen(i)" class="relative">
                <div
                  class="space-y-4 py-2"
                >
                  <!-- Media if present -->
                  <XMedia
                    v-if="item.media"
                    :media="item.media"
                    class="rounded-lg overflow-hidden bg-theme-100 dark:bg-theme-800 aspect-video w-96 my-6"
                  />

                  <!-- Content -->
                  <CardText
                    :card
                    :path="pathCheck(`items.${i}.content`, schema)"
                    class="prose prose-theme dark:prose-invert prose prose-lg md:prose-2xl "
                  />
                </div>
              </div>
            </TransitionSlide>
          </div>
        </div>
      </div>
    </div>

    <!-- Support Section -->
    <div
      v-if="uc.support?.text || uc.support?.action?.buttons?.length"
      class="mt-10 text-center max-w-[768px] mx-auto space-y-6"
    >
      <CardText
        v-if="uc.support.text"
        :card
        :path="pathCheck(`support.text`, schema)"
        class="text-lg text-theme-600 dark:text-theme-400 x-font-title"
      />

      <CardActionArea
        v-if="uc.support.action"
        :card
        :base-path="pathCheck(`support.action`, schema)"
        :action="uc.support.action"
        :classes="{ buttons: 'flex gap-4 justify-center  flex-wrap ' }"
      />
    </div>
  </div>
</template>
