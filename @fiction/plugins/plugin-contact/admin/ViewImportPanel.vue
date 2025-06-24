<script lang="ts" setup>
import type { Card } from '@fiction/site'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'
import ElAddContacts from './ElAddContacts.vue'

defineProps<{
  card: Card
}>()
</script>

<template>
  <SettingsPanel
    title="Import Contacts"
  >
    <div class="p-4 md:p-6 xl:p-12 max-w-screen-md mx-auto">
      <ElAddContacts :card />
    </div>
  </SettingsPanel>
</template>
