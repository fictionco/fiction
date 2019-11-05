<template>
  <div class="blog">
    <section class="blog-splash">
      <div class="splash mast">
        <div>
          <div class="label label-yellow">Discover The Latest</div>
          <h1 class="title">Fiction Blog</h1>
          <p class="subtitle">Product updates, articles, and announcements from the Fiction team.</p>
        </div>
      </div>
    </section>
    <div class="entries">
      <component :is="setting('blog.components.blogReturnLink')" v-if="tag || page > 1" />
      <div v-if="loading" class="posts-loading">
        <factor-loading-ring />
      </div>
      <div v-else-if="blogPosts.length > 0" class="post-index">
        <div v-for="post in blogPosts" :key="post._id" class="post">
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
</template>
<script>
import { setting, stored } from "@factor/tools"
import { requestPostIndex } from "@factor/post"
export default {
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
    tag() {
      return this.$route.params.tag || this.$route.query.tag || ""
    },
    index() {
      return stored(this.postType) || {}
    },
    blogPosts() {
      const { posts = [] } = this.index
      return posts
    },
    page() {
      return this.$route.query.page || 1
    }
  },
  watch: {
    $route: {
      handler: function() {
        // this.getPosts()
      }
    }
  },
  created() {},
  serverPrefetch() {
    return this.getPosts()
  },
  mounted() {
    console.log("ABCL????:", this.blogPosts.length)
    // if (this.blogPosts.length == 0) {
    //   this.getPosts()
    // }
  },
  methods: {
    setting,
    async getPosts() {
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
}
</script>

<style lang="less">
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
.post-index {
  .post {
    margin: 4rem 0;
    box-shadow: var(--box-shadow-panel);
    background: #fff;
    border-radius: 5px;
    padding: 0;
    &:first-child {
      margin-top: 0;
    }
    @media (max-width: 767px) {
      margin: 2rem 1rem;
    }
  }
}
.blog .label {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  &.label-yellow {
    color: #f3c101;
  }
}
.blog-splash {
  background: #1b223c url(./rectangles.svg) no-repeat center center;
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
    padding: 8em 0;
    margin: 0 auto;
    @media (max-width: 767px) {
      padding: 6em 2em 4em;
    }
    .title {
      font-weight: var(--font-weight-bold);
      font-size: 4em;
      letter-spacing: -0.03em;
      line-height: 1;
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
</style>
