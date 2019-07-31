<template>
  <blog-content class="entries">
    <div v-if="loading" class="posts-loading">
      <factor-loading-ring />
    </div>
    <div v-else-if="blogPosts.length > 0" class="post-index">
      <div v-for="(post) in blogPosts" :key="post._id" class="grid-item grid-entry">
        <blog-entry format="listing" :post-id="post._id" />
      </div>
    </div>
    <div v-else class="posts-not-found">
      <div class="text">
        <div class="title">{{ $setting.get("blog.notFound.title") }}</div>
        <div class="sub-title">{{ $setting.get("blog.notFound.subTitle") }}</div>
      </div>
    </div>
    <!-- <part-pagination /> -->
  </blog-content>
</template>
<script>
export default {
  components: {
    "blog-content": () => import("./blog-content"),
    "blog-entry": () => import("./blog-entry"),
    "part-pagination": () => import("./pagination")
  },
  data() {
    return {
      loading: false,
      parsedPosts: [{}, {}, {}],
      storeKey: "index"
    }
  },
  metatags() {
    const title = this.tag
      ? `Tag "${this.tag}"`
      : this.$setting.get("blog.metatags.index.title")

    const description = this.tag
      ? `Articles related to tag: ${this.tag}`
      : this.$setting.get("blog.metatags.index.description")

    return {
      title,
      description
    }
  },
  // serverPrefetch() {
  //   return this.getPosts()
  // },
  computed: {
    tag() {
      return this.$route.params.tag || this.$route.query.tag || ""
    },
    index() {
      return this.$store.val("blog") || {}
    },
    blogPosts() {
      const { posts = [] } = this.index
      return posts
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler: function(to) {
        this.getPosts()
      }
    }
  },
  mounted() {
    //  this.getPosts()
  },
  methods: {
    async getPosts() {
      const tag = this.$route.params.tag || ""
      this.loading = true

      const r = await this.$posts.getPostIndex({
        postType: "blog",
        tag,
        status: "published",
        sort: "-date"
      })

      this.loading = false
    }
  }
}
</script>

<style lang="less">
.posts-not-found,
.posts-loading {
  min-height: 50vh;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  .title {
    font-size: 1.4em;
    font-weight: var(--font-weight-bold);
  }
}
</style>