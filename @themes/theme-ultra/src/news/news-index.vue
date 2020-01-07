<template>
  <div class="news-wrap">
    <div v-if="newsPosts" class="news-posts">
      <section v-for="post in newsPosts" :key="post._id" class="news-item">
        <component
          :is="setting(`news.components.${comp}`)"
          v-for="(comp, i) in setting('news.layout.index')"
          :key="i"
          :post-id="post._id"
          format="index"
        />
      </section>
    </div>
    <div v-else class="posts-not-found">
      <div class="text">
        <div class="title">{{ setting("news.notFound.title") }}</div>
        <div class="sub-title">{{ setting("news.notFound.subTitle") }}</div>
      </div>
    </div>
    <component :is="setting('news.components.pagination')" :post-type="postType" />
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
    tag(this: any) {
      return this.$route.params.tag || this.$route.query.tag || ""
    },
    index(this: any) {
      return stored(this.postType) || {}
    },
    newsPosts(this: any) {
      const { posts = [] } = this.index
      return posts
    },
    page(this: any) {
      return this.$route.query.page || 1
    },
    returnLinkText() {
      return setting("news.returnLinkText") || "All News"
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
        limit: setting("news.limit")
      })

      this.loading = false
    }
  }
})
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
