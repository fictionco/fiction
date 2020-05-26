<template>
  <div class="pagination">
    <factor-btn :disabled="pageCurrent == 1" @click="page('previous')">&larr;</factor-btn>
    <div class="counter">
      {{ pageCurrent }}
      <span class="sep">/</span>
      {{ pageCount }}
    </div>
    <factor-btn :disabled="pageCurrent == pageCount" @click="page('next')">&rarr;</factor-btn>
  </div>
</template>

<script lang="ts">
import { factorBtn } from "@factor/ui"
import { stored } from "@factor/api"

export default {
  components: { factorBtn },
  props: {
    postType: { type: String, default: "" },
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
    },
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
    },
  },
}
</script>

<style lang="less">
.plugin-blog {
  .pagination {
    max-width: 48rem;
    padding: 1rem;
    margin: 0 auto 2em;
    display: flex;
    justify-content: center;
    align-items: center;
    @media (max-width: 767px) {
      justify-content: flex-end;
      .items,
      .counter {
        display: none;
      }
    }
    > * {
      margin: 0 5px;
    }
    .counter {
      opacity: 0.4;
      .sep {
        font-style: italic;
      }
    }
    .factor-btn {
      padding: 0.5em;
    }
  }
}
</style>
