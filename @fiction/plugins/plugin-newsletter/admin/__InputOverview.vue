<script lang="ts" setup>
import type { ActionButton, NavItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { EmailCampaignConfig } from '../schema.js'
import { dayjs, getNavComponentType, useService, vue } from '@fiction/core'
import ElActions from '@fiction/ui/buttons/ElActions.vue'
import ElModalConfirm from '@fiction/ui/ElModalConfirm.vue'

const props = defineProps({
  modelValue: { type: Object as vue.PropType<EmailCampaignConfig>, default: undefined },
  card: { type: Object as vue.PropType<Card>, required: true },
  actions: { type: Array as vue.PropType<ActionButton[]>, default: () => [] },
})

defineEmits<{
  (event: 'update:modelValue', payload: EmailCampaignConfig): void
}>()

const service = useService()
const email = vue.computed(() => {
  return props.modelValue
})

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
  const em = email.value
  const wordCount = getWordCountFromHTML(em?.post?.content || '')
  const settings = props.card.link(`/manage-newsletter/settings?campaignId=${em?.campaignId}`)
  const edit = props.card.link(`/campaign-edit?campaignId=${em?.campaignId}`)
  const pub = props.card.link(`/settings/project`)
  const hasSubject = !!em?.subject
  const hasTitle = !!em?.post?.title
  const hasContent = !!em?.post?.content

  const scheduleDisplay = em?.scheduledAt && em?.scheduleMode !== 'now' ? 'Scheduled' : 'Send on Publish'

  const subs = em?.subscriberCount ? `${em?.subscriberCount} Subscribers` : 'No Subscribers'
  const hasSubs = !!(em?.subscriberCount && em?.subscriberCount > 0)

  return [
    { name: 'Schedule Send', desc: scheduleDisplay, isActive: true, href: settings },
    { name: 'Subject', desc: em?.subject || 'Not Set', isActive: hasSubject, href: settings },
    { name: 'Sending From', desc: from.value, isActive: !!from.value, href: pub },
    { name: 'Sending To', desc: subs, isActive: hasSubs, href: settings },
    { name: 'Title', desc: em?.post?.title || 'Not Set', href: edit, isActive: hasTitle },
    { name: 'Email Content', desc: wordCount ? `Approx. ${wordCount} Words` : 'Not Set', href: edit, isActive: hasContent },
  ]
})

const sendNow = vue.computed(() => {
  const em = email.value
  return em?.scheduleMode === 'now' || !em?.scheduledAt || dayjs(em.scheduledAt).isBefore(dayjs())
})

const readyAction = vue.computed<ActionButton>(() => {
  const em = email.value
  const isReady = items.value.every(item => item.isActive)
  const scheduledTime = em?.scheduledAt ? dayjs(em.scheduledAt).format('MMM D, YYYY h:mm A') : ''
  const readyText = em?.scheduleMode === 'now' ? 'Send Now...' : `Schedule (${scheduledTime})...`
  if (em?.status === 'pending' && isReady)
    return { name: readyText, theme: 'primary', onClick: () => { showSendModal.value = true } }
  else if (em?.status === 'pending')
    return { name: 'Waiting for Setup', theme: 'default', isDisabled: true }
  else
    return { name: em?.status, theme: 'default' }
})

const allActions = vue.computed<ActionButton[]>(() => {
  const propActions = props.actions || []
  return [
    readyAction.value,
    ...propActions,
  ]
})

const modalText = vue.computed(() => {
  const em = email.value
  const scheduledTime = em?.scheduledAt ? dayjs(em.scheduledAt).format('MMM D, YYYY h:mm A') : ''
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
  const _em = email.value
  // if (sendNow.value)
  //   await service.fictionNewsletter.sendEmailNow(em?.campaignId)
  // else
  //   await service.fictionNewsletter.scheduleEmail(em?.campaignId)
  showSendModal.value = false
}
</script>

<template>
  <div>
    <div class="p-16  ">
      <div class="">
        <div class="mb-4 relative">
          <div class="text-4xl lg:text-5xl text-theme-500/30  i-tabler-mail" />
        </div>
        <h1 class=" text-2xl md:text-4xl font-bold tracking-tight dark:text-theme-0 sm:text-5xl x-font-title">
          Email:  {{ email?.title }}
        </h1>
        <p class="mt-6 text-lg lg:text-xl text-theme-600 dark:text-theme-300">
          Status: {{ email?.status }}
        </p>
        <ElActions class="flex gap-4 mt-6" ui-size="lg" :actions="allActions" />
      </div>
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
  </div>
</template>
