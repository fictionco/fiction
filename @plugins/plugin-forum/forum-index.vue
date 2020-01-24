<template>
  <div class="forum-entries">
    <component :is="setting('forum.components.returnLink')" v-if="tag || page > 1" />
    <div v-if="loading" class="forum-loading">
      <factor-loading-ring />
    </div>
    <div v-else-if="forumPosts.length > 0" class="topic-index">
      <div v-for="post in forumPosts" :key="post._id" class="topic">
        <component
          :is="setting(`forum.components.${comp}`)"
          v-for="(comp, i) in setting('forum.layout.index')"
          :key="i"
          :post-id="post._id"
        />
      </div>
    </div>
    <div v-else class="topics-not-found">
      <div class="text">
        <div class="title">{{ setting("forum.notFound.title") }}</div>
        <div class="sub-title">{{ setting("forum.notFound.subTitle") }}</div>
      </div>
    </div>
    <component :is="setting('forum.components.pagination')" :post-type="postType" />
  </div>
</template>
<script lang="ts">
import { factorLoadingRing } from "@factor/ui"
import { setting, stored } from "@factor/api"
import { requestPostIndex } from "@factor/post/request"
import Vue from "vue"
export default Vue.extend({
  components: { factorLoadingRing },
  data() {
    return {
      postType: "forum",
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
      return stored(this.postType) || {}
    },
    forumPosts(this: any) {
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
      this.loading = true

      await requestPostIndex({
        postType: this.postType,
        tag: this.tag,
        status: "published",
        sort: "-date",
        page: this.page,
        limit: setting("forum.limit")
      })

      this.loading = false
    }
  }
})
</script>

<style lang="less">
.plugin-forum {
  .forum-entries {
    .topic-index {
      max-width: 48rem;
      margin: 0 auto;
      .topic {
        margin-bottom: 4em;
      }
    }
    .topics-not-found,
    .posts-loading {
      min-height: 50vh;
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      .title {
        font-size: 1.4em;
        font-weight: 600;
      }
    }
  }
}
</style>
