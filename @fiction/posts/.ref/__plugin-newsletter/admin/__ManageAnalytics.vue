<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { EmailCampaign } from '../campaign'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'

const { card, campaign } = defineProps<{ card: Card, campaign?: EmailCampaign }>()
</script>

<template>
  <SettingsPanel title="Newsletter Analytics">
    <div class="p-12 text-center text-sm text-theme-400 dark:text-theme-500">
      Newsletter Analytics Coming Soon
    </div>
  </SettingsPanel>
</template>
