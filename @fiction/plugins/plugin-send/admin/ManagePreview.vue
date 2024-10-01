<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { EmailCampaign } from '../campaign'
import SettingsContentWrap from '@fiction/admin/settings/SettingsContentWrap.vue'
import InputEmailPreview from './InputEmailPreview.vue'

const { card, campaign } = defineProps<{ card: Card, campaign?: EmailCampaign }>()
</script>

<template>
  <div class="p-12">
    <InputEmailPreview :card :model-value="campaign?.toConfig()" />
  </div>
</template>
