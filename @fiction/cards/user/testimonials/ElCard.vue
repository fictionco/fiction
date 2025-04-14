<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './index.js'
import { vue } from '@fiction/core'
import CardWrap from '../../CardWrap.vue'
import LayoutMasonry from './LayoutMasonry.vue'
import LayoutMega from './LayoutMega.vue'
import LayoutSlider from './LayoutSlider.vue'

const { card } = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => card.userConfig.value || {})
</script>

<template>
  <CardWrap :card>
    <LayoutMega v-if="uc.layout === 'mega'" :card />
    <LayoutMasonry v-else-if="uc.layout === 'masonry'" :card />
    <LayoutSlider v-else :card />
  </CardWrap>
</template>
