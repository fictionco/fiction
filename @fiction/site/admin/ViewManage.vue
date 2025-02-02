<script lang="ts" setup>
import type { Card } from '@fiction/site'
import SettingsBoard from '@fiction/admin/settings/SettingsBoard.vue'

const { card } = defineProps<{ card: Card }>()
</script>

<template>
  <SettingsBoard
    :card
    :panel-props="{ }"
    base-path="/sites"
    :header="{
      title: 'Website Creator',
      subTitle: 'Design and manage your digital presence with customizable websites, and landing pages.',
      media: { class: 'i-tabler-browser' },
      action: {},
    }"
  />
</template>
