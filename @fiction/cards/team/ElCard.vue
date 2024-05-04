<script lang="ts" setup>
import type { MediaDisplayObject, NavItem } from '@fiction/core'
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import StandardTeam from './StandardTeam.vue'

export type UserConfig = {
  layout?: 'mediabox' | 'grid'
  heading?: string
  subHeading?: string
  superHeading?: string
  profiles?: {
    name?: string
    desc?: string
    title?: string
    media?: MediaDisplayObject
    social?: NavItem[]
  }[]
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
  <div :class="card.classes.value.contentWidth">
    <div class="grid grid-cols-1 gap-x-8 gap-y-20  xl:grid-cols-3">
      <div class="mx-auto max-w-2xl lg:mx-0 text-center lg:text-left space-y-3 lg:space-y-6">
        <h2 class="text-3xl font-bold tracking-tight sm:text-5xl x-font-title">
          {{ uc.heading }}
        </h2>
        <p class="text-lg leading-8 dark:text-theme-300">
          {{ uc.subHeading }}
        </p>
      </div>
      <StandardTeam :card="card" />
    </div>
  </div>
</template>
