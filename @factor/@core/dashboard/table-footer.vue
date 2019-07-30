<template>
  <div class="table-footer">
    <table-pagination
      :count="meta.total"
      :page-count="pageCount(meta.total, meta.limit)"
      :page-current="$route.query.page || 1"
    />
  </div>
</template>

<script>
export default {
  components: {
    "table-pagination": () => import("./el/pagination")
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
.table-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2em 0 0;
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