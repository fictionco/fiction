<script lang="ts" setup>
import type { OrganizationMember } from '@factor/api'
import { dayjs, vue } from '@factor/api'
import { useService } from '@factor/api/inject'
import type { FactorTeam } from '@factor/api/plugin-team'
import type { TableCell } from '@factor/ui/ElTable.vue'
import ElTable from '@factor/ui/ElTable.vue'
import ElPanelSettings from './ElPanelSettings.vue'

const { factorRouter, factorTeam, factorUser } = useService<{ factorTeam: FactorTeam }>()

function editLink(userId: string) {
  return factorRouter.link('settings', { itemId: 'teamEdit' }, { userId }).value
}

async function handleRowClick(userId: string) {
  await factorRouter.push(editLink(userId))
}

const loading = vue.ref(true)
const index = vue.ref<OrganizationMember[]>()

const formattedData = vue.computed(() => {
  const members = index.value || []
  const rows
    = members.map((member) => {
      return [
        member.userId,
        member.email,
        member.memberAccess,
        member.memberStatus,
        dayjs(member.lastSeenAt).format('MMM D, YYYY'),
        {
          type: 'link',
          name: 'settings',

          path: (userId: string) => { return editLink(userId) },
        } as const,
      ]
    }) || []
  const r = [
    ['', 'Email', 'Access', 'Status', 'Last Seen', ''],
    ...rows,
  ] as TableCell[][]

  return r
})

vue.onMounted(async () => {
  await factorUser.userInitialized()
  index.value = await factorTeam.loadMemberIndex()

  loading.value = false
})
</script>

<template>
  <ElPanelSettings
    access="manager"
    :actions="[
      {
        name: 'Invite People',
        link: factorRouter.link('settings', { itemId: 'teamInvite' }),
        btn: 'primary',
      },
    ]"
  >
    <div
      title="People in this Organization"
      :actions="[
        {
          name: 'Invite People',
          link: factorRouter.link('teamInvite'),
          btn: 'primary',
        },
      ]"
    >
      <ElTable
        :table="formattedData"
        :on-row-click="handleRowClick"
        :loading="loading"
        :empty="{
          title: 'No members found',
          description: 'Invite people and add to your team.',
        }"
      />
    </div>
  </ElPanelSettings>
</template>
