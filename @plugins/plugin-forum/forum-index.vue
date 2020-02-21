<template>
  <div class="forum-index">
    <div class="index-layout">
      <component :is="setting('forum.components.forumSidebar')" />
      <div class="forum-content">
        <component
          :is="setting('forum.components.topicList')"
          :posts="indexPosts"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue"

import { setting, stored } from "@factor/api"
import { loadAndStoreIndex } from "./request"
import { postType } from "."
export default Vue.extend({
  data() {
    return {
      loading: false
    }
  },
  metaInfo() {
    const title = this.tag ? `Tag "${this.tag}"` : setting("forum.metatags.index.title")

    const description = this.tag
      ? `Articles related to tag: ${this.tag}`
      : setting("forum.metatags.index.description")

    return {
      title,
      description
    }
  },
  serverPrefetch() {
    return this.getPosts()
  },
  computed: {
    tag(this: any) {
      return this.$route.params.tag || this.$route.query.tag || ""
    },
    index(this: any) {
      return stored(postType) || []
    },
    indexPosts(this: any) {
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
    this.getPosts()
  },
  methods: {
    setting,
    async getPosts(this: any) {
      await loadAndStoreIndex()
    }
  }
})
</script>

<style lang="less">
.forum-index {
  .index-layout {
    display: grid;
    grid-template-columns: minmax(225px, 250px) 1fr;
    grid-gap: 2rem;
  }
}
</style>
