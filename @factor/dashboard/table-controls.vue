<template>
  <div class="table-controls">
    <div v-if="actions && actions.length > 0" class="bulk-actions">
      <dashboard-input
        v-model="action"
        input="factor-input-select"
        placeholder="Actions"
        format="simple"
        :list="actions"
      />
      <factor-btn-dashboard :disabled="!action" :loading="loading" @click="send($event)">Apply</factor-btn-dashboard>
    </div>
    <table-tabber :tabs="tabs" v-bind="$attrs" />
  </div>
</template>

<script lang="ts">
import { dashboardInput } from "@factor/dashboard"
import { factorBtnDashboard } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: {
    dashboardInput,
    factorBtnDashboard,
    "table-tabber": () => import("./el/tabber.vue")
  },
  props: {
    tabs: { type: Array, default: () => [] },
    actions: { type: Array, default: () => [] },
    postType: { type: String, default: "" },
    loading: { type: Boolean, default: false }
  },
  data() {
    return {
      action: ""
    }
  },
  methods: {
    send() {
      this.$emit("action", this.action)
      this.action = ""
    }
  }
})
</script>

<style lang="less">
.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em 0 1em;
  @media (max-width: 767px) {
    display: grid;
    padding: 0 0 1em;
  }
  .bulk-actions {
    display: flex;
    align-items: center;

    > * {
      margin-right: 10px;
    }
    select {
      font-size: 14px;
    }
  }
}
</style>
