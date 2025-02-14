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
      title: 'Your Contacts and Audience',
      subTitle: 'Build and manage your audience and professional connections.',
    }"
    theme="cyan"
  />
</template>
