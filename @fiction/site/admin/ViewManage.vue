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
      title: 'Sites',
      subTitle: 'Customizable websites and landing pages.',
      media: { class: 'i-tabler-browser' },
      action: {},
      theme: 'green',
    }"
    theme="green"
  />
</template>
