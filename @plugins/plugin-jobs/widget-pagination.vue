<template>
  <div class="jobs-pagination">
    <div class="items">{{ count }} Items</div>
    <factor-btn :disabled="pageCurrent == 1" @click="page('previous')">
      <factor-icon icon="arrow-left" />
    </factor-btn>
    <div class="sep">{{ pageCurrent }} of {{ pageCount }}</div>
    <factor-btn :disabled="pageCurrent == pageCount" @click="page('next')">
      <factor-icon icon="arrow-right" />
    </factor-btn>
  </div>
</template>

<script>
export default {
  props: {
    postType: { type: String, default: "" }
  },
  computed: {
    index() {
      return this.$store.val(this.postType) || {}
    },
    jobsMeta() {
      const { meta = [] } = this.index
      return meta
    },
    pageCount() {
      return this.jobsMeta.pageCount || 1
    },
    count() {
      return this.jobsMeta.totalForQuery || 1
    },
    pageCurrent() {
      return this.jobsMeta.pageCurrent || 1
    }
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
.jobs-pagination {
  display: flex;
  align-items: center;
  margin-top: 2em;
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