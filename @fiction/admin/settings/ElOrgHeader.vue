<script setup lang="ts">
import type { Card } from '@fiction/site/card'
import { useService, vue } from '@fiction/core'
import ElAvatarOrg from '@fiction/admin/theme/el/ElAvatarOrg.vue'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import type { ActionItem, IndexItem, Organization } from '@fiction/core/index.js'
import type { InputOption } from '@fiction/ui'
import ElModal from '@fiction/ui/ElModal.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ToolForm from '../tools/ToolForm.vue'
import { newOrgOptions } from './index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const service = useService()

const mode = vue.ref<'current' | 'change' | 'new'>('current')

const list = vue.computed<IndexItem[]>(() => {
  return service.fictionUser.activeOrganizations.value.map((org) => {
    return {
      key: org.orgId,
      name: org.orgName || 'Untitled',
      desc: org.orgEmail || 'No Email',
      href: props.card.link(`/settings?orgId=${org.orgId}`),
      media: org.avatar?.url || '',
      authors: org.members,
    } as IndexItem
  })
})

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

const newOrgActions = vue.computed<ActionItem[]>(() => {
  return [
    {
      name: 'Create New Organization',
      btn: 'primary' as const,
      loading: sending.value,
    },
  ]
})

const toolFormOptions = vue.computed<InputOption[]>(() => {
  return [newOrgOptions({ title: 'New Organization', actionsRef: newOrgActions }).value]
})
</script>

<template>
  <div class="p-8 dark:bg-theme-950 border-b dark:border-theme-600/70">
    <ElModal v-if="mode === 'new'" :vis="mode === 'new'" modal-class="max-w-lg" @update:vis="mode = 'current'">
      <ElForm @submit="createNewOrganization()">
        <ToolForm v-model="newOrgForm" ui-size="lg" :card :options="toolFormOptions" :disable-group-hide="true" />
      </ElForm>
    </ElModal>
    <ElIndexGrid
      v-else-if="mode === 'change'"
      list-title="Change Organization"
      :list="list"
      :actions="[
        { name: 'Back', icon: 'i-tabler-arrow-left', btn: 'default', onClick: () => (mode = 'current') },
        { name: 'New Organization', icon: 'i-tabler-plus', btn: 'primary', onClick: () => (mode = 'new') },
      ]"
    >
      <template #item="{ item }">
        <div class="flex -space-x-0.5">
          <dt class="sr-only">
            Members
          </dt>
          <dd v-for="(member, ii) in item.authors" :key="ii">
            <ElAvatar class="h-6 w-6 rounded-full bg-theme-50 ring-2 ring-white" :email="member.email" />
          </dd>
        </div>
      </template>
    </ElIndexGrid>
    <div v-else class="md:flex md:items-center md:justify-between md:space-x-5 ">
      <div class="flex items-start space-x-5">
        <div class="flex-shrink-0">
          <div class="relative">
            <ElAvatarOrg class="size-16 rounded-full" />
            <span class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
          </div>
        </div>
        <div class="pt-1.5 space-y-1">
          <h1 class="text-2xl font-semibold text-theme-900 dark:text-theme-0 x-font-title">
            {{ service.fictionUser.activeOrganization.value?.orgName || 'Unnamed Organization' }}
          </h1>
          <p class="text-sm font-normal text-theme-500 dark:text-theme-300">
            Organization &mdash; {{ service.fictionUser.activeOrganization.value?.orgEmail }} &mdash; you are an <span class="">{{ service.fictionUser.activeOrganization.value?.relation?.memberAccess }}</span>
          </p>
        </div>
      </div>
      <div class="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
        <ElButton btn="default" size="md" icon="i-tabler-arrows-exchange" @click="mode = 'change'">
          Change Organization
        </ElButton>
      </div>
    </div>
  </div>
</template>
