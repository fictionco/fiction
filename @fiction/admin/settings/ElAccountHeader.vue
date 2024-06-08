<script setup lang="ts">
import type { Card } from '@fiction/site/card'
import { dayjs, useService, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import { InputOption } from '@fiction/ui'
import ToolForm from '../tools/ToolForm.vue'
import type { FictionAdmin } from '..'

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
  const requestAction = { name: 'Request Verification Code', btn: 'primary' as const, loading: sending.value }
  const submitAction = { name: 'Change Email', btn: 'primary' as const, loading: sending.value }

  const actions = codeSent.value ? [submitAction] : [requestAction]

  const options = [
    new InputOption({ key: 'email', label: 'New Email Address', input: 'InputEmail', placeholder: 'New Email Address' }),
    new InputOption({ key: 'code', label: 'One Time Code', input: 'InputOneTimeCode', placeholder: '••••••', isHidden: !codeSent.value }),
    new InputOption({ key: 'actions', input: 'InputActions', props: { actions, defaultSize: 'md' } }),
  ]

  return [new InputOption({ key: 'orgInfo', label: 'Change Email Address', input: 'group', options })]
})
</script>

<template>
  <div class="p-8 dark:bg-theme-950 border-b dark:border-theme-600/70">
    <ElModal v-if="mode === 'changeEmail'" :vis="mode === 'changeEmail'" modal-class="max-w-lg" @update:vis="mode = 'current'">
      <ElForm @submit="codeSent ? requestChangeEmail() : requestCode()">
        <ToolForm v-model="form" ui-size="lg" :card :options="toolFormOptions" :disable-group-hide="true" />
      </ElForm>
    </ElModal>

    <div v-else class="md:flex md:items-center md:justify-between md:space-x-5 ">
      <div class="flex items-start space-x-5">
        <div class="flex-shrink-0">
          <div class="relative">
            <ElAvatar class="size-16 rounded-full ring-2 ring-theme-300 dark:ring-theme-0" :email="user?.email" />
            <span class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
          </div>
        </div>
        <div class="pt-1.5 space-y-1">
          <h1 class="text-2xl font-semibold text-theme-900 dark:text-theme-0 x-font-title">
            {{ user?.fullName || user?.email }}
          </h1>
          <p class="text-sm font-normal text-theme-500 dark:text-theme-400">
            User &mdash; {{ user?.email }} &mdash; Joined {{ dayjs(user?.createdAt).format('MMM D, YYYY') }}
          </p>
        </div>
      </div>
      <div class="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
        <ElButton btn="default" size="md" icon="i-tabler-arrows-exchange" @click.stop="mode = 'changeEmail'">
          Change Email
        </ElButton>
      </div>
    </div>
  </div>
</template>
