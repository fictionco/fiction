<template>
  <div class="forum-index">
    <div class="index-layout">
      <component :is="setting('forum.components.forumSidebar')" />
      <div class="forum-content">
        <factor-spinner v-if="loading" />
        <component
          :is="setting('forum.components.topicList')"
          v-else
          :posts="indexPosts"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import { factorSpinner } from "@factor/ui"
import { setting, stored } from "@factor/api"
import { loadAndStoreIndex } from "./request"
import { postType } from "."
export default Vue.extend({
  components: {
    factorSpinner,
  },
  data() {
    return {
      loading: false,
    }
  },
  metaInfo() {
    let title = setting("forum.metatags.index.title")
    let description = setting("forum.metatags.index.description")

    if (this.tag) {
      title = `Tag "${this.tag}"`
      description = `Topics related to tag ${this.tag}`
    } else if (this.category) {
      title = `Category "${this.category}"`
      description = `Topics in category ${this.category}`
    }

    if (this.page > 1) {
      title = `${title} - Page ${this.page}`
    }

    return {
      title,
      description,
    }
  },
  serverPrefetch(this: any) {
    return this.getPosts()
  },
  computed: {
    tag(this: any) {
      return this.$route.params.tag || this.$route.query.tag || ""
    },
    category(this: any) {
      return this.$route.params.category || this.$route.query.category || ""
    },
    index(this: any) {
      return stored(postType) || []
    },
    indexPosts(this: any) {
      const { posts = [] } = this.index
      return posts
    },
    page(this: any) {
      return Number.parseInt(this.$route.query.page) || 1
    },
  },
  watch: {
    $route: {
      handler: function (this: any) {
        this.getPosts()
      },
    },
  },
  async mounted() {
    await this.getPosts()
  },
  methods: {
    setting,
    async getPosts(this: any) {
      this.loading = true
      await loadAndStoreIndex()
      this.loading = false
    },
  },
})
</script>

<style lang="less">
.forum-index {
  .index-layout {
    display: grid;
    grid-template-columns: minmax(225px, 250px) 1fr;
    grid-gap: 1rem 2rem;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }
  .forum-content {
    > .spinner-wrap {
      padding: 3rem;
    }
  }
}
</style>
