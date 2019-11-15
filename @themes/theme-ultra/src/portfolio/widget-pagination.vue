<template>
  <div class="pagination">
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
import { factorBtn } from "@factor/ui"
import { stored } from "@factor/tools"
export default {
  components: { factorBtn },
  props: {
    postType: { type: String, default: "" },
    // pageCount: { type: Number, default: 0 },
    // pageCurrent: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  computed: {
    index() {
      return stored(this.postType) || {}
    },
    portfolioMeta() {
      const { meta = [] } = this.index
      return meta
    },
    pageCount() {
      return this.portfolioMeta.pageCount || 1
    },
    // count() {
    //   return this.portfolioMeta.totalForQuery || 1
    // },
    pageCurrent() {
      return this.portfolioMeta.pageCurrent || 1
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

<style lang="less" scoped>
.pagination {
  display: flex;
  align-items: center;
  @media (max-width: 900px) {
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
