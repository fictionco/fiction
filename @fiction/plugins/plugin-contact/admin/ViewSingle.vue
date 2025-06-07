<script lang="ts" setup>
import type { User } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { Contact, FictionContact } from '../index.js'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'
import { deepMerge, gravatarUrlSync, standardDate, useService, vue } from '@fiction/core'
import { AutosaveUtility } from '@fiction/core/utils/save.js'
import { createOption } from '@fiction/ui/index.js'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'

type UserConfig = {
  isNavItem: boolean
}

const { card } = defineProps<{ card: Card<UserConfig> }>()
const service = useService<{ fictionContact: FictionContact }>()

const loading = vue.ref(true)
const sending = vue.ref('')

const contact = vue.ref<Contact>({})

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

    const r = await endpoint.projectRequest({ _action: 'list', where: { contactId } }, { caller: 'ViewSingle' })

    if (!r.data || !r.data.length)
      throw new Error('No contact found')

    contact.value = r.data[0]
  }
  catch (error) {
    console.error('Error loading contact', error)
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
  const s = contact.value
  return deepMerge([s, s.user, s.inlineUser]) as User
})

function getAvatarUrl(user: User) {
  return user.avatar ? user.avatar : (gravatarUrlSync(user.email, { size: 400 }))
}

async function SaveContact(): Promise<undefined> {
  sending.value = 'saving'
  const endpoint = service.fictionContact.requests.ManageContact
  const fields = contact.value
  const contactId = fields.contactId

  if (!contactId)
    return

  await endpoint.projectRequest({ _action: 'update', fields, where: [{ contactId }] })

  sending.value = ''
}

const saveUtil = new AutosaveUtility({
  onSave: () => SaveContact(),
})

function updateContact(contactNew: Contact) {
  contact.value = contactNew

  saveUtil.autosave({ caller: 'updateContact' })
}

const detailOptions = [
  createOption({
    key: 'control.email',
    testId: 'contact-email',
    label: 'Contact Email',
    subLabel: 'The email address of the contact',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: contact.value?.email ? 'ready' : 'optional',
        data: contact.value?.email,
      }
    },
    options: [
      createOption({ key: 'email', label: 'Contact Email', input: 'InputText', placeholder: 'Enter Headline' }),
    ],
  }),
  createOption({
    key: 'control.status',
    testId: 'contact-status',
    label: 'Status',
    subLabel: 'The recipient status of the contact',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: contact.value?.status ? 'ready' : 'incomplete',
        data: contact.value?.status,
      }
    },
    options: [
      createOption({ key: 'status', label: 'Status', input: 'InputSelectCustom', list: [
        'active',
        'unsubscribed',
        'cleaned',
        'pending',
      ] }),
    ],
  }),
  createOption({
    key: 'control.tags',
    testId: 'contact-tags',
    label: 'Tags',
    subLabel: 'Tags associated with the contact',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: contact.value?.tags?.length ? 'ready' : 'optional',
        data: contact.value?.tags?.join(', '),
      }
    },
    options: [
      createOption({ key: 'tags', label: 'Tags', input: 'InputTags' }),
    ],
  }),
  createOption({
    key: 'control.createdAt',
    testId: 'contact-created-at',
    label: 'Connection Created At',
    subLabel: 'The date the contact was added to the list',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: contact.value?.createdAt ? 'ready' : 'incomplete',
        data: standardDate(contact.value?.createdAt, { withTime: true }),
      }
    },
    options: [
      createOption({ key: 'createdAt', label: 'Created At Date', input: 'InputDate', props: { includeTime: true } }),
    ],
  }),
  createOption({
    key: 'control.inlineUser.fullName',
    testId: 'contact-name',
    label: 'Contact Name',
    subLabel: 'The name of the contact',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: contact.value?.inlineUser?.fullName ? 'ready' : 'optional',
        data: contact.value?.inlineUser?.fullName,
      }
    },
    options: [
      createOption({ key: 'inlineUser.fullName', label: 'Contact Name', input: 'InputText', placeholder: 'Enter Name' }),
    ],
  }),
  createOption({
    key: 'control.inlineUser.avatar',
    testId: 'contact-avatar',
    label: 'Contact Avatar',
    subLabel: 'The avatar of the contact',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: contact.value?.inlineUser?.avatar?.url ? 'ready' : 'optional',
        data: contact.value?.inlineUser?.avatar,
        format: 'media',
      }
    },
    options: [
      createOption({ key: 'inlineUser.avatar', label: 'Contact Avatar', input: 'InputMedia', subLabel: 'Upload a square image or it will be cropped' }),
    ],
  }),
]

const adminOptions = [
  createOption({
    key: 'deleteContact',
    label: 'Delete Contact',
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

          const confirmed = confirm('Are you sure you want to delete this contact?')

          if (confirmed && contact.value.contactId) {
            sending.value = 'delete'
            await endpoint.projectRequest({ _action: 'delete', where: [{ contactId: contact.value.contactId }] })
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
    createOption({
      key: 'userDetails',
      label: 'Contact Details',
      input: 'group',
      options: detailOptions,
      format: 'control',
    }),
    createOption({
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
        testId: 'contact-save-button',
        label: saveUtil.isDirty.value ? 'Saving...' : 'Saved',
        onClick: () => SaveContact(),
        theme: saveUtil.isDirty.value ? 'orange' : 'theme',
        loading: sending === 'saving',
        icon: saveUtil.isDirty.value ? 'i-tabler-upload' : 'i-tabler-check',
      }] }"
    :header
  >
    <FormEngine
      :model-value="contact"
      state-key="settingsTool"
      input-wrap-class="max-w-lg w-full"
      ui-size="lg"
      :options
      :card
      :disable-group-hide="true"
      :data-value="JSON.stringify(contact)"
      @update:model-value="updateContact($event)"
    />
  </SettingsPanel>
</template>
