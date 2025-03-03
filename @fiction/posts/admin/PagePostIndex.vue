<script lang="ts" setup>
import type { Card } from '@fiction/site'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'
import ElPostIndex from './ElPostIndex.vue'

const { card } = defineProps<{ card: Card }>()
</script>

<template>
  <SettingsPanel :title="card.title.value">
    <div class="p-4 md:p-6 xl:p-12">
      <ElPostIndex :card />
    </div>
  </SettingsPanel>
</template>
