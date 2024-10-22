<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FictionSubscribe, Subscriber } from '../index.js'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'
import { deepMerge, gravatarUrlSync, standardDate, type User, useService, vue } from '@fiction/core'
import { AutosaveUtility } from '@fiction/core/utils/save.js'
import { InputOption } from '@fiction/ui/index.js'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'

type UserConfig = {
  isNavItem: boolean
}

const { card } = defineProps<{ card: Card<UserConfig> }>()
const service = useService<{ fictionSubscribe: FictionSubscribe }>()

const loading = vue.ref(true)
const sending = vue.ref('')

const subscriber = vue.ref<Subscriber>({})

async function load() {
  loading.value = true

  const subscriptionId = service.fictionRouter.query.value.subscriptionId as string | undefined

  try {
    if (!subscriptionId)
      return

    const endpoint = service.fictionSubscribe.requests.ManageSubscription
    const orgId = service.fictionUser.activeOrgId.value
    if (!orgId)
      throw new Error('No orgId')

    const r = await endpoint.projectRequest({ _action: 'list', where: { subscriptionId } })

    if (!r.data || !r.data.length)
      throw new Error('No subscriber found')

    subscriber.value = r.data[0]
  }
  catch (error) {
    console.error('Error loading subscriber', error)
  }
  finally {
    loading.value = false
  }
}

vue.onMounted(() => load())

const user = vue.computed(() => {
  const s = subscriber.value
  return deepMerge([s, s.user, s.inlineUser]) as User
})

function getAvatarUrl(user: User) {
  return user.avatar ? user.avatar : (gravatarUrlSync(user.email, { size: 400, default: 'identicon' }))
}

async function saveSubscriber() {
  sending.value = 'saving'
  const endpoint = service.fictionSubscribe.requests.ManageSubscription
  const fields = subscriber.value
  const subscriptionId = fields.subscriptionId

  if (!subscriptionId)
    return

  await endpoint.projectRequest({ _action: 'update', fields, where: [{ subscriptionId }] })

  sending.value = ''
}

const saveUtil = new AutosaveUtility({
  onSave: () => saveSubscriber(),
})

function updateSubscriber(subscriberNew: Subscriber) {
  subscriber.value = subscriberNew

  saveUtil.autosave()
}

const detailOptions = [
  new InputOption({
    testId: 'subscriber-email',
    label: 'Subscriber Email',
    subLabel: 'The email address of the subscriber',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: subscriber.value?.email ? 'ready' : 'optional',
        data: subscriber.value?.email,
      }
    },
    options: [
      new InputOption({ key: 'email', label: 'Subscriber Email', input: 'InputText', placeholder: 'Enter Headline' }),
    ],
  }),
  new InputOption({
    testId: 'subscriber-status',
    label: 'Status',
    subLabel: 'The recipient status of the subscriber',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: subscriber.value?.status ? 'ready' : 'incomplete',
        data: subscriber.value?.status,
      }
    },
    options: [
      new InputOption({ key: 'status', label: 'Status', input: 'InputSelectCustom', list: [
        'active',
        'unsubscribed',
        'cleaned',
        'pending',
      ] }),
    ],
  }),
  new InputOption({
    testId: 'subscriber-tags',
    label: 'Tags',
    subLabel: 'Tags associated with the subscriber',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: subscriber.value?.tags?.length ? 'ready' : 'optional',
        data: subscriber.value?.tags?.join(', '),
      }
    },
    options: [
      new InputOption({ key: 'tags', label: 'Tags', input: 'InputItems', placeholder: 'Tag, Tag, Tag' }),
    ],
  }),
  new InputOption({
    testId: 'subscriber-created-at',
    label: 'Subscription Created At',
    subLabel: 'The date the subscriber was added to the list',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: subscriber.value?.createdAt ? 'ready' : 'incomplete',
        data: standardDate(subscriber.value?.createdAt, { withTime: true }),
      }
    },
    options: [
      new InputOption({ key: 'createdAt', label: 'Created At Date', input: 'InputDate', props: { includeTime: true } }),
    ],
  }),
  new InputOption({
    testId: 'subscriber-name',
    label: 'Subscriber Name',
    subLabel: 'The name of the subscriber',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: subscriber.value?.inlineUser?.fullName ? 'ready' : 'optional',
        data: subscriber.value?.inlineUser?.fullName,
      }
    },
    options: [
      new InputOption({ key: 'inlineUser.fullName', label: 'Subscriber Name', input: 'InputText', placeholder: 'Enter Name' }),
    ],
  }),
  new InputOption({
    testId: 'subscriber-avatar',
    label: 'Subscriber Avatar',
    subLabel: 'The avatar of the subscriber',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: subscriber.value?.inlineUser?.avatar?.url ? 'ready' : 'optional',
        data: subscriber.value?.inlineUser?.avatar,
        format: 'media',
      }
    },
    options: [
      new InputOption({ key: 'inlineUser.avatar', label: 'Subscriber Avatar', input: 'InputMedia', subLabel: 'Upload a square image or it will be cropped' }),
    ],
  }),
  new InputOption({
    testId: 'subscriber-phone',
    label: 'Subscriber Phone',
    subLabel: 'The phone number of the subscriber',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: subscriber.value?.inlineUser?.phone ? 'ready' : 'optional',
        data: subscriber.value?.inlineUser?.phone,
      }
    },
    options: [
      new InputOption({ key: 'inlineUser.phone', label: 'Subscriber Phone', input: 'InputPhone', placeholder: '+1 555 555 5555' }),
    ],
  }),
]

const adminOptions = [
  new InputOption({
    key: 'deleteSubscriber',
    label: 'Permanently Delete Subscriber',
    subLabel: 'This action cannot be undone',
    input: 'InputControl',
    actions: () => [
      {
        name: 'Delete Subscriber...',
        theme: 'rose',
        design: 'ghost',
        icon: 'i-tabler-trash',
        loading: loading.value,
        onClick: async () => {
          const endpoint = service.fictionSubscribe.requests.ManageSubscription

          const confirmed = confirm('Are you sure you want to delete this subscriber?')

          if (confirmed && subscriber.value.subscriptionId) {
            sending.value = 'delete'
            await endpoint.projectRequest({ _action: 'delete', where: [{ subscriptionId: subscriber.value.subscriptionId }] })
            await card.goto('/audience', { caller: 'deleteSubscriber' })
            sending.value = ''
          }
        },
      },
    ],
  }),
]

const options = vue.computed(() => {
  return [
    new InputOption({
      key: 'userDetails',
      label: 'Subscriber Details',
      input: 'group',
      options: detailOptions,
      format: 'control',
    }),
    new InputOption({
      key: 'userDanger',
      label: 'Danger Zone',
      input: 'group',
      options: adminOptions,
      format: 'control',
    }),
  ]
})

const header = vue.computed(() => {
  return {
    title: user.value.fullName || user.value.email,
    subTitle: 'Subscriber Details',
    media: getAvatarUrl(user.value),
  }
})
</script>

<template>
  <SettingsPanel
    title="Subscriber Details"
    :actions="[{
      testId: 'subscriber-save-button',
      name: saveUtil.isDirty.value ? 'Saving...' : 'Saved',
      onClick: () => saveSubscriber(),
      theme: saveUtil.isDirty.value ? 'orange' : 'theme',
      loading: sending === 'saving',
      icon: saveUtil.isDirty.value ? 'i-tabler-upload' : 'i-tabler-check',
    }]"
    :header
  >
    <FormEngine
      :model-value="subscriber"
      state-key="settingsTool"
      input-wrap-class="max-w-lg w-full"
      ui-size="lg"
      :options
      :card
      :disable-group-hide="true"
      :data-value="JSON.stringify(subscriber)"
      @update:model-value="updateSubscriber($event)"
    />
  </SettingsPanel>
</template>
