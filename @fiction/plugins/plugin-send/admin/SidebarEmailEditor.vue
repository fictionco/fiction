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

const { tool, campaign, card } = defineProps<{
  tool: EditorTool
  campaign?: EmailCampaign | undefined
  card: Card
}>()

const options = vue.computed<InputOption<any>[]>(() => {
  return [

    new InputOption({
      key: 'emailContent',
      label: 'Email Content',
      input: 'group',
      options: [
        new InputOption({ key: 'post.title', label: 'Title', input: 'InputText', placeholder: 'Title', isRequired: true }),
        new InputOption({ key: 'post.subTitle', label: 'Subtitle', input: 'InputText' }),
        new InputOption({ key: 'userConfig.actions', label: 'Calls to Action', input: 'InputActions', props: {
          addOptions: [
            new InputOption({ key: 'theme', label: 'Color Theme', input: 'InputSelectCustom', list: ['primary', 'default', 'naked'] }),
          ],
          disableKeys: ['design', 'icon', 'iconAfter', 'target', 'theme', 'size'],
        } }),
      ],
    }),

  ]
})

function updatePost(config: Partial<EmailCampaignConfig>) {
  campaign?.update(config)
}
</script>

<template>
  <ElTool :tool="tool">
    <ElForm v-if="campaign" id="toolForm">
      <FormEngine
        state-key="emailPreview"
        :model-value="campaign?.toConfig()"
        :options
        :input-props="{ campaign, card }"
        @update:model-value="updatePost($event as Partial<EmailCampaignConfig>)"
      />
    </ElForm>
  </ElTool>
</template>
