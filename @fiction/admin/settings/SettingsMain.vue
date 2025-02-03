<script setup lang="ts">
import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import SettingsBoard from './SettingsBoard.vue'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})
</script>

<template>
  <SettingsBoard
    :card="card"
    base-path="/settings"
    :header="{
      media: { class: 'i-tabler-settings' },
      title: 'All Settings',
      subTitle: 'Manage your workspace, team, and personal preferences',
    }"
    color-theme="green"
  />
</template>
