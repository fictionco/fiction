<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import { pathCheck, vue } from '@fiction/core'
import EffectCarousel from '@fiction/ui/effect/EffectCarousel.vue'
import XShape from '@fiction/ui/effect/XShape.vue'
import CardText from '../CardText.vue'
import CardActionArea from '../el/CardActionArea.vue'
import NavDots from '../el/NavDots.vue'
import { schema } from './config'

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
</script>

<template>
  <div class="statement-container" :data-statement-slides="uc.items?.length">
    <EffectCarousel v-model:active-index="activeIndex" :slides="items" :options="carouselOptions" @slide-change="onSlideChange">
      <template #default="{ index }">
        <div
          class="carousel-cell w-[80%] sm:w-[70%] lg:w-[60%] max-w-[800px] mr-24"
        >
          <div
            class="max-w-[900px] mx-auto sm:p-6 transition-all"
            :class="index === activeIndex ? 'opacity-100' : 'opacity-50 hover:opacity-100 cursor-pointer'"
            @click="activeIndex = index"
          >
            <div class="space-y-[2vw] relative">
              <div class="z-10 relative space-y-6">
                <div class="flex items-baseline gap-12">
                  <CardText
                    tag="h2"
                    class="text-4xl sm:!leading-[1.1] sm:text-4xl xl:text-6xl x-font-title font-semibold text-balance"
                    :card
                    :path="pathCheck(`items.${index}.title`, schema)"
                    animate="fade"
                  />
                  <div class="border-b-4 border-theme-500/10 h-1 grow" />
                </div>

                <CardText
                  tag="p"
                  class="text-lg leading-relaxed sm:!leading-[1.4] sm:text-3xl opacity-90"
                  :card
                  :path="pathCheck(`items.${index}.content`, schema)"
                  animate="fade"
                />
              </div>
              <XShape class="top-0 left-0 absolute size-[12vw] translate-x-[-45%] translate-y-[-50%]" shape="circle" :rotate="6" />
            </div>

            <CardActionArea
              :card
              :base-path="pathCheck(`items.${index}.action`, schema)"
              :classes="{ buttons: 'flex gap-4' }"
              class="mt-8"
              size="2xl"
              @click.stop
            />
          </div>
        </div>
      </template>
    </EffectCarousel>
    <NavDots
      v-if="items.length > 1"
      v-model:active-item="activeIndex"
      :wrap-selector="`[data-card-id='${card.cardId}']`"
      :items="items"
      class="mt-12 z-20 justify-center "
    />
  </div>
</template>
