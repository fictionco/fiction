<template>
  <div class="pagination mast">
    <!-- <div class="items">{{ count }} Items</div> -->
    <div class="prev-next flex justify-center align-center mt-4">
      <factor-btn v-if="pageCurrent > 1" :class="`primary prev`" @click="page('previous')">
        <factor-icon icon="fas fa-angle-left" />
        <span class="custom-uppercase">Prev</span>
      </factor-btn>
      <factor-btn v-if="pageCurrent < pageCount" class="primary next" @click="page('next')">
        <span class="custom-uppercase">Next</span>
        <factor-icon icon="fas fa-angle-right" />
      </factor-btn>
    </div>
    <div class="page-count">
      <div class="sep">{{ pageCurrent }} / {{ pageCount }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { factorBtn, factorIcon } from "@factor/ui"
import { stored } from "@factor/api"

export default {
  components: { factorBtn, factorIcon },
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
    page(direction: any) {
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
    .page-count,
    .prev-next {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 1rem;
    }
    .prev-next {
      .prev {
        margin-right: 0.25rem;
      }
      .next {
        margin-left: 0.25rem;
      }
    }
  }
}
</style>
