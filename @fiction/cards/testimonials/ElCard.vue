<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import EffectCarousel from '@fiction/ui/effect/EffectCarousel.vue'
import ElImage from '@fiction/ui/media/ElImage.vue'
import CardText from '../CardText.vue'
import NavDots from '../el/NavDots.vue'
import LayoutMega from './LayoutMega.vue'
import LayoutSlider from './LayoutSlider.vue'

import type { Testimonial, UserConfig } from './index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
</script>

<template>
  <div class="">
    <LayoutMega v-if="uc.layout === 'mega'" :card />
    <LayoutSlider v-else :card />
  </div>
</template>

<style lang="less">
.carousel-cell{
  opacity: .4;
  &.is-selected{
    opacity: 1
  }
}
</style>
