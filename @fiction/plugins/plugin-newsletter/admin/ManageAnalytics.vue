<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { EmailCampaign } from '../campaign'
import InputEmailPreview from './InputEmailPreview.vue'

const { card, campaign } = defineProps<{ card: Card, campaign?: EmailCampaign }>()
</script>

<template>
  <div class="p-12 text-center text-sm text-theme-400 dark:text-theme-500">
    Newsletter Analytics Coming Soon
  </div>
</template>
