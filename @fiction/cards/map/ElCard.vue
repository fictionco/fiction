<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'
import { vue } from '@fiction/core'
import ElMap from './ElMap.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})

const maps = vue.computed(() => {
  return uc.value.maps || []
})

const mapCols = vue.computed(() => {
  return maps.value.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1'
})
</script>

<template>
  <div class="relative" :class="card.classes.value.contentWidth">
    <div class="grid grid-cols-1 gap-4 md:gap-6 lg:gap-10" :class="[mapCols]">
      <ElMap
        v-for="(map, i) in uc.maps"
        :key="i"
        class="aspect-square md:aspect-[3/2]  md:h-auto [clip-path:inset(0_round_20px)] shadow-sm  drop-shadow-md"
        :map-config="map"
        :container="`mapbox-${card.cardId}-${i}`"
      />
    </div>
  </div>
</template>
