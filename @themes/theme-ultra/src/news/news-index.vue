<template>
  <div class="news-wrap">
    <div v-if="newsPosts" class="news-posts">
      <section
        v-for="post in newsPosts"
        :key="post._id"
        class="news-item rounded-lg hover:bg-white"
      >
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

  .news-item {
    position: relative;
    height: 100%;
    padding: 3rem 2rem;
    border: 1px solid rgba(17, 16, 16, 0.1);
    transition: 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);

    &:hover {
      color: var(--color-text);
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);

      .read-more {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .title {
      font-size: 1.4rem;
      font-weight: var(--font-weight-semibold);
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin: 1.5rem 0 1rem;
    }
    .content {
      font-size: 1.2rem;
      padding-bottom: 1rem;
    }
    .read-more {
      position: absolute;
      left: 0;
      width: 100%;
      display: inline-block;
      padding: 0 2rem;
      font-size: 1.2em;
      opacity: 0;
      transform: translateY(1em);
      transition: 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
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
