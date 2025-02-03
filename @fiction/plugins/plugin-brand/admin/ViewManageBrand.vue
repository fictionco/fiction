<script lang="ts" setup>
import type { Card } from '@fiction/site'
import SettingsBoard from '@fiction/admin/settings/SettingsBoard.vue'

const { card } = defineProps<{ card: Card }>()
</script>

<template>
  <SettingsBoard
    :card
    :header="{
      title: 'Your Brand + AI',
      subTitle: 'Create a brand guide to help AI create and manage your presence effectively',
      media: { class: `i-tabler-map` },
      action: {},
    }"
    color-theme="sky"
  />
</template>
