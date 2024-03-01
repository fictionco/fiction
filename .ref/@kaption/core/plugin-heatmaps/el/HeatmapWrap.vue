<script lang="ts" setup>
import type { MenuGroup } from '@factor/api'
import { vue } from '@factor/api'
import AdminPage from '@factor/api/plugin-admin/AdminPage.vue'
import { useKaption } from '../../utils'

const { factorRouter } = useKaption()

const menu = vue.computed<MenuGroup[]>(() => {
  return [
    {
      groupName: 'Replays',
      menu: [factorRouter.getRouteMenuItem('heatmapIndex')],
    },
  ]
})
</script>

<template>
  <AdminPage :menu="menu" selected="heatmapIndex">
    <template #actions>
      <slot name="actions" />
    </template>
    <slot />
  </AdminPage>
</template>
