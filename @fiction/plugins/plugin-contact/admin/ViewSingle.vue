<script lang="ts" setup>
import type { User } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { Contact, FictionContact } from '../index.js'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'
import { deepMerge, gravatarUrlSync, standardDate, useService, vue } from '@fiction/core'
import { AutosaveUtility } from '@fiction/core/utils/save.js'
import { InputOption } from '@fiction/ui/index.js'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'

type UserConfig = {
  isNavItem: boolean
}

const { card } = defineProps<{ card: Card<UserConfig> }>()
const service = useService<{ fictionContact: FictionContact }>()

const loading = vue.ref(true)
const sending = vue.ref('')

const subscriber = vue.ref<Contact>({})

async function load() {
  loading.value = true

  const contactId = service.fictionRouter.query.value.itemId as string | undefined

  try {
    if (!contactId)
      return

    const endpoint = service.fictionContact.requests.ManageContact
    const orgId = service.fictionUser.activeOrgId.value
    if (!orgId)
      throw new Error('No orgId')

    const r = await endpoint.projectRequest({ _action: 'list', where: { contactId } })

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

vue.onMounted(() => {
  vue.watch(
    () => service.fictionRouter.query.value.itemId,
    async () => {
      load()
    },
    { immediate: true },
  )
})

const user = vue.computed(() => {
  const s = subscriber.value
  return deepMerge([s, s.user, s.inlineUser]) as User
})

function getAvatarUrl(user: User) {
  return user.avatar ? user.avatar : (gravatarUrlSync(user.email, { size: 400 }))
}

async function SaveContact(): Promise<undefined> {
  sending.value = 'saving'
  const endpoint = service.fictionContact.requests.ManageContact
  const fields = subscriber.value
  const contactId = fields.contactId

  if (!contactId)
    return

  await endpoint.projectRequest({ _action: 'update', fields, where: [{ contactId }] })

  sending.value = ''
}

const saveUtil = new AutosaveUtility({
  onSave: () => SaveContact(),
})

function updateContact(subscriberNew: Contact) {
  subscriber.value = subscriberNew

  saveUtil.autosave({ caller: 'updateContact' })
}

const detailOptions = [
  new InputOption({
    testId: 'subscriber-email',
    label: 'Contact Email',
    subLabel: 'The email address of the contact',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: subscriber.value?.email ? 'ready' : 'optional',
        data: subscriber.value?.email,
      }
    },
    options: [
      new InputOption({ key: 'email', label: 'Contact Email', input: 'InputText', placeholder: 'Enter Headline' }),
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
      new InputOption({ key: 'tags', label: 'Tags', input: 'InputTags' }),
    ],
  }),
  new InputOption({
    testId: 'subscriber-created-at',
    label: 'Connection Created At',
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
    label: 'Contact Name',
    subLabel: 'The name of the subscriber',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: subscriber.value?.inlineUser?.fullName ? 'ready' : 'optional',
        data: subscriber.value?.inlineUser?.fullName,
      }
    },
    options: [
      new InputOption({ key: 'inlineUser.fullName', label: 'Contact Name', input: 'InputText', placeholder: 'Enter Name' }),
    ],
  }),
  new InputOption({
    testId: 'subscriber-avatar',
    label: 'Contact Avatar',
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
      new InputOption({ key: 'inlineUser.avatar', label: 'Contact Avatar', input: 'InputMedia', subLabel: 'Upload a square image or it will be cropped' }),
    ],
  }),
  new InputOption({
    testId: 'subscriber-phone',
    label: 'Contact Phone',
    subLabel: 'The phone number of the subscriber',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: subscriber.value?.inlineUser?.phone ? 'ready' : 'optional',
        data: subscriber.value?.inlineUser?.phone,
      }
    },
    options: [
      new InputOption({ key: 'inlineUser.phone', label: 'Contact Phone', input: 'InputPhone', placeholder: '+1 555 555 5555' }),
    ],
  }),
]

const adminOptions = [
  new InputOption({
    key: 'deleteContact',
    label: 'Permanently Delete Contact',
    subLabel: 'This action cannot be undone',
    input: 'InputControl',
    actions: () => [
      {
        label: 'Delete Contact...',
        theme: 'rose',
        design: 'ghost',
        icon: 'i-tabler-trash',
        loading: loading.value,
        onClick: async () => {
          const endpoint = service.fictionContact.requests.ManageContact

          const confirmed = confirm('Are you sure you want to delete this subscriber?')

          if (confirmed && subscriber.value.contactId) {
            sending.value = 'delete'
            await endpoint.projectRequest({ _action: 'delete', where: [{ contactId: subscriber.value.contactId }] })
            await card.goto('/audience', { caller: 'deleteContact' })
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
      label: 'Contact Details',
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
    subTitle: 'Contact Details',
    media: getAvatarUrl(user.value),
  }
})
</script>

<template>
  <SettingsPanel
    title="Contact Details"
    :action="{
      buttons: [{
        testId: 'subscriber-save-button',
        label: saveUtil.isDirty.value ? 'Saving...' : 'Saved',
        onClick: () => SaveContact(),
        theme: saveUtil.isDirty.value ? 'orange' : 'theme',
        loading: sending === 'saving',
        icon: saveUtil.isDirty.value ? 'i-tabler-upload' : 'i-tabler-check',
      }] }"
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
      @update:model-value="updateContact($event)"
    />
  </SettingsPanel>
</template>
