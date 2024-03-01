<script lang="ts" setup>
import type { FactorRouter, MenuGroup } from '@factor/api'
import { useService, vue } from '@factor/api'
import ElPage from '../ElPage.vue'

const { factorRouter } = useService<{ factorRouter: FactorRouter }>()

const menu = vue.computed<MenuGroup[]>(() => {
  return [
    {
      menu: [factorRouter.getRouteMenuItem('organizationIndex')],
    },
  ]
})
</script>

<template>
  <ElPage :menu="menu">
    <slot />
  </ElPage>
</template>
