<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import StandardTeam from './StandardTeam.vue'
import type { UserConfig } from './index.js'

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
    <div class="grid grid-cols-1 gap-x-6 lg:gap-x-16 gap-y-20 lg:grid-cols-3">
      <div v-if="uc.heading" class="mx-auto max-w-2xl lg:mx-0 text-center lg:text-right space-y-3 lg:space-y-6">
        <h2 class="text-3xl font-bold tracking-tight sm:text-5xl md:text-balance x-font-title">
          {{ uc.heading }}
        </h2>
        <p class="text-lg lg:text-2xl leading-8 dark:text-theme-300">
          {{ uc.subHeading }}
        </p>
      </div>
      <StandardTeam :card="card" class="grid-cols-1 " :class="uc.heading ? 'lg:col-span-2' : 'lg:col-span-3'" />
    </div>
  </div>
</template>
