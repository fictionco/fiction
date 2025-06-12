<script lang="ts" setup>
import type { ActionButton, User } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { InputOption } from '@fiction/ui/index.js'
import type { FictionAdmin } from '..'
import { gravatarUrlSync, useService, vue } from '@fiction/core'
import { UserSchema as schema } from '@fiction/core/plugin-user/schema'
import { AutosaveUtility } from '@fiction/core/utils/save'
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
const isDirty = vue.ref(false)

const user = vue.computed(() => service.fictionUser.activeUser.value)

const userModel = vue.ref<User>(user.value || {})

const avatarUrl = vue.computed(() => {
  const o = user.value
  return o?.avatar ? o?.avatar : (gravatarUrlSync(o?.email, { size: 400 }))
})

async function save() {
  sending.value = 'saving'
  const endpoint = service.fictionUser.requests.ManageUser
  const fields = userModel.value
  const userId = fields?.userId

  if (!userId)
    return

  await endpoint.projectRequest({ _action: 'update', fields, where: { userId } })

  userModel.value = user.value || {}

  isDirty.value = false

  sending.value = ''
}

const saveUtil = new AutosaveUtility({
  onSave: () => save(),
})

function update(userNew: User) {
  userModel.value = userNew

  saveUtil.autosave({ caller: 'panelAccount' })
}

const detailOptions: InputOption[] = [
  createOption({ schema, key: 'fullName', label: 'Full Name', input: 'InputText', placeholder: 'Enter Your Name', isRequired: true }),
  createOption({ schema, key: 'avatar', label: 'User Avatar', input: 'InputMedia', subLabel: 'Upload a square image or it will be cropped' }),
  createOption({ schema, key: 'handle', label: 'Username', input: 'InputHandle', placeholder: 'my-username', props: { table: 'fiction_user', columns: [{ name: 'handle' }] } }),
]

const options = vue.computed(() => {
  return [
    createOption({
      key: 'userDetails',
      label: 'User Details',
      icon: { class: 'i-tabler-user' },
      input: 'group',
      options: detailOptions,
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

    const r = await service.fictionUser.requests.ManageUserEmail.request({ _action: 'oneTimeCode', email, userId, queryVars: {}, caller: 'panelAccount' })

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
    title="User Settings"
    :loading
    :header
    :action="{
      buttons: [{
        testId: 'saveButton',
        label: saveUtil.isDirty.value ? 'Saving' : 'Saved',
        onClick: () => save(),
        design: 'outline',
        theme: saveUtil.isDirty.value ? 'orange' : 'primary',
        loading: sending === 'saving',
        icon: saveUtil.isDirty.value ? 'i-tabler-upload' : 'i-tabler-check',
      }] }"
  >
    <FormEngine
      :model-value="userModel"
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
