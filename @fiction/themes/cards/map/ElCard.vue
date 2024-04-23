<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElMap from './ElMap.vue'
import type { UserConfig } from '.'

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
  return maps.value.length > 1 ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
})
</script>

<template>
  <div class="relative" :class="card.classes.value.contentWidth">
    <div class="grid grid-cols-1 gap-4 lg:gap-6" :class="[mapCols]">
      <ElMap
        v-for="(map, i) in uc.maps"
        :key="i"
        class="aspect-square lg:aspect-video  lg:h-auto [clip-path:inset(0_round_20px)] shadow-sm  drop-shadow-md"
        :map-config="map"
        :container="`mapbox-${i}`"
      />
    </div>
  </div>
</template>
