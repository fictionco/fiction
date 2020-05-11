<template>
  <div class="topic-pagination">
    <div class="items">{{ count }} Items</div>
    <factor-btn :disabled="pageCurrent == 1" @click="page('previous')">&larr;</factor-btn>
    <div class="sep">{{ pageCurrent }} of {{ pageCount }}</div>
    <factor-btn :disabled="pageCurrent == pageCount" @click="page('next')">&rarr;</factor-btn>
  </div>
</template>

<script lang="ts">
import { factorBtn } from "@factor/ui"
import { stored } from "@factor/api"
import { postType } from ".."

export default {
  components: { factorBtn },

  computed: {
    index(this: any) {
      return stored(postType) || {}
    },
    forumMeta(this: any) {
      const { meta = [] } = this.index
      return meta
    },
    pageCount(this: any) {
      return this.forumMeta.pageCount || 1
    },
    count(this: any) {
      return this.forumMeta.totalForQuery || 1
    },
    pageCurrent(this: any) {
      return this.forumMeta.pageCurrent || 1
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
.topic-pagination {
  max-width: 48rem;
  margin: 5em auto 1em;
  display: flex;
  align-items: center;
  justify-content: center;
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
