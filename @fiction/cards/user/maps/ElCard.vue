<script lang="ts" setup>
import type { Card } from '@fiction/site/card'
import type { MapUserConfig, UserConfig } from './config'
import { vue } from '@fiction/core'
import ElMap from './ElMap.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value)

// Helper to get aspect ratio class
function getAspectRatioClass(ratio: string = 'landscape') {
  const ratioMap = {
    square: 'aspect-square',
    video: 'aspect-video',
    landscape: 'aspect-[3/2]',
    portrait: 'aspect-[2/3]',
    ultrawide: 'aspect-[21/9]',
    custom: '',
  }
  return ratioMap[ratio as keyof typeof ratioMap]
}

function getCustomRatioStyle(map: MapUserConfig) {
  if (map.aspectRatio !== 'custom' || !map.customRatio)
    return {}

  return {
    aspectRatio: map.customRatio,
  }
}

const mapGridCols = vue.computed(() => {
  const count = uc.value?.maps?.length || 1
  if (count === 1)
    return ''
  if (count === 2)
    return 'md:grid-cols-2'
  if (count === 3)
    return 'md:grid-cols-3'
  return 'md:grid-cols-2 lg:grid-cols-2'
})
</script>

<template>
  <div class="relative" :class="card.classes.value.contentWidth">
    <div
      class="grid grid-cols-1 gap-6 lg:gap-8"
      :class="[mapGridCols]"
    >
      <div
        v-for="(map, i) in uc.maps"
        :key="i"
        class="relative w-full  "
      >
        <div
          class="w-full h-full"
          :class="[getAspectRatioClass(map.aspectRatio)]"
          :style="getCustomRatioStyle(map)"
        >
          <ElMap
            class="absolute inset-0 w-full h-full"
            :map-config="map"
            :container="`mapbox-${card.cardId}-${i}`"
            :animate="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
