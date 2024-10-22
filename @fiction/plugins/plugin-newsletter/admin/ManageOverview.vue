<script lang="ts" setup>
import type { ActionButton, PostObject } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { EmailCampaign } from '../campaign.js'
import type { FictionSend } from '../index.js'
import type { EmailCampaignConfig } from '../schema.js'
import ElHeader from '@fiction/admin/settings/ElHeader.vue'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'
import { dayjs, useService, vue } from '@fiction/core'
import ElModalConfirm from '@fiction/ui/ElModalConfirm.vue'
import { InputOption } from '@fiction/ui/index.js'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import InputEmailPreview from './InputEmailPreview.vue'

const { card, campaign } = defineProps<{ card: Card, campaign?: EmailCampaign }>()

const { fictionUser, fictionSend } = useService<{ fictionSend: FictionSend }>()

const showSendModal = vue.ref(false)
const settingsModal = vue.ref('')
const saving = vue.ref(false)
const loading = vue.ref('')

const from = vue.computed(() => {
  const org = fictionUser.activeOrganization.value

  if (!org?.orgEmail) {
    return
  }
  return `${org?.orgName || org?.orgEmail} <${org?.orgEmail}>`
})

function getWordCountFromHTML(html?: string) {
  if (!html)
    return 0
  const h = html.replace(/<[^>]*>?/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = h.split(' ').length

  return wordCount
}

function getCampaignLink(slug: 'campaigns' | 'manage-campaign' | 'campaign-composer') {
  return card.link(`/${slug}?campaignId=${campaign?.campaignId}`)
}

function _getPanelLink(panel: 'compose' | 'delivery' | 'analytics' | '') {
  return card.link(`/manage-campaign/${panel}?campaignId=${campaign?.campaignId}`)
}

const options = vue.computed(() => {
  const config = campaign?.toConfig() as EmailCampaignConfig
  const post = config.post
  const subscriberCount = config.subscriberCount
  const allContent = [post?.title, post?.subTitle, post?.content].filter(Boolean).join(' ')
  const wordCount = getWordCountFromHTML(allContent)

  const scheduledTime = config?.scheduledAt ? dayjs(config.scheduledAt).format('MMM D, YYYY h:mm A') : ''

  const subs = subscriberCount ? `${subscriberCount} Active Subscribers` : 'No Subscribers'
  const hasSubs = !!(subscriberCount && subscriberCount > 0)

  return [

    new InputOption({
      key: 'campaignDetails',
      label: 'Content and Delivery Details',
      input: 'group',
      options: [
        new InputOption({
          icon: { class: 'i-tabler-input-spark' },
          label: 'Subject Line',
          subLabel: 'What the user sees in their inbox',
          input: 'InputControl',
          valueDisplay: () => {
            return {
              status: config?.subject ? 'ready' : 'incomplete',
              data: config?.subject,
            }
          },
          options: [
            new InputOption({ key: 'subject', label: 'Subject Line', input: 'InputText', isRequired: true, placeholder: 'Subject Line', description: 'This is the subject line that appears in the recipient\'s inbox.' }),
          ],
        }),
        new InputOption({
          icon: { class: 'i-tabler-input-search' },
          label: 'Preview Text',
          subLabel: 'What the user sees in their inbox',
          input: 'InputControl',
          valueDisplay: () => {
            return {
              status: config?.preview ? 'ready' : 'incomplete',
              data: config?.preview,
            }
          },
          options: [
            new InputOption({ key: 'preview', label: 'Preview Text', input: 'InputText', placeholder: 'Preview Text', description: 'This is the text that appears in the inbox preview of your email.' }),
          ],
        }),
        new InputOption({
          icon: { class: 'i-tabler-file-description' },
          label: 'Email Content',
          subLabel: 'The text of the email',
          input: 'InputControl',
          valueDisplay: () => {
            return {
              status: wordCount > 5 ? 'ready' : 'incomplete',
              data: `${wordCount} Words in Email`,
            }
          },
          actions: () => [
            {
              name: 'Email Composer',
              href: getCampaignLink('campaign-composer'),
              theme: 'theme',
              icon: { class: 'i-tabler-edit' },
            },
          ],
        }),
        new InputOption({
          icon: { class: 'i-tabler-calendar' },
          label: 'Schedule Send Time and Date',
          subLabel: 'When the email will be sent',
          input: 'InputControl',
          valueDisplay: () => {
            return {
              status: config?.scheduleMode === 'now' || config?.scheduledAt ? 'ready' : 'incomplete',
              data: config?.scheduleMode === 'now' || config?.scheduledAt ? `Send at ${scheduledTime}` : 'Send Immediately',
            }
          },
          options: [
            new InputOption({
              key: 'scheduleMode',
              label: 'Sending Time',
              input: 'InputSelectCustom',
              isRequired: true,
              list: [
                { name: 'Send Immediately', value: 'now' },
                { name: 'Schedule Send', value: 'schedule' },
              ],
            }),
            new InputOption({
              key: 'scheduledAt',
              label: 'Scheduled Send Time',
              input: 'InputDate',
              isRequired: true,
              isHidden: campaign?.scheduleMode.value !== 'schedule',
              props: { includeTime: true, dateMode: 'future' },
            }),
          ],
        }),
        new InputOption({
          icon: { class: 'i-tabler-users-group' },
          label: 'Recipients',
          subLabel: 'Who will receive the email',
          input: 'InputControl',
          valueDisplay: () => {
            return {
              status: hasSubs ? 'ready' : 'incomplete',
              data: subs,
            }
          },
          actions: () => [
            {
              name: 'View Subscribers',
              href: card.link(`/audience`),
              theme: 'theme',
              icon: { class: 'i-tabler-arrow-up-right' },
            },
          ],
        }),
        new InputOption({
          icon: { class: 'i-tabler-mailbox' },
          label: 'Sender',
          subLabel: 'Who the email will be sent from',
          input: 'InputControl',
          valueDisplay: () => {
            return {
              status: from.value ? 'ready' : 'incomplete',
              data: from.value,
            }
          },
          actions: () => [
            {
              name: 'View Settings',
              href: card.link(`/settings/project`),
              theme: 'theme',
              icon: { class: 'i-tabler-arrow-up-right' },
            },
          ],
        }),
        new InputOption({
          icon: { class: 'i-tabler-eye-check' },
          label: 'Preview Email',
          subLabel: 'View the email as it will appear',
          input: 'InputControl',
          actions: ({ input }) => [
            {
              name: 'Preview',
              onClick: () => input.isModalOpen.value = true,
              theme: 'theme',
              icon: { class: 'i-tabler-eye' },
            },
          ],
          options: [
            new InputOption({ key: '*', input: InputEmailPreview, props: { modelValue: campaign, card } }),
          ],
        }),
        new InputOption({
          icon: { class: 'i-tabler-mail-question' },
          label: 'Send Test Email',
          subLabel: 'Send a test email to yourself',
          input: 'InputControl',
          actions: ({ input }) => [
            {
              name: 'Send Test',
              onClick: () => input.isModalOpen.value = true,
              theme: 'theme',
              icon: { class: 'i-tabler-test-pipe' },
            },
          ],
          options: [
            new InputOption({ key: 'userConfig.testEmails', label: 'Test Emails', input: 'InputText', placeholder: '', description: 'Enter emails to send the test to... (comma separated)' }),
          ],
          modalActions: () => [
            {
              name: 'Send Test Email',
              theme: 'primary',
              onClick: async () => {
                const em = campaign

                const testEmails = em?.userConfig.value.testEmails

                if (!testEmails)
                  return

                loading.value = 'testEmail'

                await fictionSend.requests.ManageCampaign.projectRequest({
                  _action: 'sendTest',
                  testEmails,
                  where: { campaignId: em.campaignId },
                })

                loading.value = ''

                settingsModal.value = ''
              },
              loading: loading.value === 'testEmail',
            },
          ],
        }),
      ],
      format: 'control',
    }),
    new InputOption({
      key: 'campaignDanger',
      label: 'Danger Zone',
      input: 'group',
      options: [
        new InputOption({
          key: 'deleteCampaign',
          label: 'Permanently Delete Campaign',
          subLabel: 'This action cannot be undone',
          input: 'InputControl',

          actions: () => [
            {
              name: 'Delete This Campaign...',
              theme: 'rose',
              design: 'ghost',
              icon: 'i-tabler-trash',
              loading: loading.value === 'delete',
              onClick: async () => {
                const endpoint = fictionSend.requests.ManageCampaign

                const confirmed = confirm('Are you sure you want to delete this forever?')

                if (confirmed && campaign?.campaignId) {
                  loading.value = 'delete'
                  await endpoint.projectRequest({ _action: 'delete', where: [{ campaignId: campaign?.campaignId }] })
                  await card.goto('/campaigns', { caller: 'deleteCampaign' })
                  loading.value = ''
                }
              },
            },
          ],
        }),
      ],
      format: 'control',
    }),
  ]
})

const sendNow = vue.computed(() => {
  const em = campaign
  return em?.scheduleMode.value === 'now' || !em?.scheduledAt || dayjs(em.scheduledAt.value).isBefore(dayjs())
})

const modalText = vue.computed(() => {
  const em = campaign
  const scheduledTime = em?.scheduledAt.value ? dayjs(em.scheduledAt.value).format('MMM D, YYYY h:mm A') : ''
  return sendNow.value
    ? {
        title: `Send campaign now?`,
        sub: 'This will send the newsletter as soon as resources are available. No further changes can be made.',
      }
    : {
        title: `Schedule send at ${scheduledTime}?`,
        sub: 'This will schedule the email to be sent at the specified time. You will need to cancel it if you want to make edits.',
      }
})

async function sendOrSchedule() {
  const _em = campaign
  // if (sendNow.value)
  //   await service.fictionSend.sendEmailNow(em?.campaignId)
  // else
  //   await service.fictionSend.scheduleEmail(em?.campaignId)
  showSendModal.value = false
}

async function saveChanges() {
  saving.value = true

  campaign?.save()

  settingsModal.value = ''
  saving.value = false
}

const header = vue.computed(() => {
  const em = campaign?.toConfig() as EmailCampaignConfig
  const incompleteItems = options.value.filter(opt => opt.valueDisplay.value?.status === 'incomplete')
  const isReady = incompleteItems.length === 0

  const isScheduled = em?.scheduleMode === 'schedule'
  const actionText = isScheduled ? `Schedule Send` : 'Send'

  const statusText = !isReady
    ? `Edits Required`
    : `Ready to ${actionText}`

  const actions = [
    {
      size: 'md',
      name: 'Email Composer',
      icon: 'i-tabler-edit',
      theme: !isReady ? 'primary' : 'theme',
      href: getCampaignLink('campaign-composer'),

    },

  ] as ActionButton[]

  if (!isReady) {
    actions.push({
      size: 'md',
      design: 'textOnly',
      name: isReady ? 'Ready' : `${options.value.length - incompleteItems.length} / ${options.value.length} Complete`,
      disabled: true,
    })
  }
  else {
    actions.unshift({
      size: 'md',
      name: isScheduled ? 'Schedule Send' : 'Send Now',
      icon: 'i-tabler-send',
      theme: 'primary',
      onClick: () => {
        showSendModal.value = true
      },
    })
  }

  const out: PostObject = {
    superTitle: 'Status',
    title: statusText,
    subTitle: `Status: ${em?.status}`,
    media: { class: 'i-tabler-mail' },
    actions,
  }

  return out
})
</script>

<template>
  <SettingsPanel title="Newletter Email Overview">
    <div class="">
      <div class="my-6 space-y-6">
        <div class="px-8">
          <ElHeader
            v-if="header"
            class="dark:bg-theme-700/50 rounded-xl p-8"
            :model-value="header"
          />
        </div>
        <FormEngine
          :model-value="campaign?.toConfig()"
          state-key="settingsTool"
          ui-size="lg"
          :options
          :card
          format="control"
          @update:model-value="campaign?.update($event)"
        />
      </div>
    </div>

    <ElModalConfirm
      v-model:vis="showSendModal"
      v-bind="modalText"
      @confirmed="sendOrSchedule()"
    />
  </SettingsPanel>
</template>
