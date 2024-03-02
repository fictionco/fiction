<script lang="ts" setup>
import type {
  FactorRouter,
} from '@factor/api'
import {
  useService,
} from '@factor/api'
import AdminPage from '../../plugin-admin/AdminPage.vue'
import type { FactorDashboard } from '..'

defineProps({
  title: { type: String, default: '' },
})
const { factorDashboard } = useService<{
  factorRouter: FactorRouter
  factorDashboard: FactorDashboard
}>()
</script>

<template>
  <AdminPage selected="dashboard" :nav="factorDashboard.editActions.value">
    <slot />
  </AdminPage>
</template>
