<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import NavDots from '@fiction/cards/el/NavDots.vue'
import { vue } from '@fiction/core'
import EffectCarousel from '@fiction/ui/effect/EffectCarousel.vue'
import FeatureItem from './FeatureItem.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
  features: { type: Array as vue.PropType<NonNullable<UserConfig['items']>>, required: true },
  layout: { type: Object as vue.PropType<UserConfig['layout']>, required: true },
  style: { type: Object as vue.PropType<UserConfig['style']>, required: true },
})

const activeIndex = vue.ref(0)

const carouselWidth = vue.computed(() => ({
  1: 'w-[85%] md:w-[100%]',
  2: 'w-[85%] md:w-[45%]',
  3: 'w-[85%] md:w-[32%]',
  4: 'w-[85%] md:w-[23%]',
  5: 'w-[85%] md:w-[18%]',
  6: 'w-[85%] md:w-[15%]',
}[props.layout?.columns || '3']))

const trigger = vue.ref(0)
vue.onMounted(() => {
  // Trigger carousel update on layout or style change
  vue.watch(() => [props.layout, props.style], () => trigger.value++)
})
</script>

<template>
  <div class="relative">
    <EffectCarousel
      v-model:active-index="activeIndex"
      :slides="features"
      :options="{ wrapAround: true }"
      :trigger
    >
      <template #default="{ slide, index }">
        <div class="carousel-cell mr-8 flex items-stretch min-h-full" :class="[carouselWidth]">
          <FeatureItem
            :card="card"
            :feature="slide"
            :index="index"
            :style="style"
            :layout="{ ...layout, style: 'cards' }"
          />
        </div>
      </template>
    </EffectCarousel>

    <NavDots
      v-model:active-item="activeIndex"
      :wrap-selector="`[data-card-id='${card.cardId}']`"
      :items="features"
      class="mt-16 z-20 justify-center "
    />
  </div>
</template>
