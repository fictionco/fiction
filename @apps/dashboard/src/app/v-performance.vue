<template>
  <dashboard-page title="Performance Analytics">
    <dashboard-panel>
      <dashboard-chart />
    </dashboard-panel>
  </dashboard-page>
</template>

<script lang="ts">
import { dashboardPage, dashboardPanel } from "@factor/ui"
export default {
  components: {
    dashboardPage,
    dashboardPanel,
    dashboardChart: () => import("../el/chart.vue"),
  },
}
</script>
