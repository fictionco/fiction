<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './config.js'
import { vue } from '@fiction/core'
import CardText from '../CardText.vue'
import StandardTeam from './StandardTeam.vue'

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
      <div v-if="uc.title" class="mx-auto max-w-2xl lg:mx-0 text-center lg:text-right space-y-3 ">
        <CardText animate="fade" :card path="title" tag="h2" class="text-2xl font-semibold md:text-3xl xl:text-5xl md:text-balance x-font-title" />
        <CardText animate="fade" :card path="subTitle" tag="p" class="text-lg lg:text-2xl leading-8 dark:text-theme-300" />
      </div>
      <StandardTeam :card class="grid-cols-1 " :class="uc.title ? 'lg:col-span-2' : 'lg:col-span-3'" />
    </div>
  </div>
</template>
