<script lang="ts" setup>
import type { ActionButton, NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import { dayjs, useService, vue } from '@fiction/core'
import { getOrgAvatar } from '@fiction/core/plugin-user/utils'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import ElOrgNewModal from './ElOrgNewModal.vue'

const { card } = defineProps<{
  card: Card
}>()

const service = useService()

const modalVisible = vue.ref(false)

const list = vue.computed<NavListItem[]>(() => {
  const activeOrganizations = service.fictionUser.activeOrganizations.value
  return activeOrganizations.map((org) => {
    const label = org.orgName || 'Untitled'
    const role = org.relation?.memberAccess || 'Unknown'
    const joinedAt = org.relation?.createdAt

    const description = [
      `Role: ${role}`,
      `Joined ${joinedAt ? dayjs(joinedAt).format('MM/YY') : 'unknown'}`,
      `Created ${dayjs(org.createdAt).format('MM/YY')}`,
    ]

    const button: ActionButton = org.loadOrgId
      ? {
          label: 'Currently Active',
          theme: 'primary',
          hover: 'none',
          design: 'outline',
          icon: 'i-tabler-bolt',
        }
      : {
          label: 'Set to Active',
          theme: 'primary',
          icon: 'i-tabler-bolt',
          onClick: () => {
            const confirmed = confirm('Set this organization to active?')
          },
        }

    return {
      key: org.orgId,
      label,
      description: description.join(' - '),
      media: getOrgAvatar(org),
      action: {
        buttons: [button],
      },
      isActive: org.loadOrgId,
    } satisfies NavListItem
  })
})

const activeItemList = list.value.filter(item => item.isActive)
const otherItemList = list.value.filter(item => !item.isActive)
</script>

<template>
  <div class="space-y-6">
    <ElIndexGrid
      :list="activeItemList"
      list-title="Active Organization"
      :zero="{
        title: 'No Organizations',
        description: 'This user has no organizations.',
        icon: 'i-tabler-building',
      }"
    />

    <ElIndexGrid
      :list="otherItemList"
      :action="{
        buttons: [{
          label: 'Add New Organization',
          theme: 'primary',
          icon: 'i-tabler-building-plus',
          onClick: () => (modalVisible = true),
        }],
      }"
      list-title="Other Organizations"
      :zero="{
        title: 'No Additional Organizations',
        description: 'Create more or request an invite to join an organization.',
        icon: 'i-tabler-building',
      }"
    />
    <ElOrgNewModal :vis="modalVisible" :card @update:vis="modalVisible = $event" />
  </div>
</template>
