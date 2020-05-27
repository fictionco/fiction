<template>
  <div class="blog-entries">
    <div v-if="loading" class="posts-loading">
      <factor-spinner />
    </div>
    <div v-else-if="blogPosts.length > 0" class="post-index">
      <component :is="setting('blog.components.returnLink')" v-if="tag || page > 1" />
      <div v-for="post in blogPosts" :key="post._id" class="post">
        <component
          :is="setting(`blog.components.${comp}`)"
          v-for="(comp, i) in setting('blog.layout.index')"
          :key="i"
          :post-id="post._id"
        />
      </div>
      <component :is="setting('blog.components.pagination')" :post-type="postType" />
    </div>
    <div v-else class="posts-not-found">
      <div class="text">
        <div class="title">{{ setting("blog.notFound.title") }}</div>
        <div class="sub-title">{{ setting("blog.notFound.subTitle") }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { factorSpinner } from "@factor/ui"
import { setting, stored } from "@factor/api"
import { loadAndStoreBlogIndex } from "@factor/plugin-blog"
export default {
  components: { factorSpinner },
  data() {
    return {
      postType: "blog",
      loading: false,
    }
  },
  metaInfo(this: any) {
    const title = this.tag ? `Tag "${this.tag}"` : setting("blog.metatags.index.title")

    const description = this.tag
      ? `Articles related to tag: ${this.tag}`
      : setting("blog.metatags.index.description")

    return {
      title,
      description,
    }
  },
  serverPrefetch(this: any) {
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

<style lang="less" scoped>
.blog-entries {
  .post-index {
    max-width: 44rem;
    margin: 0 auto;
    padding: 1rem;
    .post {
      margin-bottom: 4em;
      &:last-child {
        margin-bottom: 2em;
      }
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
    .sub-title {
      color: var(--color-text-secondary);
    }
  }
}
</style>
