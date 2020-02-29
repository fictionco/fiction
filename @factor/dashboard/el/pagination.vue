<template>
  <div class="pagination">
    <div v-if="count && count > 0" class="items">{{ count }} Items</div>
    <template v-if="pageCount && pageCurrent">
      <factor-btn-dashboard :disabled="pageCurrent == 1" @click="page('previous')">&larr;</factor-btn-dashboard>
      <div class="sep">{{ pageCurrent }} of {{ pageCount }}</div>
      <factor-btn-dashboard :disabled="pageCurrent == pageCount" @click="page('next')">&rarr;</factor-btn-dashboard>
    </template>
  </div>
</template>

<script lang="ts">
import { factorBtnDashboard } from "@factor/ui"
import Vue from "vue"

export default Vue.extend({
  components: { factorBtnDashboard },
  props: {
    pageCount: { type: Number, default: 0 },
    pageCurrent: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  methods: {
    page(this: any, direction: string) {
      const current: number = parseInt(this.pageCurrent)
      let page
      if (direction == "next" && current !== this.pageCount) {
        page = current + 1
      } else if (current > 1) {
        page = current - 1
      }

      if (page) {
        this.$router.push({ query: { ...this.$route.query, page } })
      }
    }
  }
})
</script>

<style lang="less">
.pagination {
  display: flex;
  align-items: center;
  @media (max-width: 767px) {
    justify-content: flex-end;
    .items,
    .sep {
      display: none;
    }
  }
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
