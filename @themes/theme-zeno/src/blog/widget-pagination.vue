<template>
  <div class="max-w-6xl mx-auto">
    <!-- <div class="items">{{ count }} Items</div> -->
    <div class="flex justify-center align-center mt-4">
      <factor-btn v-if="pageCurrent > 1" :class="`primary mr-1`" @click="page('previous')">
        <factor-icon icon="fas fa-angle-left" />
        <span class="custom-uppercase">Prev</span>
      </factor-btn>
      <factor-btn v-if="pageCurrent < pageCount" class="primary ml-1" @click="page('next')">
        <span class="custom-uppercase">Next</span>
        <factor-icon icon="fas fa-angle-right" />
      </factor-btn>
    </div>
    <div class="flex justify-center align-center mt-4">
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
