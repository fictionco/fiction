<template>
  <blog-wrap class="entries">
    <div v-if="$route.params.tag" class="back-nav">
      <factor-link btn="default" path="/blog">
        <factor-icon icon="arrow-left" />All Posts
      </factor-link>
    </div>
    <div v-if="loading" class="loading-entries">
      <factor-loading-ring />
    </div>

    <div v-else class="post-index">
      <div
        v-for="(post, pi) in posts.data"
        :key="'key-'+pi"
        class="grid-item"
        :class="pi % 3 == 0 ? 'grid-entry' : 'grid-aside'"
      >
        <part-entry
          v-if="pi % 3 == 0"
          format="listing"
          :post="post"
          :authors="post.authorData"
          :title="post.title"
          :content="post.content"
          :date="post.date"
          :post-id="post.id"
          :loading="loading"
          :tags="post.tags"
          :path="$posts.getPermalink({type: post.type, permalink: post.permalink, root: false})"
        />
        <part-aside
          v-else
          format="aside"
          :title="post.title"
          :authors="post.authorData"
          :date="post.date"
          :tags="post.tags"
          :loading="loading"
          :images="post.images"
          :path="$posts.getPermalink({type: post.type, permalink: post.permalink, root: false})"
        />
      </div>
    </div>
    <!-- <part-pagination /> -->
  </blog-wrap>
</template>
<script>
export default {
  components: {
    "blog-wrap": () => import("./wrap"),
    "part-entry": () => import("./entry"),
    "part-aside": () => import("./aside"),
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
      : "Digital Nomad, Remote Work and Travel Lifestyle Articles"

    const description = tag
      ? `Articles related to tag: ${tag}`
      : "Learn about travel hacks, remote work, making money while you sleep, etc..."
    return {
      title,
      description
    }
  },
  serverPrefetch() {
    return this.getPosts()
  },
  computed: {
    posts() {
      return this.$store.getters["getItem"]("blog") || []
    }
  },
  watch: {
    $route: function(to) {
      this.getPosts()
    }
  },
  async mounted() {
    if (this.posts.length == 0) {
      await this.getPosts()
    }
  },

  methods: {
    async getPosts() {
      const tag = this.$route.params.tag || ""
      this.loading = true

      const r = await this.$posts.getPostIndex({
        type: "blog",
        tag,
        status: ["published"]
      })
      this.loading = false
    }
  }
}
</script>

<style lang="less">
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
    }
    .grid-aside {
      margin: 0 1em;
    }
  }
}
</style>