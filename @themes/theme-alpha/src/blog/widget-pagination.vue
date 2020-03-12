<template>
  <div class="pagination">
    <div>
      <factor-btn
        v-if="pageCurrent > 1"
        btn="primary"
        :class="`rounded-full`"
        @click="page('previous')"
      >
        <factor-icon icon="fas fa-angle-left" />
        <span class="custom-uppercase">Prev</span>
      </factor-btn>
      <factor-btn
        v-if="pageCurrent < pageCount"
        btn="primary"
        class="rounded-full"
        @click="page('next')"
      >
        <span class="custom-uppercase">Next</span>
        <factor-icon icon="fas fa-angle-right" />
      </factor-btn>
    </div>
    <div>
      <div class="sep">{{ pageCurrent }} / {{ pageCount }}</div>
    </div>
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
    display: flex;
    justify-content: center;
    padding: 2rem 0 0;
    > div {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 1rem;
      margin-left: 0.5rem;
      margin-right: 0.5rem;

      button.app-btn.primary:hover {
        background: var(--color-primary-dark);
      }
    }
    .factor-btn {
      padding: 0.7em 1.4em;
    }
  }
}
</style>