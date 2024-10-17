<script lang="ts" setup>
import type { OrganizationMember } from '@fiction/core'
import type { FictionTeam } from '@fiction/core/plugin-team'
import type { Card } from '@fiction/site/card'

import type { TableCell } from '@fiction/ui/ElTable.vue'
import type { NavCardUserConfig } from '../index.js'
import { dayjs, vue } from '@fiction/core'
import { useService } from '@fiction/core/inject'
import ElTable from '@fiction/ui/ElTable.vue'
import ElPanelSettings from './ElPanelSettings.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<NavCardUserConfig>>, required: true },
})

const { fictionTeam, fictionUser } = useService<{ fictionTeam: FictionTeam }>()

function editLink(userId: string) {
  return props.card.link({ path: `/settings/team-edit`, query: { userId } })
}

async function handleRowClick(userId: string) {
  const link = editLink(userId)

  await props.card.goto(link)
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
          name: 'User Settings &rarr;',
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
  await fictionUser.userInitialized({ caller: 'ViewTeamIndex' })
  index.value = await fictionTeam.loadMemberIndex()

  loading.value = false
})
</script>

<template>
  <ElPanelSettings
    access="manager"
    :actions="[
      {
        name: 'Invite More People',
        href: card.link(`/settings/team-invite`),
        theme: 'primary',
      },
    ]"
  >
    <ElTable
      :table="formattedData"
      :on-row-click="handleRowClick"
      :loading="loading"
      :empty="{ title: 'No members found', description: 'Invite people and add to your team.' }"
    />
  </ElPanelSettings>
</template>
