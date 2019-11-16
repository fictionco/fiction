<template>
  <div class="blog">
    <section>
      <div>
        <div>
          <div>{{ introPretitle }}</div>
          <h1>{{ introTitle }}</h1>
          <div v-formatted-text="introContent" />
        </div>
      </div>
    </section>
    <div class="entries">
      <component :is="setting('blog.components.blogReturnLink')" v-if="tag || page > 1" />
      <div v-if="loading" class="posts-loading">
        <factor-loading-ring />
      </div>
      <div v-else-if="blogPosts.length > 0">
        <div v-for="post in blogPosts" :key="post._id">
          <component
            :is="setting(`blog.components.${_component}`)"
            v-for="(_component, i) in setting('blog.layout.index')"
            :key="i"
            :post-id="post._id"
            format="index"
          />
        </div>
      </div>
      <div v-else class="posts-not-found">
        <div>
          <div>{{ setting("blog.notFound.title") }}</div>
          <div>{{ setting("blog.notFound.subTitle") }}</div>
        </div>
      </div>
      <component :is="setting('blog.components.pagination')" :post-type="postType" />
    </div>
  </div>
</template>
<script>
import { setting, stored } from "@factor/tools"
import { requestPostIndex } from "@factor/post"
import { factorLoadingRing } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLoadingRing
  },
  data() {
    return {
      postType: "blog",
      loading: false,
      introPretitle: setting("blog.intro.pretitle"),
      introTitle: setting("blog.intro.title"),
      introContent: setting("blog.intro.content")
    }
  },
  metaInfo() {
    const title = this.tag ? `Tag "${this.tag}"` : setting("blog.metatags.index.title")

    const description = this.tag
      ? `Articles related to tag: ${this.tag}`
      : setting("blog.metatags.index.description")

    return {
      title,
      description
    }
  },
  computed: {
    tag() {
      return this.$route.params.tag || this.$route.query.tag || ""
    },
    index() {
      return stored(this.postType) || {}
    },
    blogPosts() {
      const { posts = [] } = this.index
      return posts
    },
    page() {
      return this.$route.query.page || 1
    }
  },
  watch: {
    $route: {
      handler: function() {
        this.getPosts()
      }
    }
  },
  created() {},
  serverPrefetch() {
    return this.getPosts()
  },
  mounted() {
    if (this.blogPosts.length == 0) {
      this.getPosts()
    }
  },
  methods: {
    setting,
    async getPosts() {
      this.loading = true

      await requestPostIndex({
        postType: this.postType,
        tag: this.tag,
        status: "published",
        sort: "-date",
        page: this.page,
        limit: setting("blog.limit")
      })

      this.loading = false
    }
  }
})
</script>