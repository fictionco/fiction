<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import type { TableCell } from '@fiction/ui/ElTable.vue'
import ElTable from '@fiction/ui/ElTable.vue'

import type { Card } from '@fiction/site/card'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { fictionUser } = useService()

const activeOrganizations = fictionUser.activeOrganizations
const formattedData = vue.computed(() => {
  if (!activeOrganizations.value)
    return []
  const rows = activeOrganizations.value.map((org) => {
    const memberAccess = org.relation?.memberAccess
    const canManage = fictionUser.priv.userCan({
      capability: 'canManage',
      memberAccess,
    })
    return [
      org.orgId,
      org.orgName,
      canManage ? org.members.length : '-',
      memberAccess,
      canManage
        ? ({
            type: 'link',
            text: 'Settings',
            path: (orgId: string) => props.card.link(`/settings/general?orgId=${orgId}`),
          } as const)
        : ({
            type: 'callback',
            text: 'Leave',
            callback: (_orgId: string) => {
              const _confirmed = confirm(
                'Are you sure you want to leave this organization?',
              )
              // TODO
            },
          } as const),
    ]
  })
  const r = [['', 'Name', 'Members', 'Relation', ''], ...rows] as TableCell[][]

  return r
})

async function handleRowClick(orgId: string) {
  const makeActive = activeOrganizations.value.find(
    o => orgId === o.orgId,
  )
  if (makeActive)
    await props.card.goto(`/?orgId=${orgId}`)
}
</script>

<template>
  <ElTable
    :table="formattedData"
    :on-row-click="handleRowClick"
    :empty="{
      title: 'No organizations found',
      description: 'Create one to get started',
    }"
  />
</template>
