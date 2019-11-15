<template>
  <div class="grid-actions">
    <dashboard-input
      v-model="action"
      input="factor-input-select"
      placeholder="Actions"
      format="simple"
      :list="filteredActions"
    />
    <factor-btn-dashboard
      :disabled="!action"
      :loading="loading"
      @click="send($event)"
    >Apply</factor-btn-dashboard>
  </div>
</template>

<script>
import { dashboardInput } from "@factor/dashboard"
import { factorBtnDashboard } from "@factor/ui"
export default {
  components: { factorBtnDashboard, dashboardInput },
  props: {
    actions: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false }
  },
  data() {
    return {
      action: ""
    }
  },
  computed: {
    filteredActions() {
      return this.actions.filter(_ => !_.condition || _.condition(this.$route.query))
    }
  },
  methods: {
    send() {
      this.$emit("action", this.action)
      this.action = ""
    }
  }
}
</script>

<style lang="less">
.grid-actions {
  display: flex;

  > * {
    margin-right: 10px;
  }
  select {
    font-size: 14px;
  }
}
</style>
