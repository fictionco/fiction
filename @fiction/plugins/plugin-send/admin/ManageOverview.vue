<script lang="ts" setup>
import type { ActionButton, NavItem, PostObject } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { EmailCampaign } from '../campaign.js'
import type { FictionSend } from '../index.js'
import type { EmailCampaignConfig } from '../schema.js'
import ElHeader from '@fiction/admin/settings/ElHeader.vue'
import { dayjs, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import ElModalConfirm from '@fiction/ui/ElModalConfirm.vue'
import { InputOption } from '@fiction/ui/index.js'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'

const { card, campaign } = defineProps<{ card: Card, campaign?: EmailCampaign }>()

const { fictionUser } = useService<{ fictionSend: FictionSend }>()

const showSendModal = vue.ref(false)
const settingsModal = vue.ref('')
const saving = vue.ref(false)

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

type OptionItem = NavItem & { options?: InputOption<any>[], isOptional?: boolean, isActive?: boolean }

function getCampaignLink(slug: 'campaigns' | 'manage-campaign' | 'campaign-composer') {
  return card.link(`/${slug}?campaignId=${campaign?.campaignId}`)
}

function getPanelLink(panel: 'compose' | 'delivery' | 'analytics' | '') {
  return card.link(`/manage-campaign/${panel}?campaignId=${campaign?.campaignId}`)
}

const items = vue.computed<OptionItem[]>(() => {
  const config = campaign?.toConfig() as EmailCampaignConfig
  const post = config.post
  const subscriberCount = config.subscriberCount
  const allContent = [post?.title, post?.subTitle, post?.content].filter(Boolean).join(' ')
  const wordCount = getWordCountFromHTML(allContent)
  const settings = card.link(`/manage-campaign/settings?campaignId=${config?.campaignId}`)
  const editLink = card.link(`/email-edit?campaignId=${config?.campaignId}`)
  const pub = card.link(`/settings/project`)
  const hasSubject = !!config?.subject
  const hasTitle = !!post?.title
  const hasContent = !!post?.content

  const scheduleDisplay = config?.scheduledAt && config?.scheduleMode !== 'now' ? 'Scheduled' : 'Send Immediately'

  const subs = subscriberCount ? `${subscriberCount} Active Subscribers` : 'No Subscribers'
  const hasSubs = !!(subscriberCount && subscriberCount > 0)

  return [

    {
      key: 'subject',
      icon: 'i-tabler-input-spark',
      title: config?.subject || 'No Subject Line',
      subTitle: 'Subject Line',
      content: 'The subject line of the email',
      progress: config?.subject ? 'ready' : 'pending',
      isOptional: false,
      isActive: hasSubject,
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
      progress: config?.subject ? 'ready' : 'pending',
      isOptional: true,
      isActive: !!config?.preview,
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
      progress: 'pending',
      isOptional: false,
      isActive: hasContent,
      actions: [
        {
          name: 'Compose',
          href: getCampaignLink('campaign-composer'),
          theme: 'theme',
        },
      ],
    },
    {
      key: 'audience',
      icon: 'i-tabler-users-group',
      title: `${subs}`,
      subTitle: 'Recipients',
      content: 'Emails will be sent to these recipients',
      progress: 'pending',
      isOptional: false,
      isActive: hasSubs,
      actions: [
        {
          name: 'View Subscribers',
          href: getPanelLink('compose'),
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
      progress: 'pending',
      isOptional: false,
      isActive: !!from.value,
      actions: [
        {
          name: 'Update',
          href: getPanelLink('compose'),
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
      progress: 'ready',
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
      key: 'test',
      icon: 'i-tabler-eye-check',
      title: `Test Sent`,
      subTitle: 'Preview and Test',
      content: 'View preview and send test email',
      isOptional: true,
      isActive: !!from.value,
      actions: [
        {
          name: 'Preview / Test',
          href: getPanelLink('compose'),
          theme: 'theme',
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

const readyAction = vue.computed<ActionButton>(() => {
  const em = campaign?.toConfig() as EmailCampaignConfig

  const isReady = items.value.every(item => item.isActive)
  const scheduledTime = em?.scheduledAt ? dayjs(em.scheduledAt).format('MMM D, YYYY h:mm A') : ''
  const readyText = em?.scheduleMode === 'now' ? 'Send Now...' : `Schedule (${scheduledTime})...`

  let out: ActionButton = {}
  if (em?.status === 'pending' && isReady)
    out = { name: readyText, theme: 'primary', onClick: () => { showSendModal.value = true } }
  else if (em?.status === 'pending')
    out = { name: 'Complete Set Up to Send', theme: 'default', disabled: true }
  else
    out = { name: em?.status, theme: 'default' }

  return { size: 'lg', ...out }
})

const allActions = vue.computed<ActionButton[]>(() => {
  const propActions: ActionButton[] = []
  return [
    readyAction.value,
    ...propActions,
  ]
})

const modalText = vue.computed(() => {
  const em = campaign
  const scheduledTime = em?.scheduledAt.value ? dayjs(em.scheduledAt.value).format('MMM D, YYYY h:mm A') : ''
  return sendNow.value
    ? {
        title: `Send email now?`,
        sub: 'This will send the email you have composed as soon as resources are available.',
      }
    : {
        title: `Schedule email for ${scheduledTime}?`,
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
  const activeItems = items.value.filter(item => item.isActive)
  const isReady = activeItems.length === items.value.length
  const percentComplete = Math.round((activeItems.length / items.value.length) * 100)

  const scheduledTime = em?.scheduledAt
    ? dayjs(em.scheduledAt).format('MMM D, YYYY h:mm A')
    : ''

  const isScheduled = em?.scheduleMode === 'schedule'
  const actionText = isScheduled ? `Schedule (${scheduledTime})` : 'Send Now'

  const statusText = em?.status === 'pending' && !isReady
    ? `Complete Setup to ${actionText}`
    : `Ready to ${actionText}`

  const publishButton: ActionButton = {
    name: em?.status === 'pending' && isReady
      ? `${actionText}...`
      : em?.status === 'pending'
        ? `${percentComplete}% Complete`
        : em?.status,
    theme: em?.status === 'pending' && isReady ? 'primary' : 'default',
    disabled: em?.status === 'pending' && !isReady,
    onClick: em?.status === 'pending' && isReady
      ? () => { showSendModal.value = true }
      : undefined,
  }

  const out: PostObject = {
    superTitle: 'Status',
    title: statusText,
    subTitle: `Email campaign status: ${em?.status}`,
    media: { class: 'i-tabler-mail' },
    actions: [{ size: 'lg', ...publishButton }],
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
                  :icon="item.progress === 'ready' ? 'i-tabler-check' : 'i-tabler-x'"
                  :theme="item.progress === 'ready' ? 'green' : 'rose'"
                  size="md"
                >
                  {{ item.progress === 'ready' ? 'Ready' : 'Incomplete' }}
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
          input-wrap-class="max-w-lg w-full"
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
          <div>
            <XButton size="lg" theme="primary" :loading="saving" @click="saveChanges()">
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
