<script lang="ts" setup>
import { formatNumber, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import CardText from '../CardText.vue'
import type { UserConfig } from './index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value)
</script>

<template>
  <div class=" ">
    <div class="mx-auto grid max-w-6xl md:grid-cols-3 px-6 lg:px-8 gap-8 md:gap-24">
      <div
        v-for="(feat, i) in uc.items"
        :key="i"
      >
        <div class="text-center">
          <CardText :card tag="h3" :path="`items.${i}.name`" class="x-font-title text-xl font-medium lg:text-2xl" />

          <div class="mt-4 text-6xl md:text-8xl font-semibold tracking-tight">
            {{ formatNumber(feat.value, feat.format || "abbreviated") }}
          </div>

          <CardText :card tag="p" :path="`items.${i}.desc`" class="text-theme-300 mt-3 font-sans text-sm font-semibold uppercase tracking-wide" />
        </div>
      </div>
    </div>
  </div>
</template>
