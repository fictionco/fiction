<template>
  <div class="blog">
    <el-hero
      v-if="page == 1 && !tag"
      :headline="setting('blog.headline')"
      :subheadline="setting('blog.subheadline')"
      :image="setting('blog.heroImage')"
    >
      <template v-slot:hero-content>
        <div v-formatted-text="setting('blog.content')" class="content entry-content" />
      </template>
    </el-hero>
    <el-hero v-else-if="tag" :subheadline="`Tag: ` + tag" />

    <div v-if="tagsList.length > 0" class="widget-tags">
      <div class="widget-tags-inner">
        <h3>Tags:</h3>
        <ul>
          <li v-for="(theTag, ti) in tagsList" :key="ti">
            <factor-link :path="`?tag=${theTag._id}`">{{ theTag._id }}</factor-link>
          </li>
        </ul>
      </div>
    </div>

    <section class="blog-posts">
      <div class="blog-posts-inner">
        <div class="blog-entries">
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
import { factorLoadingRing, factorLink, factorIcon } from "@factor/ui"
import { setting, stored } from "@factor/api"
import { requestPostIndex } from "@factor/post/request"
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
    },
    tagsList(this: any) {
      return this.index.meta.tags || []
    }
  },
  watch: {
    $route: {
      handler: function(this: any) {
        this.getPosts()
      }
    }
  },
  serverPrefetch() {
    return this.getPosts()
  },
  mounted() {
    if (this.blogPosts.length == 0) {
      this.getPosts()
    }
  },
  methods: {
    setting,
    getPost(_id: any) {
      return stored(_id) || {}
    },
    async getPosts(this: any) {
      this.loading = true

      await requestPostIndex({
        postType: this.postType,
        tag: this.tag,
        status: "published",
        sort: "-date",
        page: this.page,
        limit: setting("blog.limit")
      })

      this.loading = false
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
              color: var(--color-primary, #1a49bd);
            }
          }
        }

        @media (max-width: 767px) {
          white-space: nowrap;
          overflow-x: auto;
          overflow-y: hidden;
        }
      }
    }
  }

  .blog-posts-inner {
    max-width: 1000px;
    margin: 0 auto;
    @media (max-width: 767px) {
      padding: 1em;
      margin-left: 1em;
      margin-right: 1em;
    }

    .post-index {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 2rem;
      padding: 3em 0;

      @media (max-width: 767px) {
        grid-template-columns: 1fr;
      }

      .blog-post {
        display: flex;
        flex-direction: column;
        transition: all 500ms cubic-bezier(0.165, 0.84, 0.44, 1);
        border-radius: 8px;
        padding: 1rem;

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
          &:hover {
            color: var(--color-primary, #1a49bd);
          }
        }
        .edit {
          display: block;
          font-size: 1rem;
          font-weight: normal;
          letter-spacing: initial;
          margin: 0.5em 0;
        }
        .entry-subtitle {
          font-size: 1rem;
        }
        .widget-author-date {
          margin-top: auto;
        }
      }
    }
    .pagination {
      max-width: initial;
      margin: 0 1rem;
      justify-content: center;
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
