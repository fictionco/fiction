<template>
  <div class="dpg">
    <div class="dpg-content-pad">
      <div class="title-bar">
        <div class="page-title">{{ title }}</div>
        <div class="actions">
          <slot name="actions" />
        </div>
      </div>
      <dashboard-pane v-if="loading" class="dpg-loading">
        <factor-loading-ring width="4em" />
      </dashboard-pane>
      <div v-show="!loading" class="page-grid">
        <div class="col-primary">
          <slot name="primary" />
        </div>
        <div class="col-secondary">
          <slot name="secondary" />
        </div>
        <div class="col-meta">
          <slot name="meta" />
        </div>
      </div>

      <dashboard-footer />
    </div>
  </div>
</template>
<script lang="ts">
import { factorLoadingRing } from "@factor/ui"
import { dashboardPane } from "@factor/dashboard"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLoadingRing,
    dashboardPane,
    dashboardFooter: () => import("./footer.vue")
  },
  props: {
    title: { type: String, default: "" },
    loading: { type: Boolean, default: false }
  }
})
</script>

<style lang="less">
.dpg {
  .dpg-loading .loading-ring-wrap {
    height: 300px;
  }
  .title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
    padding: 1rem 0 0;
    .page-title {
      font-size: 1.5em;
      letter-spacing: -0.03em;
    }
  }

  .page-grid {
    display: grid;
    grid-template-columns: 1fr minmax(250px, 400px);
    grid-column-gap: 2rem;
    grid-template-areas:
      "primary   meta"
      "secondary meta";
    @media (max-width: 960px) {
      grid-template-columns: 1fr;
      grid-template-areas:
        "primary"
        "meta"
        "secondary";
    }

    .col-primary {
      grid-area: primary;
    }
    .col-secondary {
      grid-area: secondary;
    }
    .col-meta {
      grid-area: meta;
    }
  }
}
</style>
