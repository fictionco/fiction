<script lang="ts" setup>
import { useService, vue } from '@factor/api'
import type { FactorDashboard } from '..'

const { factorDashboard } = useService<{
  factorDashboard: FactorDashboard
}>()

const controls = vue.computed(() => {
  return factorDashboard.activeDashboard.value?.controls
})

const pageComponent = vue.computed(() => {
  const comp = factorDashboard.activeDashboard.value?.pageComponent
  return (
    comp
    || (vue.defineAsyncComponent(
      () => import(`./DashboardPage.vue`),
    ) as vue.Component)
  )
})
</script>

<template>
  <component :is="pageComponent" :controls="controls" />
</template>
