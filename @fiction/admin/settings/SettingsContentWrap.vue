<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElHeader from './ElHeader.vue'

const { header, subHeader, avatar } = defineProps<{ card: Card, header?: string, subHeader?: string, avatar?: MediaObject }>()
</script>

<template>
  <div>
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
