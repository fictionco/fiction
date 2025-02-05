<script lang="ts" setup>
import type { Card } from '@fiction/site'
import SettingsBoard from '@fiction/admin/settings/SettingsBoard.vue'

const { card } = defineProps<{ card: Card }>()
const _hello = 1
</script>

<template>
  <SettingsBoard
    :card
    :header="{
      media: { class: `i-tabler-users` },
      title: 'Audience Management',
      subTitle: 'Build and manage your subscriber base. Track engagement, update contact information, and monitor subscription status.',
    }"
    theme="cyan"
  />
</template>
