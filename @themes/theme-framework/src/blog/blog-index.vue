<template>
  <div class="blog-entries">
    <el-hero :title="blogTitle">
      <template v-slot:hero-content>
        <div v-if="blogSubtitle" v-formatted-text="blogSubtitle" class="content" />
      </template>
    </el-hero>
    <component :is="setting('blog.components.returnLink')" v-if="tag" />
    <div v-if="loading" class="posts-loading">
      <factor-loading-ring />
    </div>
    <div v-else-if="blogPosts.length > 0" class="post-index">
      <div v-for="post in blogPosts" :key="post._id" class="post">
        <component
          :is="setting(`blog.components.${comp}`)"
          v-for="(comp, i) in setting('blog.layout.index')"
          :key="i"
          :post-id="post._id"
        />
      </div>
    </div>
    <div v-else class="posts-not-found">
      <div class="text">
        <div class="title">{{ setting("blog.notFound.title") }}</div>
        <div class="sub-title">{{ setting("blog.notFound.subTitle") }}</div>
      </div>
    </div>
    <component :is="setting('blog.components.pagination')" :post-type="postType" />
    <el-newsletter />
  </div>
</template>
<script lang="ts">
import { factorLoadingRing } from "@factor/ui"
import { setting, stored } from "@factor/api"
import { loadAndStoreBlogIndex } from "@factor/plugin-blog"

export default {
  components: {
    factorLoadingRing,
    "el-hero": () => import("../el/hero.vue"),
    "el-newsletter": () => import("../el/newsletter.vue"),
  },
  data() {
    return {
      postType: "blog",
      loading: false,
      blogTitle: setting("blog.title"),
      blogSubtitle: setting("blog.subtitle"),
    }
  },
  metaInfo() {
    const title = this.tag ? `Tag "${this.tag}"` : setting("blog.metatags.index.title")

    const description = this.tag
      ? `Articles related to tag: ${this.tag}`
      : setting("blog.metatags.index.description")

    return {
      title,
      description,
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
    blogPosts(this: any) {
      const { posts = [] } = this.index
      return posts
    },
    page(this: any) {
      return this.$route.query.page || 1
    },
  },
  watch: {
    $route: {
      handler: function (this: any) {
        this.getPosts()
      },
    },
  },
  mounted() {
    this.getPosts()
  },
  methods: {
    setting,
    async getPosts(this: any) {
      this.loading = true

      await loadAndStoreBlogIndex()

      this.loading = false
    },
  },
}
</script>

<style lang="less">
.plugin-blog {
  padding-bottom: 3rem;

  .entry-title {
    font-weight: 400;
  }

  .entry-meta {
    .widget-author-date .author-date {
      font-weight: 400;
    }
  }

  .blog-entries {
    .hero {
      text-align: center;
      margin-bottom: 3rem;
    }
    .post-index {
      max-width: 48rem;
      margin: 0 auto;
      .post {
        margin-bottom: 4em;
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
        font-weight: 600;
      }
    }
  }
}
</style>
