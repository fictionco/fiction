<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElHeader from './ElHeader.vue'

const { card, header, subHeader, avatar } = defineProps<{ card: Card, header?: string, subHeader?: string, avatar?: MediaObject }>()
</script>

<template>
  <div>
    <div class="font-semibold text-lg p-4 border-b border-theme-300 dark:border-theme-700/70">
      {{ card.title.value }}
    </div>
    <ElHeader
      v-if="header"
      class="p-12"
      :heading="header"
      :subheading="subHeader"
      :avatar
    />
    <slot />
  </div>
</template>
