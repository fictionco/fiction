<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { Card } from '@fiction/site'
import type { EmailCampaign } from '../campaign.js'
import type { FictionNewsletter } from '../index.js'
import type { EmailCampaignConfig } from '../schema.js'

import ElTool from '@fiction/admin/tools/ElTool.vue'
import { useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import { InputOption } from '@fiction/ui/index.js'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'

const { tool, campaign, card } = defineProps<{
  tool: EditorTool
  campaign?: EmailCampaign | undefined
  card: Card
}>()

const service = useService<{ fictionNewsletter: FictionNewsletter }>()

const options = vue.computed<InputOption[]>(() => {
  return [
    new InputOption({
      key: 'emailTestSend',
      label: 'Send Test Email',
      input: 'group',
      options: [
        new InputOption({
          key: 'userConfig.testEmails',
          label: 'Test Emails',
          input: 'InputText',
          placeholder: 'e1@test.com, e2@test.com',
          description: 'Enter emails to send the test to... (comma separated)',
          isRequired: true,
        }),
      ],
    }),

  ]
})

function updatePost(config: Partial<EmailCampaignConfig>) {
  campaign?.update(config)
}

const loading = vue.ref('')
async function sendTest() {
  const em = campaign
  const testEmails = em?.userConfig.value.testEmails

  if (testEmails && em.campaignId) {
    loading.value = 'testEmail'

    await service.fictionNewsletter.requests.ManageCampaign.projectRequest({
      _action: 'sendTest',
      testEmails,
      where: { campaignId: em.campaignId },
    })
  }

  loading.value = ''
}
</script>

<template>
  <ElTool :tool>
    <ElForm v-if="campaign" @submit="sendTest()">
      <FormEngine
        state-key="emailPreview"
        :model-value="campaign?.toConfig()"
        :options
        :input-props="{ campaign, card }"
        @update:model-value="updatePost($event as Partial<EmailCampaignConfig>)"
      />
      <div class="px-4 flex justify-end">
        <XButton
          type="submit"
          theme="primary"
          rounding="md"
          :loading="!!loading"
        >
          Send
        </XButton>
      </div>
    </ElForm>
  </ElTool>
</template>
