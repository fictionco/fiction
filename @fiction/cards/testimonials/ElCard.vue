<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './index.js'
import { vue } from '@fiction/core'
import LayoutMasonry from './LayoutMasonry.vue'
import LayoutMega from './LayoutMega.vue'

import LayoutSlider from './LayoutSlider.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
</script>

<template>
  <div class="">
    <LayoutMega v-if="uc.layout === 'mega'" :card />
    <LayoutMasonry v-else-if="uc.layout === 'masonry'" :card />
    <LayoutSlider v-else :card />
  </div>
</template>
