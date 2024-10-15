<script setup lang="ts">
import type { Card } from '@fiction/site/card'
import type { FictionAdmin } from '..'
import { dayjs, gravatarUrlSync, type MediaObject, useService, vue } from '@fiction/core/index.js'
import ElModal from '@fiction/ui/ElModal.vue'
import { InputOption } from '@fiction/ui/index.js'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import ElHeader from './ElHeader.vue'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const service = useService<{ fictionAdmin: FictionAdmin }>()

const user = vue.computed(() => service.fictionUser.activeUser.value)

const mode = vue.ref<'current' | 'changeEmail'>('current')

const codeSent = vue.ref(false)
const sending = vue.ref(false)
const form = vue.ref<{ code?: string, email?: string }>({})
async function requestCode(): Promise<void> {
  sending.value = true

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
    sending.value = false
  }
}

async function requestChangeEmail() {
  sending.value = true

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
    sending.value = false
  }
}

const toolFormOptions = vue.computed<InputOption[]>(() => {
  const requestAction = { name: 'Request Verification Code', theme: 'primary' as const, loading: sending.value }
  const submitAction = { name: 'Change Email', theme: 'primary' as const, loading: sending.value }

  const actions = codeSent.value ? [submitAction] : [requestAction]

  const options: InputOption[] = [
    new InputOption({ key: 'email', label: 'New Email Address', input: 'InputEmail', placeholder: 'New Email Address' }),
    new InputOption({ key: 'code', label: 'One Time Code', input: 'InputOneTimeCode', placeholder: '••••••', isHidden: !codeSent.value }),
    new InputOption({ key: 'actions', input: 'InputActionList', props: { actions, defaultSize: 'md' } }),
  ]

  return [new InputOption({ key: 'orgInfo', label: 'Change Email Address', input: 'group', options })]
})

const avatar = vue.shallowRef<MediaObject>({})
vue.onMounted(() => {
  vue.watchEffect(async () => {
    if (user.value?.avatar?.url) {
      avatar.value = user.value.avatar
    }
    else if (user.value?.email) {
      avatar.value = (await gravatarUrlSync(user.value.email, { size: 400, default: 'identicon' }))
    }
  })
})

const header = vue.computed(() => {
  return {
    title: user.value?.fullName || user.value?.email,
    subTitle: `User / ${user.value?.email} / Joined ${dayjs(user.value?.createdAt).format('MMM D, YYYY')}`,
    media: avatar.value,
    actions: [{
      name: 'Change Email',
      icon: 'i-tabler-arrows-exchange',
      onClick: () => mode.value = 'changeEmail',
    }],
  }
})
</script>

<template>
  <div class="px-6 ">
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

    <ElHeader
      v-else
      :model-value="header"
    />
  </div>
</template>
