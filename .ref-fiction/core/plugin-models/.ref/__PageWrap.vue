<script lang="ts" setup>
import type { MenuGroup } from '@factor/api'
import { vue } from '@factor/api'
import ProjectPage from '@kaption/core/ui/ProjectPage.vue'
import { useFictionApp } from '../../util'

const { factorRouter } = useFictionApp()

const menu = vue.computed<MenuGroup[]>(() => {
  return [
    {
      groupName: 'Events',
      menu: [
        factorRouter.getRouteMenuItem('modelIndex'),
        factorRouter.getRouteMenuItem('modelNew'),
      ],
    },
  ]
})
</script>

<template>
  <ProjectPage :menu="menu" selected="modelIndex">
    <template #actions>
      <slot name="actions" />
    </template>
    <slot />
  </ProjectPage>
</template>
