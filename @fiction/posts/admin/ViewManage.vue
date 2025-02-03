<script lang="ts" setup>
import type { Card } from '@fiction/site'
import SettingsBoard from '@fiction/admin/settings/SettingsBoard.vue'
import { vue } from '@fiction/core'

const { card } = defineProps<{ card: Card }>()
const loading = vue.ref(false)
</script>

<template>
  <SettingsBoard
    :loading
    :card
    :panel-props="{ }"
    :header="{
      title: 'Content Management',
      subTitle: 'Create and manage your content library. Write, schedule, and publish.',
      media: { class: `i-tabler-stack` },
      action: {},
    }"
    color-theme="indigo"
  />
</template>
