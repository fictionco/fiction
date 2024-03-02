<script lang="ts" setup>
import { useService } from '@factor/api'
import type { FactorDashboard } from '..'
import DashboardEditWidget from './DashboardEditWidget.vue'
import DashboardNewWidget from './DashboardNewWidget.vue'
import DashboardNew from './DashboardNew.vue'

const { factorDashboard } = useService<{
  factorDashboard: FactorDashboard
}>()
</script>

<template>
  <DashboardNew v-model:vis="factorDashboard.newPanel.value" />
  <DashboardNewWidget
    v-model:vis="factorDashboard.newWidget.value"
    @add="factorDashboard.manageWidget('add', $event)"
  />
  <DashboardEditWidget
    v-model:vis="factorDashboard.editWidgetVisible.value"
    :widget="factorDashboard.editWidgetConfig.value"
    @update="factorDashboard.manageWidget('update', $event)"
  />
</template>
