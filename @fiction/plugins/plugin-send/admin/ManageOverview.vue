<script lang="ts" setup>
import type { ActionButton, NavItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { EmailCampaign } from '../campaign.js'
import type { FictionSend } from '../index.js'
import type { EmailCampaignConfig } from '../schema.js'
import { dayjs, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import ElModalConfirm from '@fiction/ui/ElModalConfirm.vue'
import { InputOption } from '@fiction/ui/index.js'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import InputAudience from './InputAudience.vue'

const { card, campaign } = defineProps<{ card: Card, campaign?: EmailCampaign }>()

const { fictionUser } = useService<{ fictionSend: FictionSend }>()

const showSendModal = vue.ref(false)
const settingsModal = vue.ref('')
const saving = vue.ref(false)

const from = vue.computed(() => {
  const org = fictionUser.activeOrganization.value
  return `${org?.orgName || org?.orgEmail} <${org?.orgEmail}>`
})

function getWordCountFromHTML(html?: string) {
  if (!html)
    return 0
  const h = html.replace(/<[^>]*>?/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = h.split(' ').length

  return wordCount
}

type OptionItem = NavItem & { options?: InputOption<any>[] }

const items = vue.computed<OptionItem[]>(() => {
  const config = campaign?.toConfig() as EmailCampaignConfig
  const post = config.post
  const subscriberCount = config.subscriberCount
  const wordCount = getWordCountFromHTML(post?.content || '')
  const settings = card.link(`/manage-campaign/settings?campaignId=${config?.campaignId}`)
  const editLink = card.link(`/email-edit?campaignId=${config?.campaignId}`)
  const pub = card.link(`/settings/project`)
  const hasSubject = !!config?.subject
  const hasTitle = !!post?.title
  const hasContent = !!post?.content

  const scheduleDisplay = config?.scheduledAt && config?.scheduleMode !== 'now' ? 'Scheduled' : 'Send on Publish'

  const subs = subscriberCount ? `${subscriberCount} Subscribers` : 'No Subscribers'
  const hasSubs = !!(subscriberCount && subscriberCount > 0)

  return [

    {
      key: 'subject',
      icon: 'i-tabler-mail',
      title: 'Subject and Sender',
      subTitle: 'The subject line of the email',
      content: config?.subject ? `${config?.subject} / ${config?.preview || 'No Preview'}` : 'Not Set',
      progress: config?.subject ? 'ready' : 'pending',
      actions: [
        { name: 'Update', onClick: ({ item }) => (settingsModal.value = item?.key) },
      ],
      options: [
        new InputOption({ key: 'subject', label: 'Subject Line', input: 'InputText', isRequired: true, placeholder: 'Subject Line', description: 'This is the subject line that appears in the recipient\'s inbox.' }),
        new InputOption({ key: 'preview', label: 'Preview Text', input: 'InputText', placeholder: 'Preview Text', description: 'This is the text that appears in the inbox preview of your email.' }),
      ],
    },
    {
      key: 'content',
      icon: 'i-tabler-mail',
      title: 'Title and Content',
      subTitle: 'The content of the email',
      content: config?.post?.content ? `${getWordCountFromHTML(config?.post?.content)} words` : 'Not Set',
      progress: 'pending',
      href: settings,
      actions: [
        { name: 'Compose', href: editLink },
      ],
    },
    {
      icon: 'i-tabler-calendar',
      key: 'schedule',
      title: 'Schedule and Audience',
      subTitle: 'Send Time and Date',
      content: scheduleDisplay,
      progress: 'ready',
      actions: [{
        name: 'Set Up',
        onClick: ({ item }) => (settingsModal.value = item?.key),
      }],
      options: [
        new InputOption({
          key: 'audience',
          label: 'Audience',
          description: 'Who this email will be sent to...',
          input: InputAudience,
          props: { card },
        }),
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
    // {
    //   icon: 'i-tabler-users',
    //   key: 'schedule',
    //   title: 'Recipients of the Email',
    //   subTitle: 'Who will receive this email',
    //   content: scheduleDisplay,
    //   progress: 'ready',
    //   actions: [{
    //     name: 'Set Up',
    //     onClick: ({ item }) => (settingsModal.value = item?.key),
    //   }],
    // },
    // {
    //   name: 'Sending From',
    //   desc: 'The email address the email will be sent from',
    //   value: from.value,
    //   isActive: !!from.value,
    //   href: pub,
    // },
    // {
    //   name: 'Sending To',
    //   desc: 'The list of subscribers the email will be sent to',
    //   value: subs,
    //   isActive: hasSubs,
    //   href: settings,
    // },
    // {
    //   name: 'Title',
    //   desc: 'The title of the email content',
    //   value: post?.title || 'Not Set',
    //   href: edit,
    //   isActive: hasTitle,
    // },
    // {
    //   name: 'Email Body Content',
    //   desc: 'The HTML content of the email',
    //   value: wordCount ? `Approx. ${wordCount} Words` : 'Not Set',
    //   href: edit,
    //   isActive: hasContent,
    // },
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
  if (em?.status === 'pending' && isReady)
    return { name: readyText, btn: 'primary', onClick: () => { showSendModal.value = true } }
  else if (em?.status === 'pending')
    return { name: 'Waiting for Setup', btn: 'default', isDisabled: true }
  else
    return { name: em?.status, btn: 'default' }
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
</script>

<template>
  <div>
    <div class="">
      <fieldset class="my-12">
        <div class=" grid grid-cols-1 gap-4 divide-y divide-theme-200 dark:divide-theme-700/70">
          <div
            v-for="(item, i) in items"
            :key="i"
            class="relative flex gap-4 lg:gap-6 px-8 py-4"
          >
            <div class="size-7 rounded-xl flex justify-center items-center ">
              <div class="text-3xl" :class="item.icon" />
            </div>
            <div class="grow">
              <div class="mb-1 text-xl font-semibold  hover:text-theme-300 dark:hover:text-theme-0 cursor-pointer">
                {{ item.title }}
              </div>
              <p class="text-lg font-normal text-theme-500 dark:text-theme-400">
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
                <span class="text-sm  text-theme-500 dark:text-theme-400">{{ item.content }}</span>
              </div>
            </div>
            <div>
              <XButton
                v-for="(action, ii) in (item.actions || [])"
                :key="ii"
                design="solid"
                :theme="action.theme || 'theme'"
                size="lg"
                icon-after="i-tabler-arrow-right"
                :href="action.href"
                @click.stop="action.onClick ? (action.onClick({ item, event: $event })) : ''"
              >
                {{ action.name }}
              </XButton>
            </div>
          </div>
        </div>
      </fieldset>
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
