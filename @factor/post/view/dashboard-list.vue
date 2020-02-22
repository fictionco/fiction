<template>
  <dashboard-page :key="postType" class="posts-dashboard" :title="postTypeLabel">
    <template #actions>
      <factor-link
        v-if="!getPostTypeConfig.noAddNew"
        :path="`/dashboard/posts/${postType}/add-new`"
        btn="primary"
        data-test="add-post"
      >Add New &rarr;</factor-link>
    </template>

    <component
      :is="templateLoader"
      :list="posts"
      :meta="postsMeta"
      :loading="loading"
      :sending="sending"
      :post-type="postType"
    />
  </dashboard-page>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { requestPostIndex } from "@factor/post/request"
import { getPostTypeConfig, onEvent, stored } from "@factor/api"
import { dashboardPage } from "@factor/dashboard"
import { FactorPost } from "@factor/post/types"
import Vue, { Component } from "vue"
export default Vue.extend({
  components: { dashboardPage, factorLink },
  data() {
    return {
      loading: true,
      sending: false
    }
  },
  metaInfo() {
    return {
      title: this.postTypeLabel
    }
  },

  computed: {
    postIndex(this: any): FactorPost {
      return stored(this.postType) || []
    },
    getPostTypeConfig(this: any) {
      return getPostTypeConfig(this.postType)
    },
    templateLoader(this: any) {
      const { listTemplate } = this.getPostTypeConfig

      return listTemplate
        ? listTemplate
        : (): Promise<Component> => import("./posts-list.vue")
    },
    postType(this: any): string {
      return this.$route.params.postType || ""
    },
    postTypeLabel(this: any) {
      return this.getPostTypeConfig?.namePlural ?? ""
    },
    postsMeta(this: any) {
      return this.postIndex && this.postIndex.meta ? this.postIndex.meta : {}
    },
    posts(this: any) {
      return this.postIndex && this.postIndex.posts ? this.postIndex.posts : []
    },

    filters(this: any) {
      const postType = this.postType
      let { sort = "createdAt" } = this.$route.query
      const {
        page = 1,
        status,
        category,
        tag,
        role,
        direction = "descending"
      } = this.$route.query

      sort = { [sort]: direction }
      return { postType, page, status, category, tag, role, sort }
    }
  },
  watch: {
    $route: function(this: any) {
      this.setPosts()
    }
  },
  mounted() {
    this.setPosts()

    onEvent("refresh-table", () => {
      this.setPosts()
    })
  },
  methods: {
    async setPosts(this: any) {
      this.loading = true

      await requestPostIndex({ ...this.filters, cache: false })
      this.loading = false
    }
  }
})
</script>
<style lang="less">
.posts-dashboard {
  .post-title {
    > a {
      display: block;
    }
    .permalink {
      margin-top: 5px;
      opacity: 0.3;
      color: inherit;
      font-size: 10px;
      font-weight: 500;
    }
  }
}
</style>
