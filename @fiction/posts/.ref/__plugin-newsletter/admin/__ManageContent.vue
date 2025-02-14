<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FictionNewsletter } from '..'
import type { EmailCampaign } from '../campaign'
import { useService, vue } from '@fiction/core'
import ElPostEditor from '@fiction/posts/admin/ElPostEditor.vue'
import { getEmailManageOptions } from './tools'

const { card, campaign } = defineProps<{ card: Card, campaign?: EmailCampaign }>()

const { fictionNewsletter } = useService<{ fictionNewsletter: FictionNewsletter }>()

const options = vue.computed(() => {
  return getEmailManageOptions({ card, campaign, fictionNewsletter })
})
</script>

<template>
  <div>
    <!-- <FormEngine
      :model-value="campaign?.toConfig()"
      state-key="settingsTool"
      input-wrap-class="max-w-lg w-full"
      ui-size="lg"
      :options
      :card
      :disable-group-hide="true"
      :data-value="JSON.stringify(campaign?.toConfig())"
      @update:model-value="campaign?.update($event)"
    /> -->
    <ElPostEditor :card :post="campaign?.post.value" />
  </div>
</template>
