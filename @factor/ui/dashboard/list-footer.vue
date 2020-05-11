<template>
  <div class="list-footer">
    <list-pagination
      :count="meta.totalForQuery"
      :page-count="pageCount(meta.totalForQuery, meta.limit)"
      :page-current="$route.query.page || 1"
    />
  </div>
</template>

<script lang="ts">
export default {
  components: {
    "list-pagination": () => import("./pagination.vue"),
  },
  props: {
    tabs: { type: Array, default: () => [] },
    actions: { type: Array, default: () => [] },
    meta: { type: Object, default: () => {} },
    count: { type: Number, default: 0 },
    pageCurrent: { type: Number, default: 0 },
  },
  data() {
    return {
      action: "",
    }
  },
  computed: {},
  methods: {
    pageCount(total: number, limit: number) {
      if (total == 0) {
        return 1
      } else return Math.ceil(total / limit)
    },
  },
}
</script>

<style lang="less">
.list-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2em 0 0;
  @media (max-width: 767px) {
    display: grid;
    padding: 1em 0;
  }
}
</style>
