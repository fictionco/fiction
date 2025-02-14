<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { Card } from '@fiction/site'
import type { InputOption } from '@fiction/ui/index.js'
import type { EmailCampaign } from '../campaign.js'
import type { EmailCampaignConfig } from '../schema.js'

import ElTool from '@fiction/admin/tools/ElTool.vue'
import { vue } from '@fiction/core'
import { createOption } from '@fiction/ui/index.js'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'

const { tool, campaign, card } = defineProps<{
  tool: EditorTool
  campaign?: EmailCampaign | undefined
  card: Card
}>()

const options = vue.computed<InputOption[]>(() => {
  return [
    createOption({
      key: 'root.email',
      label: 'Email Campaign',
      input: 'group',
      icon: { class: 'i-tabler-mail' },
      options: [
        createOption({
          key: 'group.inbox',
          label: 'Subject Line',
          input: 'group',
          icon: { class: 'i-tabler-inbox' },
          options: [
            createOption({ key: 'subject', label: 'Subject', input: 'InputText', placeholder: 'Enter Subject', isRequired: true }),
            createOption({ key: 'preview', label: 'Preview Text', input: 'InputText', placeholder: 'Enter Preview Text' }),

          ],
        }),
        createOption({
          key: 'group.inbox',
          label: 'Sending Emails',
          input: 'group',
          icon: { class: 'i-tabler-inbox' },
          options: [
            createOption({
              key: 'fromName',
              label: 'From Name',
              subLabel: 'The name that will appear in the inbox',
              input: 'InputText',
              placeholder: 'Enter Name',
              isRequired: true,
            }),
            createOption({
              key: 'fromEmail',
              label: 'From Email',
              subLabel: 'The "sent from" email address',
              input: 'InputText',
              placeholder: 'hello@mysite.com',
              isRequired: true,
            }),
            createOption({
              key: 'replyTo',
              label: 'Reply To',
              subLabel: 'Where replies will be sent',
              input: 'InputText',
              placeholder: 'noreply@example.com',
            }),
          ],
        }),
        createOption({
          key: 'emailDelivery',
          label: 'Send Time',
          input: 'group',
          icon: { class: 'i-tabler-clock' },
          options: [
            createOption({
              key: 'scheduleMode',
              label: 'Sending Time',
              input: 'InputSelectCustom',
              isRequired: true,
              list: [
                { label: 'Send on Publish', value: 'now' },
                { label: 'Send at Scheduled Time', value: 'schedule' },
              ],
            }),
            createOption({ key: 'scheduledAt', label: 'Scheduled Send Time', input: 'InputDate', isRequired: true, isHidden: campaign?.scheduleMode.value !== 'schedule', props: { includeTime: true, dateMode: 'future' } }),
          ],
        }),
        createOption({
          key: 'emailContent',
          label: 'Email Content',
          input: 'group',
          icon: { class: 'i-tabler-highlight' },
          options: [
            createOption({ key: 'post.title', label: 'Title', input: 'InputText', placeholder: 'Enter title', isRequired: true }),
            createOption({ key: 'post.subTitle', label: 'Subtitle', input: 'InputText', placeholder: 'Enter sub title' }),
            createOption({
              key: 'userConfig.actions',
              label: 'Calls to Action',
              input: 'InputList',
              options: [
                createOption({
                  key: 'userConfig.actions.0.label',
                  label: 'Button Text',
                  input: 'InputText',
                  props: { placeholder: 'Enter button text' },

                }),
                createOption({
                  key: 'userConfig.actions.0.href',
                  label: 'Link',
                  input: 'InputUrl',
                  props: { placeholder: 'Enter URL or path' },
                }),
                createOption({
                  key: 'userConfig.actions.0.theme',
                  label: 'Color Theme',
                  input: 'InputSelectCustom',
                  list: ['primary', 'default', 'naked'],
                }),
              ],
            }),
          ],
        }),
      ],
    }),

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
        :model-value="campaign?.toConfig()"
        :options
        :input-props="{ campaign, card }"
        @update:model-value="updatePost($event as Partial<EmailCampaignConfig>)"
      />
    </ElForm>
  </ElTool>
</template>
