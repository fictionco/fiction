<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import XText from '@fiction/ui/common/XText.vue'
import CardText from '../CardText.vue'

import type { UserConfig } from './index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})
</script>

<template>
  <div :class="card.classes.value.contentWidth" class="space-y-12">
    <div class="space-y-6 text-left md:text-balance max-w-md text-theme-500 dark:text-theme-600">
      <CardText animate="fade" :card path="heading" class="text-4xl  x-font-title font-semibold" />
      <CardText v-if="uc.subHeading" animate="fade" :card path="subHeading" class="text-2xl " />
    </div>
    <div>
      <div
        v-for="(item, i) in uc.items"
        :key="i"
      >
        <div class="divider h-[1px] dark:bg-theme-800 bg-theme-200 my-6" />
        <div class="py-6 flex flex-col-reverse lg:flex-row justify-between gap-6 lg:items-center ">
          <div class="space-y-4 max-w-screen-md">
            <CardText :card :path="`items.${i}.name`" animate="fade" class="text-2xl sm:text-3xl lg:text-5xl x-font-title font-semibold text-balance " />
            <CardText :card :path="`items.${i}.desc`" animate="fade" class="text-lg sm:text-xl lg:text-3xl leading-relaxed lg:leading-relaxed text-theme-600 dark:text-theme-100" />
          </div>
          <XText animate="rise" :model-value="String(i + 1).padStart(2, '0')" class="text-5xl lg:text-8xl font-sans font-bold antialiased text-theme-500/30" />
        </div>
      </div>
    </div>
  </div>
</template>
