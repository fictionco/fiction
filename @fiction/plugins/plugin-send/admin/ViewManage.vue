<script lang="ts" setup>
import type { Card } from '@fiction/site'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'

const { card } = defineProps<{ card: Card }>()
const _hello = 1
</script>

<template>
  <SettingsPanel :card base-path="/campaign" />
</template>
