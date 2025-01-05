<script lang="ts" setup>
import type { Card } from '@fiction/site'
import SettingsBoard from '@fiction/admin/settings/SettingsBoard.vue'

const { card } = defineProps<{ card: Card }>()
</script>

<template>
  <SettingsBoard
    :card
    :header="{
      title: 'Brand Intelligence Hub',
      subTitle: 'Create smart brand guidelines that power AI-assisted content creation',
      media: { class: 'i-tabler-briefcase' },
      action: {},
    }"
  />
</template>
