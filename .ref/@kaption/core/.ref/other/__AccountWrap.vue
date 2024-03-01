<script lang="ts" setup>
import type { MenuGroup } from '@factor/api'
import { vue } from '@factor/api'
import ElPage from '../ui/ElPage.vue'
import { useKaption } from '../utils'

const { factorRouter, factorUser } = useKaption()
const activeUser = factorUser.activeUser
const menu = vue.computed<MenuGroup[]>(() => {
  // const org = activeOrganization.value?.organizationName ?? "Current Org."
  return [
    {
      groupName: 'Account',
      menu: [factorRouter.getRouteMenuItem('accountSettings')],
    },
    {
      menu: [factorRouter.getRouteMenuItem('baseIndex')],
    },
  ]
})
</script>

<template>
  <ElPage :menu="menu" :sub-title="activeUser?.email">
    <template #actions>
      <slot name="actions" />
    </template>
    <slot />
  </ElPage>
</template>
