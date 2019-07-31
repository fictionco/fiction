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
    <table-tabber :tabs="tabs" v-bind="$attrs" />
  </div>
</template>

<script>
export default {
  components: {
    "table-tabber": () => import("./el/tabber")
  },
  props: {
    tabs: { type: Array, default: () => [] },
    actions: { type: Array, default: () => [] },
    meta: { type: Object, default: () => {} },
    count: { type: Number, default: 0 },
    pageCurrent: { type: Number, default: 0 }
  },
  data() {
    return {
      action: ""
    }
  },
  computed: {},
  methods: {
    pageCount(total, limit) {
      if (total == 0) {
        return 1
      } else return Math.ceil(total / limit)
    }
  }
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