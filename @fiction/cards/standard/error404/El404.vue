<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './index.js'
import El404 from '@fiction/ui/page/El404.vue'

defineProps<{
  card: Card<UserConfig>
}>()
</script>

<template>
  <El404 v-bind="{ ...card.userConfig, actions: card.userConfig.value.action?.buttons }" />
</template>
