<script lang="ts" setup>
import type { MenuGroup } from '@factor/api'
import { vue } from '@factor/api'
import AdminPage from '@factor/api/plugin-admin/AdminPage.vue'
import { useKaption } from '../../utils'

const { factorRouter } = useKaption()

const menu = vue.computed<MenuGroup[]>(() => {
  return [
    {
      groupName: 'Events',
      menu: [
        factorRouter.getRouteMenuItem('eventIndex'),
        factorRouter.getRouteMenuItem('eventOverview', {
          item: { name: 'Tracked Events' },
        }),
        factorRouter.getRouteMenuItem('eventNew'),
      ],
    },
  ]
})
</script>

<template>
  <AdminPage :menu="menu" selected="eventIndex">
    <template #actions>
      <slot name="actions" />
    </template>
    <slot />
  </AdminPage>
</template>
