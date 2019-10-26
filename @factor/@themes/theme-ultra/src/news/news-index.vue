<template>
  <div class="news-wrap">
    <div v-if="loading" class="loading-entries">
      <factor-loading-ring />
    </div>
    <div v-else-if="newsPosts.length > 0" class="news-posts">
      <section v-for="post in newsPosts" :key="post._id" class="news-item">
        <component
          :is="$setting.get(`news.components.${comp}`)"
          v-for="(comp, i) in $setting.get('news.layout.index')"
          :key="i"
          :post-id="post._id"
          format="index"
        />
      </section>
    </div>
    <div v-else class="posts-not-found">
      <div class="text">
        <div class="title">{{ $setting.get("news.notFound.title") }}</div>
        <div class="sub-title">{{ $setting.get("news.notFound.subTitle") }}</div>
      </div>
    </div>
    <component :is="$setting.get('news.components.pagination')" :post-type="postType" />
  </div>
</template>
<script>
import { requestPostIndex } from "@factor/post"
export default {
  data() {
    return {
      postType: "news",
      loading: false
    }
  },
  metaInfo() {
    const tag = this.$route.params.tag || ""
    const title = tag ? `Tag "${tag}"` : "Projects"

    const description = tag ? `Articles related to tag: ${tag}` : "News and more..."
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
    newsPosts() {
      const { posts = [] } = this.index
      return posts
    },
    page() {
      return this.$route.query.page || 1
    },
    returnLinkText() {
      return this.$setting.get("news.returnLinkText") || "All News"
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
        limit: this.$setting.get("news.limit")
      })

      this.loading = false
    }
  }
}
</script>

<style lang="less">
.news-posts {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 1fr 1fr;
  margin: 2rem auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}
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
