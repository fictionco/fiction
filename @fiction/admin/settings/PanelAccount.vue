<script lang="ts" setup>
import type { ActionButton, User } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { InputOption } from '@fiction/ui/index.js'
import type { FictionAdmin } from '..'
import { gravatarUrlSync, useService, vue } from '@fiction/core'
import { AutosaveUtility } from '@fiction/core/utils/save.js'
import ElModal from '@fiction/ui/ElModal.vue'
import { createOption } from '@fiction/ui/index.js'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import SettingsPanel from './SettingsPanel.vue'

type UserConfig = {
  isNavItem: boolean
}

const { card } = defineProps<{ card: Card<UserConfig> }>()
const service = useService<{ fictionAdmin: FictionAdmin }>()

const loading = vue.ref(true)
const sending = vue.ref('')
const mode = vue.ref<'current' | 'changeEmail'>('current')

const user = vue.computed(() => service.fictionUser.activeUser.value)

const avatarUrl = vue.computed(() => {
  const o = user.value
  return o?.avatar ? o?.avatar : (gravatarUrlSync(o?.email, { size: 400 }))
})

async function save() {
  sending.value = 'saving'
  const endpoint = service.fictionUser.requests.ManageUser
  const fields = user.value
  const userId = fields?.userId

  if (!userId)
    return

  await endpoint.projectRequest({ _action: 'update', fields, where: { userId } })

  sending.value = ''
}

const saveUtil = new AutosaveUtility({
  onSave: () => save(),
})

function update(userNew: User) {
  service.fictionUser.activeUser.value = userNew

  saveUtil.autosave({ caller: 'panelAccountUpdate' })
}

const detailOptions = [
  createOption({
    key: 'control.fullName',
    label: 'Full Name',
    subLabel: 'Your first and last name',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: user.value?.fullName ? 'ready' : 'incomplete',
        data: user.value?.fullName,
      }
    },
    options: [
      createOption({ key: 'fullName', label: 'Full Name', input: 'InputText', placeholder: 'Enter Your Name', isRequired: true }),
    ],
  }),
  createOption({
    key: 'control.avatar',
    label: 'User Avatar',
    subLabel: 'Will default to Gravatar if not set.',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: user.value?.avatar?.url ? 'ready' : 'incomplete',
        data: user.value?.avatar,
        format: 'media',
      }
    },
    options: [
      createOption({ key: 'avatar', label: 'Account Avatar', input: 'InputMedia', subLabel: 'Upload a square image or it will be cropped' }),
    ],
  }),
  createOption({
    key: 'control.username',
    label: 'Username',
    subLabel: 'Unique username for your account',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: user.value?.username ? 'ready' : 'incomplete',
        data: user.value?.username,
      }
    },
    options: [
      createOption({ key: 'username', label: 'Username', input: 'InputUsername', placeholder: 'my-username', props: { table: 'fiction_user', columns: [{ name: 'username' }] } }),
    ],
  }),
  createOption({
    key: 'control.phone',
    label: 'Phone Number',
    subLabel: 'Include country code. Used for 2FA and notifications.',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: user.value?.phone ? 'ready' : 'optional',
        data: user.value?.phone,
      }
    },
    options: [
      createOption({ key: 'phone', label: 'Phone Number', description: 'Include country code. Used for 2FA and notifications.', input: 'InputPhone', placeholder: '+1 555 555 5555' }),
    ],
  }),
]

const profileOptions = [
  createOption({
    key: 'control.headline',
    label: 'Profile Headline',
    subLabel: 'Appears with your name.',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: user.value?.headline ? 'ready' : 'optional',
        data: user.value?.headline,
      }
    },
    options: [
      createOption({ key: 'headline', label: 'Profile Headline', input: 'InputText', placeholder: 'Enter Headline' }),
    ],
  }),
  createOption({
    key: 'control.bio',
    label: 'Profile Website',
    subLabel: 'Linked from author profile',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: user.value?.websiteUrl ? 'ready' : 'optional',
        data: user.value?.websiteUrl,
      }
    },
    options: [
      createOption({ key: 'websiteUrl', label: 'Website URL', input: 'InputUrl', placeholder: 'https://www.example.com' }),
    ],
  }),
  createOption({
    key: 'control.social',
    label: 'Social Links',
    subLabel: 'Add Links to your social profiles',
    input: 'InputControl',
    valueDisplay: () => {
      const accounts = Object.entries(user.value?.accounts || {})
      const accountList = accounts.filter(([k, v]) => v)
      const accountsSetText = accountList.map(([k, v]) => k.replace('Url', '')).join(', ')
      return {
        status: accountList.length ? 'ready' : 'optional',
        data: accountsSetText,
      }
    },
    options: [
      createOption({ key: 'accounts.xUrl', label: 'X / Twitter URL', input: 'InputUrl', placeholder: 'https://www.x.com/username' }),
      createOption({ key: 'accounts.instagramUrl', label: 'Instagram URL', input: 'InputUrl', placeholder: 'https://www.instagram.com/username' }),
      createOption({ key: 'accounts.linkedinUrl', label: 'LinkedIn URL', input: 'InputUrl', placeholder: 'https://www.linkedin.com/in/username' }),
      createOption({ key: 'accounts.facebookUrl', label: 'Facebook URL', input: 'InputUrl', placeholder: 'https://www.facebook.com/username' }),
      createOption({ key: 'accounts.githubUrl', label: 'GitHub URL', input: 'InputUrl', placeholder: 'https://www.github.com/username' }),
      createOption({ key: 'accounts.youtubeUrl', label: 'YouTube URL', input: 'InputUrl', placeholder: 'https://www.youtube.com/channel/username' }),
      createOption({ key: 'accounts.pinterestUrl', label: 'Pinterest URL', input: 'InputUrl', placeholder: 'https://www.pinterest.com/username' }),
      createOption({ key: 'accounts.tiktokUrl', label: 'TikTok URL', input: 'InputUrl', placeholder: 'https://www.tiktok.com/@username' }),
    ],
  }),
]

const options = vue.computed(() => {
  return [
    createOption({
      key: 'userDetails',
      label: 'Account Details',
      input: 'group',
      options: detailOptions,
      format: 'control',
    }),
    createOption({
      key: 'userProfile',
      label: 'Profile Details',
      input: 'group',
      options: profileOptions,
      format: 'control',
    }),
  ]
})

const header = vue.computed(() => {
  return {
    title: user.value?.fullName || user.value?.email,
    subTitle: `${user.value?.email} - Accounts Details`,
    media: avatarUrl.value,
    actions: [
      {
        label: 'Change Email',
        theme: 'theme' as const,
        onClick: () => mode.value = 'changeEmail',
      },
    ],
  }
})

vue.onMounted(async () => {
  await service.fictionUser.userInitialized({ caller: 'panelAccount' })
  loading.value = false
})

const codeSent = vue.ref(false)
const form = vue.ref<{ code?: string, email?: string }>({})
async function requestCode(): Promise<void> {
  sending.value = 'code'
  try {
    const { email } = form.value

    const userId = user.value?.userId

    if (!email)
      throw new Error('email is missing')

    if (!userId)
      throw new Error('userId is missing')

    const r = await service.fictionAdmin.emailActions.oneTimeCode.requestSend({ to: email, userId, queryVars: {} })

    if (r?.status === 'success') {
      service.fictionEnv.events.emit('notify', { type: 'success', message: 'We sent you a one-time-code' })
      codeSent.value = true
    }
  }
  catch (e) {
    const error = e as Error
    service.fictionEnv.events.emit('notify', { type: 'error', message: error.message })
  }
  finally {
    sending.value = ''
  }
}

async function requestChangeEmail() {
  sending.value = 'email'

  try {
    const { email, code } = form.value

    const userId = user.value?.userId

    if (!email)
      throw new Error('email is missing')

    if (!userId)
      throw new Error('userId is missing')

    if (!code)
      throw new Error('code is missing')

    const r = await service.fictionUser.requests.ManageUser.projectRequest({ _action: 'update', where: { userId }, fields: { email }, code })

    if (r?.status === 'success') {
      service.fictionEnv.events.emit('notify', { type: 'success', message: 'You successfully changed your email address' })
      mode.value = 'current'
    }
  }
  catch (e) {
    const error = e as Error
    service.fictionEnv.events.emit('notify', { type: 'error', message: error.message })
  }
  finally {
    sending.value = ''
  }
}

const toolFormOptions = vue.computed<InputOption[]>(() => {
  const loading = !!sending.value
  const requestAction = { label: 'Request Verification Code', theme: 'primary' as const, loading, onClick: requestCode }
  const submitAction = { label: 'Change Email', theme: 'primary' as const, loading, onClick: requestChangeEmail }

  const actions: ActionButton[] = codeSent.value ? [submitAction] : [requestAction]

  const options: InputOption[] = [
    createOption({ key: 'email', label: 'New Email Address', input: 'InputEmail', placeholder: 'New Email Address' }),
    createOption({ key: 'code', label: 'One Time Code', input: 'InputOneTimeCode', placeholder: '••••••', isHidden: !codeSent.value }),
    createOption({ key: 'actions', input: 'InputActionList', props: { buttons: () => actions, uiSize: 'md' } }),
  ]

  return [createOption({ key: 'accountEmailGroup', label: 'Change Email Address', input: 'group', options })]
})
</script>

<template>
  <SettingsPanel
    title="Account Settings"
    :loading
    :header
    :action="{ buttons: [{
      label: saveUtil.isDirty.value ? 'Saving...' : 'Saved',
      onClick: () => save(),
      theme: saveUtil.isDirty.value ? 'primary' : 'default',
      loading: sending === 'saving',
      icon: saveUtil.isDirty.value ? 'i-tabler-upload' : 'i-tabler-check',
    }] }"
  >
    <FormEngine
      :model-value="user"
      state-key="settingsTool"
      input-wrap-class="max-w-lg w-full"
      ui-size="lg"
      :options
      :card
      :disable-group-hide="true"
      :data-value="JSON.stringify(user)"
      @update:model-value="update($event)"
    />

    <ElModal v-if="mode === 'changeEmail'" :vis="mode === 'changeEmail'" modal-class="max-w-lg" @update:vis="mode = 'current'">
      <ElForm @submit="codeSent ? requestChangeEmail() : requestCode()">
        <FormEngine
          v-model="form"
          state-key="accountHeader"
          ui-size="lg"
          :card
          :options="toolFormOptions"
          :disable-group-hide="true"
        />
      </ElForm>
    </ElModal>
  </SettingsPanel>
</template>
