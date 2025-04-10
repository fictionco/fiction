<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import CardLink from '@fiction/cards/el/CardLink.vue'
import { vue } from '@fiction/core'
import FeatureItem from './FeatureItem.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
  features: { type: Array as vue.PropType<NonNullable<UserConfig['items']>>, required: true },
  layout: { type: Object as vue.PropType<UserConfig['layout']>, required: true },
  style: { type: Object as vue.PropType<UserConfig['style']>, required: true },
})

// Get spacing class based on layout option
const gridGap = vue.computed(() => ({
  tight: 'gap-4',
  normal: 'gap-8',
  relaxed: 'gap-12',
}[props.layout?.spacing || 'normal']))

// Use fixed Tailwind classes for column spans
function getColSpan(feature: NonNullable<UserConfig['items']>[0]) {
  const cols = feature.columns || props.layout?.columns || '3'

  const spanClasses = {
    4: 'col-span-12 md:col-span-3',
    3: 'col-span-12 md:col-span-4',
    2: 'col-span-12 md:col-span-6',
    1: 'col-span-12 md:col-span-12',
  }

  return spanClasses[cols] || spanClasses['3']
}

const displayFeatures = vue.computed(() => {
  return props.features.map(feature => ({
    ...feature,
    columns: feature.columns || '2',
  }))
})
</script>

<template>
  <div
    class="grid grid-cols-12"
    :class="gridGap"
  >
    <CardLink
      v-for="(feature, index) in displayFeatures"
      :key="index"
      :card="card"
      :href="feature.href"
      :class="[getColSpan(feature)]"
      class="relative overflow-hidden rounded-2xl"
    >
      <FeatureItem
        :card="card"
        :feature="feature"
        :index="index"
        :style="style"
        :layout="{ ...layout, style: 'cards' }"
        class="h-full"
      />
    </CardLink>
  </div>
</template>
