<script lang="ts" setup>
import type { ActionItem, MediaDisplayObject } from '@fiction/core'
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElImage from '@fiction/ui/ElImage.vue'
import StandardTeam from './StandardTeam.vue'

export type UserConfig = {
  heading?: string
  subHeading?: string
  superHeading?: string
  actions?: ActionItem[]
  splash?: MediaDisplayObject
  layout?: 'center' | 'justified' | 'right' | 'left'
}
const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})
</script>

<template>
  <div class=" ">
    <div class="mx-auto max-w-6xl px-6 lg:px-8">
      <StandardTeam :card="card" />
    </div>
  </div>
</template>
