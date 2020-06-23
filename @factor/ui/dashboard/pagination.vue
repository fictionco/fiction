<template>
  <div class="pagination">
    <div v-if="count && count > 0" class="items">{{ count }} Items</div>
    <template v-if="pageCount && pageCurrent">
      <dashboard-btn :disabled="pageCurrent == 1" @click="page('previous')">&larr;</dashboard-btn>
      <div class="sep">{{ pageCurrent }} of {{ pageCount }}</div>
      <dashboard-btn :disabled="pageCurrent == pageCount" @click="page('next')">&rarr;</dashboard-btn>
    </template>
  </div>
</template>

<script lang="ts">
import { dashboardBtn } from "@factor/ui"

export default {
  components: { dashboardBtn },
  props: {
    pageCount: { type: [Number, String], default: 0 },
    pageCurrent: { type: [Number, String], default: 0 },
    count: { type: [Number, String], default: 0 },
  },
  methods: {
    page(this: any, direction: string) {
      const current: number = Number.parseInt(this.pageCurrent)
      let page
      if (direction == "next" && current !== this.pageCount) {
        page = current + 1
      } else if (current > 1) {
        page = current - 1
      }

      if (page) {
        this.$router.push({ query: { ...this.$route.query, page } })
      }
    },
  },
}
</script>

<style lang="less">
.pagination {
  display: flex;
  align-items: center;

  > * {
    margin: 0 5px;
  }
  .sep {
    opacity: 0.4;
  }
  .factor-btn {
    padding: 0.5em;
  }
}
</style>
