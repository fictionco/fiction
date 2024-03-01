<script lang="ts" setup>
import type { TableCell } from '@factor/ui/ElTable.vue'
import ElTable from '@factor/ui/ElTable.vue'
import type {
  FactorRouter,
  FactorUser,
  OrganizationMember,
} from '@factor/api'
import {
  dayjs,
  useService,
  vue,
} from '@factor/api'
import type { FactorTeam } from '..'

const { factorRouter, factorTeam, factorUser } = useService<{
  factorRouter: FactorRouter
  factorTeam: FactorTeam
  factorUser: FactorUser
}>()

async function handleRowClick(userId: string) {
  const link = factorRouter.link('teamMember', {
    userId,
  }).value

  await factorRouter.router.push(link)
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
          path: (userId: string) =>
            factorRouter.link('teamMember', { userId }).value || '',
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
  <ElTable
    :table="formattedData"
    :on-row-click="handleRowClick"
    :loading="loading"
    :empty="{
      title: 'No members found',
      description: 'You can invite some to add more.',
    }"
  />
</template>
