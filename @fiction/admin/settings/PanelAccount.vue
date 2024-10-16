<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FictionAdmin } from '..'
import { gravatarUrlSync, type User, useService, vue } from '@fiction/core'
import { AutosaveUtility } from '@fiction/core/utils/save.js'
import ElModal from '@fiction/ui/ElModal.vue'
import { InputOption } from '@fiction/ui/index.js'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import ElHeader from './ElHeader.vue'
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
  return o?.avatar ? o?.avatar : (gravatarUrlSync(o?.email, { size: 400, default: 'identicon' }))
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

  saveUtil.autosave()
}

const detailOptions = [
  new InputOption({
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
      new InputOption({ key: 'fullName', label: 'Full Name', input: 'InputText', placeholder: 'Enter Your Name', isRequired: true }),
    ],
  }),
  new InputOption({
    label: 'Logo / Avatar',
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
      new InputOption({ key: 'avatar', label: 'Account Avatar', input: 'InputMedia', subLabel: 'Upload a square image or it will be cropped' }),
    ],
  }),
  new InputOption({
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
      new InputOption({ key: 'username', label: 'Username', input: 'InputUsername', placeholder: 'my-username', props: { table: 'fiction_user', columns: [{ name: 'username' }] } }),
    ],
  }),
  new InputOption({
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
      new InputOption({ key: 'phone', label: 'Phone Number', description: 'Include country code. Used for 2FA and notifications.', input: 'InputPhone', placeholder: '+1 555 555 5555' }),
    ],
  }),
]

const profileOptions = [
  new InputOption({
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
      new InputOption({ key: 'headline', label: 'Profile Headline', input: 'InputText', placeholder: 'Enter Headline' }),
    ],
  }),
  new InputOption({
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
      new InputOption({ key: 'websiteUrl', label: 'Website URL', input: 'InputUrl', placeholder: 'https://www.example.com' }),
    ],
  }),
  new InputOption({
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
      new InputOption({ key: 'accounts.xUrl', label: 'X / Twitter URL', input: 'InputUrl', placeholder: 'https://www.x.com/username' }),
      new InputOption({ key: 'accounts.instagramUrl', label: 'Instagram URL', input: 'InputUrl', placeholder: 'https://www.instagram.com/username' }),
      new InputOption({ key: 'accounts.linkedinUrl', label: 'LinkedIn URL', input: 'InputUrl', placeholder: 'https://www.linkedin.com/in/username' }),
      new InputOption({ key: 'accounts.facebookUrl', label: 'Facebook URL', input: 'InputUrl', placeholder: 'https://www.facebook.com/username' }),
      new InputOption({ key: 'accounts.githubUrl', label: 'GitHub URL', input: 'InputUrl', placeholder: 'https://www.github.com/username' }),
      new InputOption({ key: 'accounts.youtubeUrl', label: 'YouTube URL', input: 'InputUrl', placeholder: 'https://www.youtube.com/channel/username' }),
      new InputOption({ key: 'accounts.pinterestUrl', label: 'Pinterest URL', input: 'InputUrl', placeholder: 'https://www.pinterest.com/username' }),
      new InputOption({ key: 'accounts.tiktokUrl', label: 'TikTok URL', input: 'InputUrl', placeholder: 'https://www.tiktok.com/@username' }),
    ],
  }),
]

const options = vue.computed(() => {
  return [
    new InputOption({
      key: 'userDetails',
      label: 'Account Details',
      input: 'group',
      options: detailOptions,
      format: 'control',
    }),
    new InputOption({
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
    subTitle: 'Accounts Details',
    media: avatarUrl.value,
    actions: [
      {
        name: 'Change Email',
        theme: 'theme' as const,
        onClick: () => mode.value = 'changeEmail',
      },
    ],
  }
})

vue.onMounted(async () => {
  await service.fictionUser.userInitialized()
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
  const requestAction = { name: 'Request Verification Code', theme: 'primary' as const, loading, onClick: requestCode }
  const submitAction = { name: 'Change Email', theme: 'primary' as const, loading, onClick: requestChangeEmail }

  const actions = codeSent.value ? [submitAction] : [requestAction]

  const options: InputOption[] = [
    new InputOption({ key: 'email', label: 'New Email Address', input: 'InputEmail', placeholder: 'New Email Address' }),
    new InputOption({ key: 'code', label: 'One Time Code', input: 'InputOneTimeCode', placeholder: '••••••', isHidden: !codeSent.value }),
    new InputOption({ key: 'actions', input: 'InputActionList', props: { actions, defaultSize: 'md' } }),
  ]

  return [new InputOption({ key: 'accountEmailGroup', label: 'Change Email Address', input: 'group', options })]
})
</script>

<template>
  <SettingsPanel
    title="User Account and Author Profile"
    :loading
    :actions="[{
      name: saveUtil.isDirty.value ? 'Saving...' : 'Saved',
      onClick: () => save(),
      theme: saveUtil.isDirty.value ? 'primary' : 'default',
      loading: sending === 'saving',
      icon: saveUtil.isDirty.value ? 'i-tabler-upload' : 'i-tabler-check',
    }]"
  >
    <div class="p-6">
      <ElHeader
        v-if="header"
        class="dark:bg-theme-700/50 rounded-xl p-8"
        :model-value="header"
      />
    </div>
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
