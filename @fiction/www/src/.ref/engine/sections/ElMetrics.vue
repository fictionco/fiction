<script lang="ts" setup>
import type { ListItem, NumberFormats, vue } from '@factor/api'
import { formatNumber } from '@factor/api'

export interface SectionProps {
  title?: string
  subTitle?: string
  items?: (ListItem & { format?: NumberFormats })[]
}

defineProps({
  settings: {
    type: Object as vue.PropType<SectionProps>,
    required: true,
  },
})
</script>

<template>
  <div class=" ">
    <div class="mx-auto grid max-w-6xl grid-cols-3 px-6 lg:px-8">
      <div
        v-for="(feat, i) in settings.items"
        :key="i"
        class="gap-24"
      >
        <div class="text-center">
          <h3
            class="ui-font-title text-xl font-medium lg:text-2xl"
            v-html="feat.name"
          />

          <div class="mt-4 text-8xl font-semibold tracking-tight">
            {{ formatNumber(feat.value, feat.format || "abbreviated") }}
          </div>
          <p
            v-if="feat.desc"
            class="text-theme-300 mt-3 font-sans text-sm font-semibold uppercase tracking-wide"
            v-html="feat.desc"
          />
        </div>
      </div>
    </div>
  </div>
</template>
