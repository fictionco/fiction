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
      <dashboard-btn :disabled="!action" @click="$emit('action', action)">Apply</dashboard-btn>
    </div>
    <table-tabber :tabs="tabs" />
    <table-pagination
      :total="filtered.total"
      :page-total="filtered.pageTotal"
      :page-current="filtered.pageCurrent"
    />
  </div>
</template>

<script>
export default {
  components: {
    "table-pagination": () => import("./el/pagination"),
    "table-tabber": () => import("./el/tabber")
  },
  props: {
    tabs: { type: Array, default: () => [] },
    actions: { type: Array, default: () => [] },
    filtered: { type: Object, default: () => {} }
  },
  data() {
    return {
      action: ""
    }
  },
  computed: {}
}
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
    > * {
      margin-right: 10px;
    }
    select {
      font-size: 14px;
    }
  }
}
</style>