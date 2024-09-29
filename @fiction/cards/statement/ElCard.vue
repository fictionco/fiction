<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { Statement, UserConfig } from '.'
import { vue } from '@fiction/core'
import EffectCarousel from '@fiction/ui/effect/EffectCarousel.vue'
import CardText from '../CardText.vue'
import CardButtons from '../el/CardButtons.vue'

import NavDots from '../el/NavDots.vue'

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
  <div class="">
    <EffectCarousel v-model:active-index="activeIndex" :slides="items" :options="carouselOptions" @slide-change="onSlideChange">
      <template #default="{ slide, index }">
        <div class="carousel-cell w-[90%] sm:w-[80%] lg:w-[60%] mr-24">
          <div class="max-w-[900px] mx-auto sm:p-6">
            <div class="space-y-[2vw]">
              <CardText
                tag="div"
                class="text-4xl sm:!leading-[1.4] sm:text-5xl   xl:text-6xl x-font-title font-medium"
                :card
                :path="`items.${index}.title`"
                animate="fade"
              />

              <CardText
                tag="div"
                class="text-lg leading-relaxed sm:!leading-[1.6] sm:text-3xl opacity-90"
                :card
                :path="`items.${index}.content`"
                animate="fade"
              />
            </div>

            <CardButtons :card class="mt-12" :actions="(slide as Statement).actions" ui-size="2xl" animate="rise" />
          </div>
        </div>
      </template>
    </EffectCarousel>
    <NavDots
      v-model:active-item="activeIndex"
      :container-id="card.cardId"
      :items="items"
      class="mt-12 z-20"
    />
  </div>
</template>

<style lang="less">
.carousel-cell{
  opacity: .3;
  &.is-selected{
    transform: scale(1.1);
    opacity: 1
  }
}
</style>
