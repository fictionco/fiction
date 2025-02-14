<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { Card } from '@fiction/site'
import type { EmailCampaign } from '../campaign.js'
import type { EmailCampaignConfig } from '../schema.js'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { vue } from '@fiction/core'

import { InputOption } from '@fiction/ui/index.js'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import InputEmailPreview from './InputEmailPreview.vue'

const { tool, campaign, card } = defineProps<{
  tool: EditorTool
  campaign?: EmailCampaign | undefined
  card: Card
}>()

const options = vue.computed<InputOption[]>(() => {
  return [
    new InputOption({ key: '*', input: InputEmailPreview, props: { modelValue: campaign, card } }),
  ]
})

function updatePost(config: Partial<EmailCampaignConfig>) {
  campaign?.update(config)
}
</script>

<template>
  <ElTool :tool>
    <ElForm v-if="campaign" id="toolForm">
      <FormEngine
        state-key="emailPreview"
        :model-value="campaign.toConfig()"
        :options
        :input-props="{ campaign, card }"
        @update:model-value="updatePost($event as Partial<EmailCampaignConfig>)"
      />
    </ElForm>
  </ElTool>
</template>
