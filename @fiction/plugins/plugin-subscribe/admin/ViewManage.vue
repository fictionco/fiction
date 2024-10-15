<script lang="ts" setup>
import type { Card } from '@fiction/site'
import SettingsBoard from '@fiction/admin/settings/SettingsBoard.vue'

const { card } = defineProps<{ card: Card }>()
const _hello = 1
</script>

<template>
  <SettingsBoard
    :card
    base-path="/audience"
    :header="{
      title: 'Manage Subscribers',
      subTitle: 'Manage your subscribers and subscriptions',
    }"
  />
</template>
