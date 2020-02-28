<template>
  <div class="blog">
    <el-hero
      v-if="page == 1 && !tag"
      :pretitle="setting('blog.headline')"
      :title="setting('blog.subheadline')"
      :image="setting('blog.heroImage')"
    >
      <template v-slot:hero-content>
        <div v-formatted-text="setting('blog.content')" class="content text-gray-600" />
      </template>
    </el-hero>

    <section v-else-if="tag" class="hero">
      <div class="mast">
        <div class="hero-inner">
          <div class="return-link">
            <factor-link
              class="pretitle back label label-primary"
              :path="setting('blog.indexRoute')"
            >
              <factor-icon icon="fas fa-arrow-left" />
              {{ returnLinkText }}
            </factor-link>
            <h2 class="title">Tag: {{ tag }}</h2>
          </div>
        </div>
      </div>
    </section>

    <section class="blog-posts">
      <div class="blog-posts-inner">
        <div class="blog-entries">
          <div v-if="blogPosts.length > 0" class="post-index">
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
          <component :is="setting('blog.components.pagination')" :post-type="postType" />
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { factorLoadingRing, factorLink, factorIcon } from "@factor/ui"
import { setting, stored } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: {
    factorLoadingRing,
    factorLink,
    factorIcon,
    "el-hero": () => import("../el/hero.vue")
  },
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
      description,
      image: setting("blog.metatags.index.image")
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
    tagsList(this: any) {
      return this.index.meta.tags || []
    }
  },

  mounted() {},
  methods: {
    setting,
    getPost(_id: any) {
      return stored(_id) || {}
    }
  }
})
</script>

<style lang="less">
.plugin-blog {
  .widget-tags {
    border-bottom: 1px solid rgba(42, 49, 53, 0.1);
    .widget-tags-inner {
      display: flex;
      align-items: center;
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 2em;
      @media (max-width: 767px) {
        padding: 0 1em;
      }

      h3 {
        display: inline-block;
        font-weight: var(--font-weight-bold);
        margin-right: 20px;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        li {
          display: inline-block;
          &:not(:last-child) {
            margin-right: 20px;
          }
          a {
            display: block;
            padding: 30px 5px;
            font-size: 1rem;
            font-weight: 500;
            color: #70757b;
            &.router-link-exact-active,
            &:hover {
              color: var(--color-primary);
            }
          }
        }

        @media (max-width: 900px) {
          white-space: nowrap;
          overflow-x: auto;
          overflow-y: hidden;
        }
      }
    }
  }
  .blog-post .entry-meta {
    display: block;
    margin: 0;
  }

  .blog-posts-inner {
    max-width: 1000px;
    margin: 0 auto;
    @media (max-width: 900px) {
      padding: 1em;
      margin-left: 1em;
      margin-right: 1em;
    }

    .post-index {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 2rem;
      padding: 3em 2em;
      max-width: 100%;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }

      .blog-post {
        display: flex;
        flex-direction: column;
        height: 100%;
        transition: all 500ms cubic-bezier(0.165, 0.84, 0.44, 1);
        border-radius: 0.5rem;
        background: var(--color-bg-alt);

        &:hover {
          transform: translateY(-0.5rem);
          box-shadow: 0 3px 30px rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.05) 0px 5px 5px 2px;
        }

        .entry-title {
          font-weight: var(--font-weight-bold);
          font-size: 1.4rem;
          letter-spacing: -0.03em;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          padding: 0 1rem;
          &:hover {
            color: var(--color-primary);
          }
        }
        .edit {
          display: block;
          font-size: 1rem;
          font-weight: normal;
          letter-spacing: initial;
          margin: 0.5em 0;
          color: var(--color-primary);
        }
        .entry-subtitle {
          font-size: 1rem;
          padding: 0 1rem;
          color: #718096;
        }
        .widget-author-date {
          margin-top: auto;
          padding: 1rem 1rem 1rem;
        }
      }
    }
    .pagination {
      max-width: initial;
      margin: 0 1rem;
      justify-content: center;
      padding: 2em 0;
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
