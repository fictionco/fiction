<template>
  <div class="pagination">
    <div class="items">{{ count }} Items</div>
    <factor-btn :disabled="pageCurrent == 1" @click="page('previous')">
      <factor-icon icon="fas fa-arrow-left" />
    </factor-btn>
    <div class="sep">{{ pageCurrent }} of {{ pageCount }}</div>
    <factor-btn :disabled="pageCurrent == pageCount" @click="page('next')">
      <factor-icon icon="fas fa-arrow-right" />
    </factor-btn>
  </div>
</template>

<script lang="ts">
import { factorBtn, factorIcon } from "@factor/ui"
import { stored } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: { factorBtn, factorIcon },
  props: {
    postType: { type: String, default: "" }
  },
  computed: {
    index(this: any) {
      return stored(this.postType) || {}
    },
    blogMeta(this: any) {
      const { meta = [] } = this.index
      return meta
    },
    pageCount(this: any) {
      return this.blogMeta.pageCount || 1
    },
    count(this: any) {
      return this.blogMeta.totalForQuery || 1
    },
    pageCurrent(this: any) {
      return this.blogMeta.pageCurrent || 1
    }
  },
  methods: {
    page(this: any, direction: any) {
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
})
</script>

<style lang="less">
.plugin-blog {
  .pagination {
    max-width: 48rem;
    margin: 0 auto;
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
}
</style>
