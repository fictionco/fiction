<template>
  <blog-wrap class="entries">
    <div v-if="$route.params.tag" class="back-nav">
      <app-link btn="default" path="/blog">
        <factor-icon icon="arrow-left" />All Posts
      </app-link>
    </div>
    <div v-if="loading" class="loading-entries">
      <factor-loading-ring />
    </div>

    <div v-else-if="blogPosts.length > 0" class="post-index">
      <div
        v-for="(post, pi) in blogPosts"
        :key="post._id"
        class="grid-item"
        :class="pi % 3 == 0 ? 'grid-entry' : 'grid-aside'"
      >
        <blog-entry v-if="pi % 3 == 0" format="listing" :post-id="post._id" />
        <blog-aside v-else format="aside" :post-id="post._id" />
      </div>
    </div>
    <div v-else class="posts-not-found">
      <div class="text">
        <div class="title">{{ $setting.get("blog.notFound.title") }}</div>
        <div class="sub-title">{{ $setting.get("blog.notFound.subTitle") }}</div>
      </div>
    </div>
    <!-- <part-pagination /> -->
  </blog-wrap>
</template>
<script>
export default {
  components: {
    "blog-wrap": () => import("./wrap"),
    "blog-entry": () => import("./blog-entry"),
    "blog-aside": () => import("./blog-aside"),
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
    const tag = this.$route.params.tag || ""
    const title = tag
      ? `Tag "${tag}"`
      : this.$setting.get("blog.metatags.index.title")

    const description = tag
      ? `Articles related to tag: ${tag}`
      : this.$setting.get("blog.metatags.index.description")

    return {
      title,
      description
    }
  },
  serverPrefetch() {
    return this.getPosts()
  },
  computed: {
    index() {
      return this.$store.val("blog") || {}
    },
    blogPosts() {
      const { posts = [] } = this.index
      return posts
    }
  },
  watch: {
    $route: function(to) {
      this.getPosts()
    }
  },

  methods: {
    async getPosts() {
      const tag = this.$route.params.tag || ""
      this.loading = true

      const r = await this.$posts.getPostIndex({
        postType: "blog",
        tag,
        status: "published"
      })

      this.loading = false
    }
  }
}
</script>

<style lang="less">
.posts-not-found {
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
.entries {
  .grid-entry,
  .grid-aside {
    align-items: center;

    display: flex;
  }
  .back-nav {
    margin-bottom: 1em;
  }
  .splash {
    text-align: center;
    margin: 6em auto;
    max-width: 600px;
    font-size: 1.3em;
    .title {
      font-size: 2em;
      font-weight: 600;
    }
    .sub-title {
      font-size: 1.3em;
      margin: 1em 0;
      opacity: 0.4;
    }
    .action {
      margin-top: 2em;
    }
  }
  .loading-entries {
    height: 50vh;
    padding: 5em;
  }
}
.post-index {
  position: relative;
  z-index: 0;
  display: grid;
  grid-gap: 2em;
  grid-template-columns: 1fr 1fr 1fr;
  .entry {
    grid-column: span 1;
  }
  .grid-entry {
    grid-column: span 2;
    grid-row: span 2;
  }
  .grid-aside {
    grid-column: span 1;
  }
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    .grid-entry,
    .grid-aside {
      grid-column: span 2;
      grid-row: span 2;
      margin: 0 1em;
    }
    // .grid-aside {
    //   margin: 0 1em;
    // }
  }
}
</style>