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

<script>
export default {
  props: {
    pageCount: { type: Number, default: 0 },
    pageCurrent: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  methods: {
    page(direction) {
      let page
      if (direction == "next" && this.pageCurrent !== this.pageCount) {
        page = this.pageCurrent + 1
      } else if (this.pageCurrent > 1) {
        page = this.pageCurrent - 1
      }

      if (page) {
        this.$router.push({ query: { ...this.$route.query, page } })
      }
    }
  }
}
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