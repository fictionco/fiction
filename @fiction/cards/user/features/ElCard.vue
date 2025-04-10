<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import { vue } from '@fiction/core'
import FeaturesCarousel from './FeaturesCarousel.vue'
import FeaturesGrid from './FeaturesGrid.vue'
import FeaturesMasonry from './FeaturesMasonry.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})

const LayoutComponent = vue.computed(() => {
  const layoutStyle = uc.value.layout?.style || 'grid'
  return {
    grid: FeaturesGrid,
    cards: FeaturesGrid,
    carousel: FeaturesCarousel,
    masonry: FeaturesMasonry,
  }[layoutStyle] || FeaturesGrid
})
</script>

<template>
  <div class="space-y-12" :class="[card.classes.value.contentWidth]" :data-layout-style="uc.layout?.style">
    <!-- Features Layout -->
    <component
      :is="LayoutComponent"
      :card="card"
      :features="uc.items || []"
      :layout="uc.layout || {}"
      :style="uc.style || {}"
    />
  </div>
</template>
