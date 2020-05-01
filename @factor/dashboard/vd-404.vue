<template>
  <dashboard-page>
    <dashboard-pane>
      <div class="four04">
        <div class="pad">
          <div class="title">Not Found (404)</div>
        </div>
      </div>
    </dashboard-pane>
  </dashboard-page>
</template>

<script lang="ts">
import { dashboardPage, dashboardPane } from "@factor/dashboard"
import Vue from "vue"

export default Vue.extend({
  components: {
    dashboardPage,
    dashboardPane,
  },
})
</script>

<style lang="less">
.four04 {
  height: 60vh;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  .title {
    font-size: 1.5em;
    letter-spacing: -0.03em;
    margin-bottom: 1em;
    font-weight: var(--font-weight-bold, 700);
  }
}
</style>
