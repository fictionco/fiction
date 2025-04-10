<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import CardText from '@fiction/cards/CardText.vue'
import { vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import XMedia from '@fiction/ui/media/XMedia.vue'

const props = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => props.card.userConfig.value)
const layout = vue.computed(() => uc.value.layout || 'default')
const isDefaultLayout = vue.computed(() => !uc.value.layout || uc.value.layout === 'default')

vue.onMounted(() => {
  useElementVisible({
    caller: 'numberedList',
    selector: `#${props.card.cardId}`,
    onVisible: async () => {
      await animateItemEnter({
        targets: `#${props.card.cardId} .animate-item`,
        themeId: 'rise',
        config: {
          overallDelay: 600,
          totalAnimationTime: 2000,
        },
      })
    },
  })
})
</script>

<template>
  <div :id="card.cardId" :class="card.classes.value.contentWidth">
    <div
      class="mx-auto space-y-6"
      :class="[!isDefaultLayout ? 'max-w-screen-xl' : 'max-w-screen-lg']"
    >
      <CardText
        :card="card"
        path="title"
        tag="h2"
        class="x-font-title font-medium text-2xl md:text-4xl xl:text-6xl text-center mb-16 max-w-prose mx-auto"
        animate="rise"
      />

      <div
        class="flex flex-col lg:gap-12 xl:gap-24 justify-center"
        :class="[
          layout === 'left' ? 'lg:flex-row-reverse' : '',
          layout === 'right' ? 'lg:flex-row' : '',
        ]"
      >
        <div
          v-if="uc.media"
          class="w-full relative"
          :class="[
            !isDefaultLayout ? 'lg:w-[45%] lg:mb-0 hidden lg:flex items-center justify-center' : 'hidden',
          ]"
        >
          <div
            class="relative h-full"
            :class="[layout === 'right' ? 'right-0' : '', !isDefaultLayout ? 'w-full' : 'w-full']"
          >
            <XMedia
              :media="uc.media"
              class="w-full h-full object-cover rounded-lg overflow-hidden"
              :animate="true"
            />
          </div>
        </div>

        <div
          class="w-full"
          :class="[!isDefaultLayout ? 'lg:w-[55%]' : '']"
        >
          <div
            :class="[isDefaultLayout ? 'grid lg:grid-cols-[1fr_1fr] gap-8' : 'space-y-16']"
          >
            <div
              v-for="(item, i) in uc.items"
              :key="i"
              class="flex flex-col md:flex-row items-start gap-4 animate-item"
              :class="[
                isDefaultLayout ? [
                  i % 2 === 0 ? 'lg:col-start-1' : 'lg:col-start-2',
                  i % 2 === 0 ? 'lg:row-span-2' : 'lg:row-start-[calc(var(--row)*2)]',
                ] : [],
              ]"
              :style="isDefaultLayout ? { '--row': Math.floor(i / 2) + 1 } : {}"
            >
              <div class="flex-shrink-0 size-16 text-theme-400 dark:text-theme-500/30 rounded-full flex items-center justify-center">
                <span class="text-6xl font-semibold font-sans">{{ i + 1 }}</span>
              </div>
              <div>
                <CardText
                  :card="card"
                  :path="`items.${i}.content`"
                  tag="p"
                  class="text-2xl leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
