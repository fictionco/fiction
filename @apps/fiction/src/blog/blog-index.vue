<template>
  <div class="blog">
    <section class="blog-splash">
      <div class="splash mast">
        <div>
          <div class="label label-white">Discover The Latest</div>
          <h1 class="title">Fiction Blog</h1>
          <p class="subtitle">Product updates, articles, and announcements from the Fiction team.</p>
        </div>
      </div>
    </section>
    <section class="blog-posts">
      <div class="blog-posts-inner">
        <div class="blog-entries">
          <component :is="setting('blog.components.blogReturnLink')" v-if="tag || page > 1" />
          <div v-if="loading" class="posts-loading">
            <factor-loading-ring />
          </div>
          <div v-else-if="blogPosts.length > 0" class="post-index">
            <div v-for="post in blogPosts" :key="post._id" class="blog-post">
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
          <component :is="setting('blog.components.pagination')" :post-type="postType" />
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { factorLoadingRing } from "@factor/ui"
import { setting, stored } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorLoadingRing },
  data() {
    return {
      postType: "blog",
      loading: false
    }
  },
  routeClass() {
    return "nav-white"
  },
  metaInfo() {
    const title = this.tag ? `Tag "${this.tag}"` : setting("blog.metatags.index.title")

    const description = this.tag
      ? `Articles related to tag: ${this.tag}`
      : setting("blog.metatags.index.description")

    return {
      title,
      description
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
    }
  },

  methods: { setting }
})
</script>

<style lang="less">
.plugin-blog {
  .blog-splash {
    background: #1b223c url(./rectangles-pink.svg) no-repeat center center;
    background-size: 80%;
    @media (max-width: 767px) {
      background-size: 100%;
    }
    .splash {
      display: grid;
      grid-template-columns: 1fr;
      grid-column-gap: 60px;
      align-items: center;
      text-align: left;
      max-width: 50rem;
      padding: 7em 0;
      margin: 0 auto;
      @media (max-width: 767px) {
        padding: 6em 2em 6em;
      }
      .label {
        text-transform: uppercase;
        letter-spacing: 0.1em;
        &.label-white {
          color: #fff;
          opacity: 0.4;
        }
      }
      .title {
        font-weight: var(--font-weight-bold);
        font-size: 3em;
        letter-spacing: -0.03em;
        line-height: 1.2;
        margin: 0.3em 0;
        color: #f9f9f9;
        @media (max-width: 767px) {
          font-size: 2.6em;
        }
      }
      .subtitle {
        opacity: 0.7;
        font-size: 1.4em;
        line-height: 1.6em;
        font-weight: 400;
        margin-bottom: 1.5em;
        color: #fff;

        @media (max-width: 767px) {
          font-size: 1.2em;
        }
      }
    }
  }
  .blog-posts-inner {
    max-width: 800px;
    margin: -80px auto 0;
    background: #fff;
    border-radius: 0.5em;
    padding: 3em;
    @media (max-width: 767px) {
      padding: 1em;
      margin-left: 1em;
      margin-right: 1em;
    }

    .post-index {
      .blog-post {
        padding-bottom: 1.5em;
        margin-bottom: 1.5em;
        border-bottom: 1px solid rgba(80, 102, 119, 0.1);
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
}
</style>
