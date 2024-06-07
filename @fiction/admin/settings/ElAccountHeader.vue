<script setup lang="ts">
import type { Card } from '@fiction/site/card'
import { dayjs, useService, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import type { ActionItem, IndexItem, Organization } from '@fiction/core/index.js'
import ElModal from '@fiction/ui/ElModal.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import { InputOption } from '@fiction/ui'
import ToolForm from '../tools/ToolForm.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const service = useService()

const user = vue.computed(() => service.fictionUser.activeUser.value)

const mode = vue.ref<'current' | 'changeEmail'>('current')

const sending = vue.ref(false)
const newOrgForm = vue.ref<Organization>({})
async function createNewOrganization(): Promise<void> {
  sending.value = true

  try {
    const { orgName, orgEmail, avatar } = newOrgForm.value

    const userId = service.fictionUser.activeUser.value?.userId

    if (!userId)
      throw new Error('userId is missing')

    if (!orgName)
      throw new Error('Organization name is required')

    if (!orgEmail)
      throw new Error('Organization email is required')

    const r = await service.fictionUser.requests.ManageOrganization.request({
      userId,
      fields: { orgName, orgEmail, avatar },
      _action: 'create',
    })

    if (r.status === 'success') {
      const orgId = r.data?.orgId
      await props.card.goto(`/settings?orgId=${orgId}`)
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

const codeSent = vue.ref(false)
const toolFormOptions = vue.computed<InputOption[]>(() => {
  const requestAction = { name: 'Request Verification Code', btn: 'primary' as const }
  const submitAction = { name: 'Change Email', btn: 'primary' as const }

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
  <div class="p-8 dark:bg-theme-950 border-b dark:border-theme-700">
    <ElModal v-if="mode === 'changeEmail'" :vis="mode === 'changeEmail'" modal-class="max-w-lg" @update:vis="mode = 'current'">
      <ElForm @submit="createNewOrganization()">
        <ToolForm v-model="newOrgForm" ui-size="lg" :card :options="toolFormOptions" :disable-group-hide="true" />
      </ElForm>
    </ElModal>

    <div v-else class="md:flex md:items-center md:justify-between md:space-x-5 ">
      <div class="flex items-start space-x-5">
        <div class="flex-shrink-0">
          <div class="relative">
            <ElAvatar class="size-16 rounded-full" :email="user?.email" />
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
