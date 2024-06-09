<script lang="ts" setup>
import type { MenuGroup } from '@factor/api'
import { vue } from '@factor/api'
import AdminPage from '@factor/api/plugin-admin/AdminPage.vue'
import { useKaption } from '../../utils'

const { factorRouter } = useKaption()

const menu = vue.computed<MenuGroup[]>(() => {
  return [
    {
      groupName: 'Analytics',
      menu: [
        factorRouter.getRouteMenuItem('analyticsIndex', { useNiceName: true }),
        factorRouter.getRouteMenuItem('analyticsRealtime'),
        factorRouter.getRouteMenuItem('replayIndex'),
        factorRouter.getRouteMenuItem('heatmapIndex'),
        factorRouter.getRouteMenuItem('analyticsReports'),
        factorRouter.getRouteMenuItem('analyticsBehavior'),
        factorRouter.getRouteMenuItem('analyticsConversion'),
        factorRouter.getRouteMenuItem('analyticsTechnical'),
        factorRouter.getRouteMenuItem('analyticsSettings'),
      ],
    },
  ]
})
</script>

<template>
  <AdminPage :menu="menu" selected="analyticsIndex">
    <template #actions>
      <slot name="actions" />
    </template>

    <slot />
  </AdminPage>
</template>
