<template>
  <div class="posts-wrap">
    <div v-if="loading" class="loading-entries">
      <factor-loading-ring />
    </div>
    <div v-else-if="portfolioPosts.length > 0" class="portfolio-posts">
      <section v-for="post in portfolioPosts" :key="post._id" class="post card">
        <component
          :is="$setting.get(`portfolio.components.${comp}`)"
          v-for="(comp, i) in $setting.get('portfolio.layout.index')"
          :key="i"
          :post-id="post._id"
          format="index"
        />
      </section>
    </div>
    <div v-else class="posts-not-found">
      <div class="text">
        <div class="title">{{ $setting.get("portfolio.notFound.title") }}</div>
        <div class="sub-title">{{ $setting.get("portfolio.notFound.subTitle") }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { requestPostIndex } from "@factor/post"
export default {
  data() {
    return {
      postType: "portfolio",
      loading: false
    }
  },
  metaInfo() {
    const tag = this.$route.params.tag || ""
    const title = tag ? `Tag "${tag}"` : "Projects"

    const description = tag ? `Articles related to tag: ${tag}` : "Projects and more..."
    return {
      title,
      description
    }
  },
  serverPrefetch() {
    return this.getPosts()
  },
  computed: {
    tag() {
      return this.$route.params.tag || this.$route.query.tag || ""
    },
    index() {
      return this.$store.val(this.postType) || {}
    },
    portfolioPosts() {
      const { posts = [] } = this.index
      return posts
    },
    page() {
      return this.$route.query.page || 1
    },
    returnLinkText() {
      return this.$setting.get("portfolio.returnLinkText") || "All Projects"
    }
  },
  watch: {
    $route: {
      handler: function(to) {
        this.getPosts()
      }
    }
  },
  mounted() {
    this.getPosts()
  },
  methods: {
    async getPosts() {
      this.loading = true

      const r = await requestPostIndex({
        postType: this.postType,
        tag: this.tag,
        status: "published",
        sort: "-date",
        page: this.page,
        limit: this.$setting.get("portfolio.limit")
      })

      this.loading = false
    }
  }
}
</script>

<style lang="less">
.posts-wrap {
  .loading-entries {
    height: 50vh;
    padding: 5em;
  }
}
</style>
