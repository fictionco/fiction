<template>
  <div class="table-controls">
    <div class="bulk-actions">
      <factor-input-select v-model="action" placeholder="Bulk Actions" :list="['move-to-trash']" />
      <factor-btn :disabled="!action">Apply</factor-btn>
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
  .bulk-actions {
    display: flex;
    > * {
      margin-right: 10px;
    }
  }
}
</style>