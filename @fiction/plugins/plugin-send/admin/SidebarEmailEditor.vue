<script lang="ts" setup>
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { standardOption } from '@fiction/cards/inputSets.js'
import { vue } from '@fiction/core'
import { refineOptions } from '@fiction/site/utils/schema'
import { InputOption } from '@fiction/ui/index.js'
import ElForm from '@fiction/ui/inputs/ElForm.vue'

import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import type { EditorTool } from '@fiction/admin'
import type { Card } from '@fiction/site'
import { sendTable } from '../schema.js'
import type { EmailCampaign } from '../campaign.js'
import type { EmailCampaignConfig } from '../schema.js'

const props = defineProps({
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  email: { type: Object as vue.PropType<EmailCampaign>, default: undefined },
  card: { type: Object as vue.PropType<Card>, required: true },
})

const options = vue.computed<InputOption[]>(() => {
  const refinedOptions = refineOptions({
    options: [standardOption.buttons({ key: 'userConfig.actions', label: 'Action Buttons' })],
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
      <FormEngine
        :model-value="email.toConfig()"
        :options
        :input-props="{ email, card }"
        @update:model-value="updatePost($event as Partial<EmailCampaignConfig>)"
      />
    </ElForm>
  </ElTool>
</template>
