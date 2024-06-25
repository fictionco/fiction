<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import ToolForm from '@fiction/admin/tools/ToolForm.vue'
import type { EditorTool } from '@fiction/admin'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import type { Card } from '@fiction/site'

import { InputOption } from '@fiction/ui/index.js'
import type { EmailCampaign } from '../campaign.js'
import type { EmailCampaignConfig } from '../schema.js'
import InputEmailPreview from './InputEmailPreview.vue'

const props = defineProps({
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  email: { type: Object as vue.PropType<EmailCampaign>, default: undefined },
  card: { type: Object as vue.PropType<Card>, required: true },
})

const options = vue.computed(() => {
  return [
    new InputOption({ key: '*', label: 'Email Preview', input: InputEmailPreview }),
  ]
})

function updatePost(config: Partial<EmailCampaignConfig>) {
  props.email?.update(config)
}
</script>

<template>
  <ElTool :tool="tool">
    <ElForm v-if="email" id="toolForm">
      <ToolForm
        :model-value="email.toConfig()"
        :options="options"
        :input-props="{ email, card }"
        @update:model-value="updatePost($event as Partial<EmailCampaignConfig>)"
      />
    </ElForm>
  </ElTool>
</template>
