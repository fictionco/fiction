<template>
  <div class="dpg">
    <div class="dpg-content-pad">
      <dashboard-pane v-if="loading" class="dpg-loading">
        <factor-loading-ring width="4em" />
      </dashboard-pane>
      <div v-show="!loading" class="dpg-content-area">
        <slot />
      </div>

      <dashboard-footer />
    </div>
  </div>
</template>
<script>
import { factorLoadingRing } from "@factor/ui"
import { dashboardPane } from "@factor/dashboard"
export default {
  components: {
    factorLoadingRing,
    dashboardPane,
    "dashboard-footer": () => import("./footer.vue")
  },
  props: {
    title: { type: String, default: "" },
    loading: { type: Boolean, default: false }
  }
}
</script>

<style lang="less">
.dpg {
  .dpg-loading .loading-ring-wrap {
    height: 300px;
  }
  .dpg-title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
  }

  .dpg-content-pad {
    position: relative;
    min-height: 450px;
  }
  .dpg-content-area {
    .dashboard-pane:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
