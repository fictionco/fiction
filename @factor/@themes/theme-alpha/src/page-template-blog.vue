<template>
  <div class="page-work">
    <section class="hero">
      <div class="mast">
        <div class="hero-inner">
          The Blog Page
          <div>
            {{ post }}
            <h1 class="title">{{ post.title }}</h1>
            <h2 class="heading">{{ post.pageHeading }}</h2>
            <div v-formatted-text="$markdown.render(post.content)" class="content entry-content" />
          </div>
          <div>
            <div
              v-if="post.heroImage"
              :style="{'background-image': `url(`+ post.heroImage[0].url + `)` }"
              class="hero-image"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="posts">
      <div class="mast">
        <div class="posts-inner">
          <article class="post-item">
            <factor-link path="/">
              <div
                class="img-wrap"
                :style="{'background-image': `url(`+ require(`./img/test.jpg`) + `)` }"
              />
            </factor-link>
            <h2 class="title">Post Title</h2>
            <p class="category">Post Category</p>
          </article>
          <article class="post-item">
            <factor-link path="/">
              <div
                class="img-wrap"
                :style="{'background-image': `url(`+ require(`./img/test.jpg`) + `)` }"
              />
            </factor-link>
            <h2 class="title">Post Title</h2>
            <p class="category">Post Category</p>
          </article>
          <article class="post-item">
            <factor-link path="/">
              <div
                class="img-wrap"
                :style="{'background-image': `url(`+ require(`./img/test.jpg`) + `)` }"
              />
            </factor-link>
            <h2 class="title">Post Title</h2>
            <p class="category">Post Category</p>
          </article>
          <article class="post-item">
            <factor-link path="/">
              <div
                class="img-wrap"
                :style="{'background-image': `url(`+ require(`./img/test.jpg`) + `)` }"
              />
            </factor-link>
            <h2 class="title">Post Title</h2>
            <p class="category">Post Category</p>
          </article>
        </div>
      </div>
    </section>

    <div v-for="(item, pi) in posts" :key="'key-'+pi" class="grid-item">
      <part-blog-entry
        v-if="pi % 3 == 0"
        format="listing"
        :authors="item.authorData"
        :title="item.title"
        :content="item.content"
        :date="item.date"
        :post-id="item.id"
        :loading="loading"
        :tags="item.tags"
        :path="$posts.getPermalink({type: item.type, permalink: item.permalink})"
      />
    </div>

    <el-cta />
  </div>
</template>

<script>
export default {
  components: {
    "part-blog-entry": () => import("./el/blog-entry"),
    "el-cta": () => import("./el/cta")
  },
  props: {
    post: { type: Object, default: () => {} }
  },
  data() {
    return {
      loading: false,
      parsedPosts: [{}, {}, {}],
      storeKey: "index"
    }
  },
  serverPrefetch() {
    return this.getPosts()
  },
  computed: {
    posts() {
      return this.$store.getters["getItem"]("blog") || []
    }
  },
  watch: {
    $route: function(to) {
      this.getPosts()
    }
  },
  async mounted() {
    if (this.posts.length == 0) {
      await this.getPosts()
    }
  },
  methods: {
    async getPosts() {
      const tag = this.$route.params.tag || ""
      this.loading = true
      const r = await this.$posts.getPostIndex({
        type: "blog",
        tag,
        storeKey: "index",
        status: ["published"]
      })
      this.loading = false
    },
    settings() {
      return ["test"]
    }
  },
  pageTemplate() {
    return {
      name: "Blog Page",
      inputs: [
        {
          input: "text",
          label: "Heading",
          key: "pageHeading"
        },
        {
          input: "image-upload",
          label: "Image",
          key: "heroImage"
        }
      ]
    }
  }
}
</script>

<style lang="less">
.page-work {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }

  .factor-btn.default {
    color: @color-primary;
    letter-spacing: -0.03em;
  }
  .hero {
    position: relative;
    &:before {
      content: "";
      display: block;
      position: absolute;
      width: 70%;
      height: 100%;
      top: 0;
      right: 0;
      bottom: 0;
      background-color: @color-bg;
      @media (max-width: 1024px) {
        width: 100%;
      }
    }

    .hero-inner {
      position: relative;
      padding: 3em 0;
      max-width: 650px;
      .title {
        font-size: 1.1em;
        text-transform: uppercase;
      }
      .heading {
        font-weight: 600;
        font-size: 3em;
        letter-spacing: -0.03em;
        margin: 0.5em 0;
        @media (max-width: 767px) {
          font-size: 2em;
        }
      }
      .content {
        opacity: 0.5;
        font-size: 1.2em;
        line-height: 1.6em;
      }
    }
  }

  .posts {
    padding: 6em 0;
    .posts-inner {
      display: grid;
      grid-gap: 20px 30px;
      grid-template-columns: 1fr 1fr;
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
        grid-row-gap: 100px;
      }
      .post-item {
        text-align: center;
        &:nth-last-of-type(odd) {
          margin-top: 120px;
          @media (max-width: 767px) {
            margin: 0;
          }
        }
        .img-wrap {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          height: 550px;
          margin-bottom: 1em;
          transform: scale(1);
          transition: all 0.2s ease-in-out;
          &:hover {
            transform: scale(0.95);
          }
        }
        .title {
          font-weight: 600;
        }
        .category {
          opacity: 0.5;
        }
      }
    }
  }
}
</style>