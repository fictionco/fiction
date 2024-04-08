<script lang="ts" setup>
import type { ActionItem, MediaDisplayObject } from '@fiction/core'
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import CardHeader from '../el/CardHeader.vue'
import type { UserConfig as HeaderUserConfig } from '../el/CardHeader.vue'
import ElMap from './ElMap.vue'

export type UserConfig = {
  maps?: {
    lat?: number
    lng?: number
    zoom?: number
    markers?: { lat: number, lng: number }[]
    mapStyle?: 'satellite' | 'street'
  }[]
} & HeaderUserConfig

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
  return maps.value.length > 2 ? 'lg:grid-cols-3' : maps.value.length > 1 ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
})
</script>

<template>
  <div class="relative">
    <CardHeader v-if="uc.heading" :card="card" class="mb-12 relative z-10 mx-auto max-w-screen-md p-6 rounded-lg" />

    <div class="grid grid-cols-1" :class="[mapCols]">
      <ElMap
        v-for="(map, i) in uc.maps"
        :key="i"
        :lat="map?.lat"
        :lng="map?.lng"
        :zoom="map?.zoom"
        :markers="map?.markers || []"
        :map-style="map?.mapStyle"
        :container="`mapbox-${i}`"
      />
    </div>
  </div>
</template>
