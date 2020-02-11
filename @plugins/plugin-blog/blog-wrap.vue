<template>
  <div class="plugin-blog">
    <component :is="setting(`blog.components.loading`)" v-if="loading" />
    <router-view v-else-if="blogPosts.length > 0 || !isIndexPage" />
    <component :is="setting(`blog.components.notFound`)" v-else />
  </div>
</template>

<script lang="ts">
import { stored } from "@factor/app/store"
import { setting } from "@factor/api/settings"
import { loadAndStoreBlogIndex } from "@factor/plugin-blog"
import Vue from "vue"

export default Vue.extend({
  data() {
    return {
      loading: false
    }
  },
  serverPrefetch() {
    if (!this.isIndexPage) return
    return this.getPosts()
  },
  computed: {
    isIndexPage(this: any) {
      return this.$route.meta.index ? true : false
    },
    index(this: any) {
      return stored("blog") || {}
    },
    blogPosts(this: any) {
      const { posts = [] } = this.index
      return posts
    },
    page(this: any) {
      return this.$route.query.page || 1
    }
  },
  watch: {
    $route: {
      handler: function(this: any) {
        this.getPosts()
      }
    }
  },
  mounted() {
    if (this.blogPosts.length == 0) {
      this.getPosts()
    }
  },
  methods: {
    setting,
    async getPosts(this: any) {
      if (!this.isIndexPage) return

      this.loading = true

      await loadAndStoreBlogIndex()

      this.loading = false
    }
  }
})
</script>
