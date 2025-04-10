<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import { vue } from '@fiction/core'
import FeatureItem from './FeatureItem.vue'

const { card, features, layout, style } = defineProps<{
  card: Card<UserConfig>
  features: NonNullable<UserConfig['items']>
  layout: UserConfig['layout']
  style: UserConfig['style']
}>()

const columns = vue.computed(() => ({
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
  6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
}[layout?.columns || '3']))

const spacing = vue.computed(() => ({
  tight: 'gap-8 lg:gap-10',
  normal: 'gap-10 lg:gap-14',
  relaxed: 'gap-12 lg:gap-20',
}[layout?.spacing || 'normal']))
</script>

<template>
  <div class="grid" :class="[columns, spacing]">
    <FeatureItem
      v-for="(feature, i) in features"
      :key="i"
      :card="card"
      :feature="feature"
      :index="i"
      :style="style"
      :layout="layout"
    />
  </div>
</template>
