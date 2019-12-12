<template>
  <div class="pagination">
    <div class="items">{{ count }} Items</div>
    <factor-btn-dashboard :disabled="pageCurrent == 1" @click="page('previous')">
      <factor-icon icon="arrow-left" />
    </factor-btn-dashboard>
    <div class="sep">{{ pageCurrent }} of {{ pageCount }}</div>
    <factor-btn-dashboard :disabled="pageCurrent == pageCount" @click="page('next')">
      <factor-icon icon="arrow-right" />
    </factor-btn-dashboard>
  </div>
</template>

<script lang="ts">
import { factorBtnDashboard, factorIcon } from "@factor/ui"
import Vue from "vue"

export default Vue.extend({
  components: { factorBtnDashboard, factorIcon },
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
