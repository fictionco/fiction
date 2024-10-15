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
    :card
    base-path="/settings"
    :header="{
      title: 'Settings',
      subTitle: 'Organization and user settings',
    }"
  />
</template>
