<template>
  <div class="blog-wrap">
    <div v-if="blogPosts.length > 0" class="blog-posts post-index">
      <div v-for="post in blogPosts" :key="post._id" class="blog-post rounded-lg hover:bg-white">
        <component
          :is="setting(`blog.components.${_component}`)"
          v-for="(_component, i) in setting('blog.layout.index')"
          :key="i"
          :post-id="post._id"
          format="index"
        />
      </div>
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
import { factorSpinner, factorLink, factorIcon } from "@factor/ui"
import { setting, stored } from "@factor/api"
import { loadAndStoreBlogIndex } from "@factor/plugin-blog"

import Vue from "vue"

export default Vue.extend({
  components: { factorSpinner, factorLink, factorIcon },
  data() {
    return {
      postType: "blog",
      loading: true,
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
    returnLinkText() {
      return setting("blog.returnLinkText") || "All Posts"
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
})
</script>

<style lang="less">
.blog-wrap {
  .blog-posts {
    margin: 0 auto;
  }
  .post-index {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
    margin: 2em 0;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }

    .blog-post {
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
        line-height: 1.4;
        margin: 1rem 0;
      }
      .edit {
        display: block;
        font-size: 1rem;
        font-weight: normal;
        letter-spacing: initial;
        color: var(--color-primary);
      }
      .content {
        font-size: 1.2rem;
        padding-bottom: 1rem;
      }
      .read-more {
        width: 100%;
        display: inline-block;
        font-size: 1em;
        opacity: 0;
        color: var(--color-primary);
        transform: translateY(1em);
        transition: 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
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
      font-weight: var(--font-weight-bold);
    }
  }
}
</style>
