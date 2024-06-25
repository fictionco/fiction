<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import ToolForm from '@fiction/admin/tools/ToolForm.vue'
import type { EditorTool } from '@fiction/admin'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import type { Card } from '@fiction/site'

import { InputOption } from '@fiction/ui/index.js'
import { standardOption } from '@fiction/cards/inputSets.js'
import { refineOptions } from '@fiction/site/utils/schema'
import type { EmailCampaign } from '../campaign.js'
import type { FictionSend } from '../index.js'
import type { EmailCampaignConfig } from '../schema.js'
import { sendTable } from '../schema.js'

const props = defineProps({
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  email: { type: Object as vue.PropType<EmailCampaign>, default: undefined },
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { fictionSend } = useService<{ fictionSend: FictionSend }>()

const options = vue.computed(() => {
  const refinedOptions = refineOptions({
    options: [standardOption.actionItems({ key: 'userConfig.actions', label: 'Action Buttons' })],
    schema: sendTable.tableSchema(),
  })

  return [
    new InputOption({
      key: 'emailContent',
      label: 'Email Content',
      input: 'group',
      options: [

        new InputOption({
          key: 'post.title',
          label: 'Title',
          input: 'InputText',
          placeholder: 'Title',
          isRequired: true,
        }),
        new InputOption({ key: 'post.subTitle', label: 'Subtitle', input: 'InputText' }),
        ...refinedOptions.options,
      ],
    }),
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
