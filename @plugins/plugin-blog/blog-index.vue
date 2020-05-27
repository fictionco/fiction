<template>
  <div class="blog-entries">
    <div v-if="loading" class="posts-loading">
      <factor-spinner />
    </div>
    <div v-else-if="blogPosts.length > 0" class="post-index">
      <return-link v-if="tag || page > 1" />
      <div v-for="post in blogPosts" :key="post._id" class="post">
        <featured-image :post-id="post._id" />
        <post-title :post-id="post._id" />
        <sub-title :post-id="post._id" />
        <post-meta :post-id="post._id" />
      </div>
      <pagination :post-type="postType" />
    </div>
    <div v-else class="posts-not-found">
      <div class="text">
        <div class="title">{{ notFoundTitle }}</div>
        <div class="sub-title">{{ notFoundSubTitle }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { factorSpinner } from "@factor/ui"
import { setting, stored } from "@factor/api"
export default {
  components: {
    factorSpinner,
    pagination: setting("blog.components.pagination"),
    returnLink: setting("blog.components.returnLink"),
    featuredImage: setting("blog.components.featuredImage"),
    postTitle: setting("blog.components.title"),
    postMeta: setting("blog.components.meta"),
    subTitle: setting("blog.components.subtitle"),
  },
  data() {
    return {
      postType: "blog",
      loading: false,
      notFoundTitle: setting("blog.notFound.title"),
      notFoundSubTitle: setting("blog.notFound.subTitle"),
      indexLayoutComponents: setting("blog.layout.index"),
    }
  },
  metaInfo(this: any) {
    const title = this.tag ? `Tag "${this.tag}"` : setting("blog.metatags.index.title")

    const description = this.tag
      ? `Tag: ${this.tag}`
      : setting("blog.metatags.index.description")

    return {
      title,
      description,
    }
  },
  computed: {
    tag(this: any) {
      return this.$route.params.tag || this.$route.query.tag || ""
    },
    page(this: any) {
      return this.$route.query.page || 1
    },
    index(this: any) {
      return stored(this.postType) || {}
    },
    blogPosts(this: any) {
      const { posts = [] } = this.index
      return posts
    },
  },

  methods: {
    setting,
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
