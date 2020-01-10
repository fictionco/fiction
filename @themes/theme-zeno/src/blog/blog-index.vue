<template>
  <div class="blog">
    <el-hero
      :subheadline="setting('blog.pretitle')"
      :headline="setting('blog.title')"
      class="text-center"
    >
      <template v-slot:hero-content>
        <div v-formatted-text="setting('blog.content')" class="content entry-content" />
      </template>
    </el-hero>
    <section class="blog-posts bg-gray-100 py-8">
      <div class="max-w-6xl mx-auto">
        <div class="blog-entries">
          <div v-if="loading" class="posts-loading">
            <factor-loading-ring />
          </div>
          <div v-else-if="blogPosts.length > 0" class="post-indexOLD flex flex-wrap py-8">
            <div v-if="page == 1" class="blog-post w-full p-2 lg:w-1/3">
              <div class="h-full overflow-hidden flex flex-col p-4 rounded shadow-xl bg-gray-400">
                <h1
                  class="entry-title font-bold text-2xl text-gray-100 mt-5"
                >About Theme Zeno {{ page }}</h1>
                <p
                  class="text-gray-400"
                >Zeno is a minimalist theme suited for the needs of IT companies and tech startups. Styles are powered by Tailwind, a low-level CSS framework.</p>
                <h1 class="widget-author mt-auto pt-12">Bottom</h1>
              </div>
            </div>
            <div v-for="post in blogPosts" :key="post._id" class="blog-post w-full p-2 lg:w-1/3">
              <div class="h-full overflow-hidden flex flex-col rounded shadow-xl bg-white">
                <component
                  :is="setting(`blog.components.${_component}`)"
                  v-for="(_component, i) in setting('blog.layout.index')"
                  :key="i"
                  :post-id="post._id"
                  format="index"
                />
              </div>
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

      const theLimit = this.page === 1 ? 2 : setting("blog.limit")

      await requestPostIndex({
        postType: this.postType,
        tag: this.tag,
        status: "published",
        sort: "-date",
        page: this.page,
        limit: theLimit //setting("blog.limit")
      })

      this.loading = false
    }
  }
})
</script>

<style lang="less">
.plugin-blog {
  .blog-post {
    transition: all 500ms cubic-bezier(0.165, 0.84, 0.44, 1);

    &:hover {
      transform: translateY(-0.5rem);
    }
  }

  .blog-posts-innerOLD {
    max-width: 1000px;
    margin: 0 auto;
    @media (max-width: 767px) {
      padding: 1em;
      margin-left: 1em;
      margin-right: 1em;
    }

    .post-index {
      // display: grid;
      // grid-template-columns: 1fr 1fr;
      // grid-gap: 2rem;
      padding: 3em 0;

      @media (max-width: 767px) {
        grid-template-columns: 1fr;
      }

      .blog-post {
        transition: all 500ms cubic-bezier(0.165, 0.84, 0.44, 1);

        &:hover {
          transform: translateY(-0.5rem);
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
