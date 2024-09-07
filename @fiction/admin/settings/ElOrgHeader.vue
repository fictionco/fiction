<script setup lang="ts">
import { useService, vue } from '@fiction/core'
import { gravatarUrlSync } from '@fiction/core/index.js'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import type { ActionItem, IndexItem, Organization } from '@fiction/core/index.js'
import type { Card } from '@fiction/site/card'
import type { InputOption } from '@fiction/ui'
import ToolForm from '../tools/ToolForm.vue'
import ElHeader from './ElHeader.vue'
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

const avatar = vue.ref({})
vue.onMounted(() => {
  vue.watchEffect(async () => {
    const activeOrg = service.fictionUser.activeOrganization.value
    if (activeOrg?.avatar?.url) {
      avatar.value = activeOrg?.avatar
    }
    else if (activeOrg?.orgEmail) {
      avatar.value = (gravatarUrlSync(activeOrg?.orgEmail, { size: 400, default: 'identicon' }))
    }
  })
})
</script>

<template>
  <div class="px-6">
    <ElModal v-if="mode === 'new'" :vis="mode === 'new'" modal-class="max-w-lg" @update:vis="mode = 'current'">
      <ElForm @submit="createNewOrganization()">
        <ToolForm v-model="newOrgForm" ui-size="lg" :card :options="toolFormOptions" :disable-group-hide="true" />
      </ElForm>
    </ElModal>
    <div v-else-if="mode === 'change'" class="p-12">
      <ElIndexGrid
        list-title="Publications You Are A Member Of"
        :list="list"
        :actions="[
          { name: 'Back', icon: 'i-tabler-arrow-left', btn: 'default', onClick: () => (mode = 'current') },
          { name: 'New', icon: 'i-tabler-plus', btn: 'primary', onClick: () => (mode = 'new') },
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
    </div>
    <ElHeader
      v-else
      :heading="service.fictionUser.activeOrganization.value?.orgName || 'Unnamed Organization'"
      :subheading="`Organization / ${service.fictionUser.activeOrganization.value?.orgEmail} / you are an ${service.fictionUser.activeOrganization.value?.relation?.memberAccess}`"
      :avatar="avatar"
      :actions="[{
        name: 'Change / Add Publication',
        icon: 'i-tabler-plus',
        onClick: () => mode = 'change',
      }]"
    />
  </div>
</template>
