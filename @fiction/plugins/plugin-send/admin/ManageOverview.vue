<script lang="ts" setup>
import type { ActionButton, NavItem, PostObject } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { EmailCampaign } from '../campaign.js'
import type { FictionSend } from '../index.js'
import type { EmailCampaignConfig } from '../schema.js'
import ElHeader from '@fiction/admin/settings/ElHeader.vue'
import { dayjs, toLabel, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElModal from '@fiction/ui/ElModal.vue'
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

type OptionItem = NavItem & {
  options?: InputOption<any>[]
  optionActions?: ActionButton[]
  isOptional?: boolean
  isActive?: boolean
  progress?: 'ready' | 'incomplete' | 'optional'

}

function getCampaignLink(slug: 'campaigns' | 'manage-campaign' | 'campaign-composer') {
  return card.link(`/${slug}?campaignId=${campaign?.campaignId}`)
}

function _getPanelLink(panel: 'compose' | 'delivery' | 'analytics' | '') {
  return card.link(`/manage-campaign/${panel}?campaignId=${campaign?.campaignId}`)
}

const items = vue.computed<OptionItem[]>(() => {
  const config = campaign?.toConfig() as EmailCampaignConfig
  const post = config.post
  const subscriberCount = config.subscriberCount
  const allContent = [post?.title, post?.subTitle, post?.content].filter(Boolean).join(' ')
  const wordCount = getWordCountFromHTML(allContent)

  const scheduledTime = config?.scheduledAt ? dayjs(config.scheduledAt).format('MMM D, YYYY h:mm A') : ''
  const scheduleDisplay = config?.scheduledAt && config?.scheduleMode !== 'now' ? `Send at ${scheduledTime}` : 'Send Immediately'

  const subs = subscriberCount ? `${subscriberCount} Active Subscribers` : 'No Subscribers'
  const hasSubs = !!(subscriberCount && subscriberCount > 0)

  return [

    {
      key: 'subject',
      icon: 'i-tabler-input-spark',
      title: config?.subject || 'No Subject Line',
      subTitle: 'Subject Line',
      content: 'The subject line of the email',
      progress: config?.subject ? 'ready' : 'incomplete',
      isOptional: false,
      actions: [
        {
          name: 'Update',
          onClick: ({ item }) => (settingsModal.value = item?.key),
          theme: 'theme',
        },
      ],
      options: [
        new InputOption({ key: 'subject', label: 'Subject Line', input: 'InputText', isRequired: true, placeholder: 'Subject Line', description: 'This is the subject line that appears in the recipient\'s inbox.' }),
      ],
    },
    {
      key: 'subjectPreview',
      icon: 'i-tabler-input-search',
      title: config?.preview || 'No Preview Text',
      subTitle: 'Preview Text',
      content: 'The text that appears in the inbox preview of your email',
      progress: config?.preview ? 'ready' : 'incomplete',
      isOptional: true,
      actions: [
        {
          name: 'Update',
          onClick: ({ item }) => (settingsModal.value = item?.key),
          theme: 'theme',
        },
      ],
      options: [
        new InputOption({ key: 'preview', label: 'Preview Text', input: 'InputText', placeholder: 'Preview Text', description: 'This is the text that appears in the inbox preview of your email.' }),
      ],
    },
    {
      key: 'content',
      icon: 'i-tabler-file-description',
      title: `${wordCount} Words in Email`,
      subTitle: 'Email Content',
      content: 'The text of the email',
      progress: wordCount > 5 ? 'ready' : 'incomplete',
      isOptional: false,
      actions: [
        {
          name: 'Compose',
          href: getCampaignLink('campaign-composer'),
          theme: 'theme',
        },
      ],
    },
    {
      icon: 'i-tabler-calendar',
      key: 'schedule',
      title: scheduleDisplay,
      subTitle: 'Schedule Send Time and Date',
      content: 'This is the time and date that the email will be sent',
      progress: config?.scheduleMode === 'now' || config?.scheduledAt ? 'ready' : 'incomplete',
      actions: [{
        name: 'Update',
        onClick: ({ item }) => (settingsModal.value = item?.key),
        theme: 'theme',
      }],
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
    },
    {
      key: 'audience',
      icon: 'i-tabler-users-group',
      title: `${subs}`,
      subTitle: 'Recipients',
      content: 'Emails will be sent to these recipients',
      progress: hasSubs ? 'ready' : 'incomplete',
      isOptional: false,
      actions: [
        {
          name: 'View Subscribers',
          href: card.link(`/audience`),
          theme: 'theme',
        },
      ],
    },
    {
      key: 'from',
      icon: 'i-tabler-mailbox',
      title: `${from.value}`,
      subTitle: 'Sender',
      content: 'The email address that the email will be sent from',
      progress: from.value ? 'ready' : 'incomplete',
      isOptional: false,
      actions: [
        {
          name: 'Organization Settings',
          href: card.link(`/settings/project`),
          theme: 'theme',
        },
      ],
    },

    {
      key: 'preview',
      icon: 'i-tabler-eye-check',
      title: `Preview Email`,
      subTitle: 'View HTML preview',
      content: 'A rendered preview of the email',
      progress: 'optional',
      isOptional: true,
      actions: [
        {
          name: 'Preview',
          onClick: ({ item }) => (settingsModal.value = item?.key),
          theme: 'theme',
        },
      ],
      options: [
        new InputOption({ key: '*', input: InputEmailPreview, props: { modelValue: campaign, card } }),
      ],
      optionActions: [],
    },
    {
      key: 'testEmail',
      icon: 'i-tabler-mail-question',
      title: `Send Test Email`,
      subTitle: 'Send a test email to yourself',
      content: 'View the email as it will appear in target email clients',
      progress: 'optional',
      isOptional: true,
      actions: [
        {
          name: 'Send Test',
          onClick: ({ item }) => (settingsModal.value = item?.key),
          theme: 'theme',
        },
      ],
      options: [
        new InputOption({ key: 'userConfig.testEmails', label: 'Test Emails', input: 'InputText', placeholder: 'email@example.com, email2@test.com', description: 'Enter emails to send the test to... (comma separated)' }),
      ],
      optionActions: [
        {
          name: 'Send Test Email',
          theme: 'primary',
          onClick: async ({ item }) => {
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
    },
  ]
})

const currentItem = vue.computed(() => {
  return settingsModal ? items.value.find(item => item.key === settingsModal.value) : undefined
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
        sub: 'This will send the email you have composed as soon as resources are available.',
      }
    : {
        title: `Schedule send at ${scheduledTime}?`,
        sub: 'This will schedule the email to be sent at the specified time. You will need to cancel the schedule if you want to change settings.',
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
  const incompleteItems = items.value.filter(item => item.progress === 'incomplete')
  const isReady = incompleteItems.length === 0

  const isScheduled = em?.scheduleMode === 'schedule'
  const actionText = isScheduled ? `Schedule Send` : 'Send'

  const statusText = !isReady
    ? `Complete Setup to ${actionText}`
    : `Ready to ${actionText}`

  const out: PostObject = {
    superTitle: 'Status',
    title: statusText,
    subTitle: `Status: ${em?.status}`,
    media: { class: 'i-tabler-mail' },
    actions: [
      {
        size: 'md',
        name: 'Edit Content',
        icon: 'i-tabler-file-description',
        theme: 'primary',
        href: getCampaignLink('campaign-composer'),

      },
      {
        size: 'md',
        design: 'textOnly',
        name: isReady ? 'Ready' : `${items.value.length - incompleteItems.length} / ${items.value.length} Complete`,
        disabled: true,
      },

    ],
  }

  return out
})
</script>

<template>
  <div>
    <div class="">
      <div class="my-6 space-y-6">
        <div class="px-8">
          <ElHeader
            v-if="header"
            class="dark:bg-theme-700/50 rounded-xl p-12"
            :model-value="header"
          />
        </div>
        <div class=" grid grid-cols-1 gap-4 divide-y divide-theme-200 dark:divide-theme-700/70">
          <div
            v-for="(item, i) in items"
            :key="i"
            class="relative flex gap-4 lg:gap-6 px-8 xl:px-16 py-4 lg:py-8"
          >
            <div class="size-7 lg:size-8 rounded-xl flex justify-center items-center ">
              <div class="text-3xl lg:text-5xl" :class="item.icon" />
            </div>
            <div class="grow">
              <div class="mb-1 text-lg lg:text-xl font-semibold  hover:text-theme-300 dark:hover:text-theme-0 cursor-pointer">
                {{ item.title }}
              </div>
              <p class="text-lg lg:text-xl font-normal text-theme-500 dark:text-theme-400">
                {{ item?.subTitle }}
              </p>
              <div class="text-base mt-4 flex items-center gap-4">
                <XButton
                  design="ghost"
                  :icon="item.progress === 'ready' ? 'i-tabler-check' : item.progress === 'incomplete' ? 'i-tabler-x' : 'i-tabler-circle-plus'"
                  :theme="item.progress === 'ready' ? 'green' : item.progress === 'incomplete' ? 'rose' : 'theme'"
                  size="md"
                >
                  {{ toLabel(item.progress) }}
                </XButton>
                <span class="text-sm  text-theme-500/60 dark:text-theme-400/60">{{ item.content }}</span>
              </div>
            </div>
            <div class="space-x-3">
              <XButton
                v-for="(action, ii) in (item.actions || [])"
                :key="ii"
                design="solid"
                :theme="action.theme || 'theme'"
                size="lg"
                :loading="action.loading"
                :href="action.href"
                @click.stop="action.onClick ? (action.onClick({ item, event: $event })) : ''"
              >
                {{ action.name }}
              </XButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ElModal :vis="!!settingsModal" modal-class="max-w-screen-md p-12 " @update:vis="$event ? '' : (settingsModal = '')">
      <div v-if="currentItem">
        <div class="mb-6 space-y-1 border-b border-theme-200 dark:border-theme-700 pb-4">
          <div class="text-xl font-medium">
            {{ currentItem.title }}
          </div>
          <div class="text-base text-theme-500 dark:text-theme-400">
            {{ currentItem.subTitle }}
          </div>
        </div>
        <FormEngine
          :model-value="campaign?.toConfig()"
          state-key="settingsTool"
          input-wrap-class="w-full"
          ui-size="lg"
          :options="currentItem.options || []"
          :card
          :disable-group-hide="true"
          :data-value="JSON.stringify(campaign?.toConfig())"
          @update:model-value="campaign?.update($event)"
        />
        <div class="flex justify-between border-t border-theme-200/70 dark:border-theme-700/70 pt-4 mt-8">
          <div>
            <XButton size="lg" theme="default" @click="settingsModal = ''">
              Cancel
            </XButton>
          </div>
          <div class="gap-4 flex">
            <template v-if="currentItem.optionActions">
              <XButton
                v-for="(action, ii) in (currentItem.optionActions || [])"
                :key="ii"
                design="solid"
                :theme="action.theme || 'theme'"
                :loading="action.loading"

                size="lg"
                :href="action.href"
                @click.stop="action.onClick ? (action.onClick({ item: currentItem, event: $event })) : ''"
              >
                {{ action.name }}
              </XButton>
            </template>
            <XButton v-else size="lg" theme="primary" :loading="saving" @click="saveChanges()">
              Apply Changes
            </XButton>
          </div>
        </div>
      </div>
    </ElModal>
    <ElModalConfirm
      v-model:vis="showSendModal"
      v-bind="modalText"
      @confirmed="sendOrSchedule()"
    />
  </div>
</template>
