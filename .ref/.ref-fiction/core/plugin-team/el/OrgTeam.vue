<script lang="ts" setup>
import ElPanel from '@factor/ui/ElPanel.vue'
import type { FactorRouter } from '@factor/api'
import { useService, vue } from '@factor/api'
import AdminPageSettings from '../../plugin-admin/AdminPageSettings.vue'
import type { FactorTeam } from '..'
import MemberIndex from './MemberIndex.vue'

const { factorRouter, factorTeam } = useService<{
  factorRouter: FactorRouter
  factorTeam: FactorTeam
}>()

vue.onMounted(async () => {
  await factorTeam.loadMemberIndex()
})
</script>

<template>
  <AdminPageSettings access="manager">
    <ElPanel
      title="People in this Organization"
      :actions="[
        {
          name: 'Invite People',
          href: factorRouter.link('teamInvite').value,
          btn: 'primary',
        },
      ]"
    >
      <MemberIndex />
    </ElPanel>
  </AdminPageSettings>
</template>
