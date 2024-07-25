<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import XNumber from '@fiction/ui/common/XNumber.vue'
import CardText from '../CardText.vue'
import type { UserConfig } from './index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value)
</script>

<template>
  <div :card="card.classes.value.contentWidth">
    <div class="mx-auto grid max-w-6xl  md:grid-cols-3 px-6 lg:px-8 gap-8 gap-y-12 md:gap-24">
      <div
        v-for="(feat, i) in uc.items"
        :key="i"
      >
        <div class="text-center">
          <CardText :card tag="h3" :path="`items.${i}.name`" class="text-xl font-medium lg:text-2xl" />

          <XNumber :animate="true" :model-value="feat.value || 0" class="mt-4 text-6xl lg:text-8xl font-bold x-font-title" :format="feat.format || 'abbreviated'" />

          <CardText :card tag="p" :path="`items.${i}.desc`" class="text-balance text-theme-400 dark:text-theme-500 mt-3 font-sans text-sm font-medium " />
        </div>
      </div>
    </div>
  </div>
</template>
