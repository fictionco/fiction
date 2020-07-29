<template>
  <dashboard-page title="Dashboard">
    <dashboard-panel>
      <darwin-stats />
    </dashboard-panel>
  </dashboard-page>
</template>

<script lang="ts">
import { dashboardPage, dashboardPanel } from "@factor/ui"
export default {
  components: {
    dashboardPage,
    dashboardPanel,
    darwinStats: () => import("./el-stats.vue"),
  },
}
</script>
