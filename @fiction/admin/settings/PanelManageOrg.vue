<script lang="ts" setup>
import type { ActionButton, NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import { dayjs, getOrgAvatar, useService, vue } from '@fiction/core'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import ElOrgNewModal from './ElOrgNewModal.vue'
import SettingsPanel from './SettingsPanel.vue'

defineOptions({ name: 'PanelTeam' })

const { card } = defineProps<{ card: Card }>()

const service = useService()

const modalVisible = vue.ref(false)

const header = vue.computed(() => {
  return {
    title: 'Your Workspaces',
    subTitle: `Change active workspace, add, or remove workspaces`,
    media: {
      class: 'i-tabler-building-plus',
    },
    action: {
      buttons: [
        {
          testId: 'create-org-button',
          label: 'Add New Workspace',
          theme: 'primary' as const,
          icon: 'i-tabler-building-plus',
          onClick: () => (modalVisible.value = true),
        },
      ],
    },
  }
})

const sending = vue.ref('')
const list = vue.computed<NavListItem[]>(() => {
  const activeOrganizations = service.fictionUser.activeUser.value?.orgs || []
  const activeOrgId = service.fictionUser.activeOrgId.value

  return activeOrganizations.map((org) => {
    const label = org.orgName || 'Untitled'
    const role = org.relation?.memberAccess || 'Unknown'
    const joinedAt = org.relation?.createdAt

    const description = [
      `Role: ${role}`,
      `Joined ${joinedAt ? dayjs(joinedAt).format('MM/YY') : 'unknown'}`,
      `Created ${dayjs(org.createdAt).format('MM/YY')}`,
    ]

    const button: ActionButton = org.orgId === activeOrgId
      ? {
          label: 'Currently Active',
          theme: 'orange',
          hover: 'none',
          design: 'outline',
          icon: 'i-tabler-bolt',
        }
      : {
          label: 'Set to Active',
          theme: 'primary',
          icon: 'i-tabler-bolt',
          loading: sending.value === 'newOrg',
          onClick: async () => {
            const confirmed = confirm('Set this organization to active?')

            if (confirmed) {
              sending.value = 'newOrg'
              await service.fictionUser.setNewActiveOrgId({ orgId: org.orgId, caller: 'PanelManageOrg' })

              await card.goto('/settings')
              sending.value = ''
            }
          },
        }

    const isActive = org.orgId === activeOrgId
    return {
      key: org.orgId,
      label,
      description: description.join(' - '),
      media: getOrgAvatar(org),
      action: {
        buttons: [button],
      },
      isActive,
    } satisfies NavListItem
  })
})

const activeItemList = list.value.filter(item => item.isActive)
const otherItemList = list.value.filter(item => !item.isActive)
</script>

<template>
  <SettingsPanel title="Your Workspaces" :header>
    <div class="p-4 md:p-6 xl:p-12">
      <div class="space-y-6">
        <ElIndexGrid
          :list="activeItemList"
          list-title="Active Workspace"
          :zero="{
            title: 'No Workspaces',
            description: 'This user has no workspaces.',
            icon: 'i-tabler-building',
          }"
        />

        <ElIndexGrid
          :list="otherItemList"
          list-title="Other Workspaces"
          :zero="{
            title: 'No Additional Workspaces',
            description: 'Create more or request an invite to join a workspace.',
            icon: 'i-tabler-building',
          }"
        />
        <ElOrgNewModal :vis="modalVisible" :card @update:vis="modalVisible = $event" />
      </div>
    </div>
  </SettingsPanel>
</template>
