<script lang="ts" setup>
import type { ActionButton, NavItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { EmailCampaign } from '../campaign.js'
import type { EmailCampaignConfig } from '../schema.js'
import SettingsContentWrap from '@fiction/admin/settings/SettingsContentWrap.vue'
import { dayjs, getNavComponentType, useService, vue } from '@fiction/core'
import ElModalConfirm from '@fiction/ui/ElModalConfirm.vue'

const { card, campaign } = defineProps<{ card: Card, campaign?: EmailCampaign }>()

const service = useService()

const showSendModal = vue.ref(false)

const from = vue.computed(() => {
  const org = service.fictionUser.activeOrganization.value
  return `${org?.orgName || org?.orgEmail} <${org?.orgEmail}>`
})

function getWordCountFromHTML(html?: string) {
  if (!html)
    return 0
  const h = html.replace(/<[^>]*>?/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = h.split(' ').length

  return wordCount
}

const items = vue.computed<NavItem[]>(() => {
  const config = campaign?.toConfig() as EmailCampaignConfig
  const post = config.post
  const subscriberCount = config.subscriberCount
  const wordCount = getWordCountFromHTML(post?.content || '')
  const settings = card.link(`/email-manage/settings?campaignId=${config?.campaignId}`)
  const edit = card.link(`/email-edit?campaignId=${config?.campaignId}`)
  const pub = card.link(`/settings/project`)
  const hasSubject = !!config?.subject
  const hasTitle = !!post?.title
  const hasContent = !!post?.content

  const scheduleDisplay = config?.scheduledAt && config?.scheduleMode !== 'now' ? 'Scheduled' : 'Send on Publish'

  const subs = subscriberCount ? `${subscriberCount} Subscribers` : 'No Subscribers'
  const hasSubs = !!(subscriberCount && subscriberCount > 0)

  return [
    { name: 'Schedule Send', desc: scheduleDisplay, isActive: true, href: settings },
    { name: 'Subject', desc: config?.subject || 'Not Set', isActive: hasSubject, href: settings },
    { name: 'Sending From', desc: from.value, isActive: !!from.value, href: pub },
    { name: 'Sending To', desc: subs, isActive: hasSubs, href: settings },
    { name: 'Title', desc: post?.title || 'Not Set', href: edit, isActive: hasTitle },
    { name: 'Email Content', desc: wordCount ? `Approx. ${wordCount} Words` : 'Not Set', href: edit, isActive: hasContent },
  ]
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
</script>

<template>
  <SettingsContentWrap
    :card
    :header="`Email: ${campaign?.title.value ?? 'Untitled'}`"
    :sub-header="`Status: ${campaign?.status.value ?? 'Draft'}`"
    :avatar="{ iconId: 'email' }"
  >
    <div class="p-12 w-full max-w-screen-md mx-auto">
      <fieldset class="my-12">
        <div class=" grid grid-cols-1 gap-4">
          <component :is="getNavComponentType(item)" v-for="(item, i) in items" :key="i" :to="item.href" class="relative flex gap-5 border border-theme-200 dark:border-theme-600/80 dark:hover:border-theme-600 bg-theme-50 dark:bg-theme-700/30 rounded-xl p-4">
            <div class="size-12 rounded-xl flex justify-center items-center " :class="item.isActive ? 'bg-green-500 dark:bg-green-600 text-white' : 'bg-theme-50 dark:bg-theme-700'">
              <div class="text-3xl" :class="!item.isActive ? 'i-tabler-x' : 'i-tabler-check'" />
            </div>
            <div class="text-sm">
              <div class=" font-medium text-theme-500 dark:text-theme-400 hover:text-theme-300 dark:hover:text-theme-0 cursor-pointer">
                {{ item.name }}
              </div>
              <p id="comments-description" class="text-base">
                {{ item?.desc }}
              </p>
            </div>
          </component>
        </div>
      </fieldset>
    </div>
    <ElModalConfirm
      v-model:vis="showSendModal"
      v-bind="modalText"
      @confirmed="sendOrSchedule()"
    />
  </SettingsContentWrap>
</template>
