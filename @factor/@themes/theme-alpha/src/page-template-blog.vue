<template>
  <div class="page-work">
    <section class="hero">
      <div class="mast">
        <div class="hero-inner">
          <div>
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
              <p class="tags">
                <span class="tag">Development</span>
              </p>
              <h2 class="title">7 Awesome Udemy Courses for App Development</h2>
              <p
                class="content"
              >Udemy offers a wide range of courses covering a variety of topics...</p>
              <p class="date">April 11, 2019</p>
              <p class="author">by Andrew Powers</p>
            </factor-link>
          </article>
          <article class="post-item">
            <factor-link path="/">
              <p class="tags">
                <span class="tag">Writing</span>
              </p>
              <h2 class="title">Cicero’s Method: How to write well in 2020</h2>
              <p
                class="content"
              >In 44 BC, in the midst of the Great Roman Civil War, a writer named...</p>
              <p class="date">April 11, 2019</p>
              <p class="author">by Andrew Powers</p>
            </factor-link>
          </article>
          <article class="post-item">
            <factor-link path="/">
              <p class="tags">
                <span class="tag">UX</span>
              </p>
              <h2 class="title">User Onboarding Done Right: Using The Power of Story</h2>
              <p
                class="content"
              >User onboarding is perhaps the most important piece of the entire customer...</p>
              <p class="date">April 11, 2019</p>
              <p class="author">by Raymond Aleman</p>
            </factor-link>
          </article>
        </div>
      </div>
    </section>

    <div v-for="(item, pi) in posts" :key="'key-'+pi" class="grid-item">
      <pre>
        {{ item }}
      </pre>
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
    }
    // settings() {
    //   return ["test"]
    // }
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
      grid-gap: 30px;
      grid-template-columns: repeat(3, 1fr);
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
        grid-row-gap: 100px;
      }
      .post-item {
        text-align: left;
        a {
          display: grid;
          height: 100%;
          grid-gap: 15px;
          padding: 2em;
          color: @color-text;
          background: #fff;
          border-radius: 8px;
          // border-left: 4px solid fade(@color-primary, 10%);
          transition: all 0.2s ease-in-out;
          box-shadow: 0 0 0 1px fade(@color-primary, 10%);
          &:hover {
            transform: translateY(-6px);
            box-shadow: 0 0 0 1px fade(@color-primary, 10%),
              0px 50px 50px 0 rgba(0, 0, 0, 0.2);
            .title {
              color: @color-primary;
            }
          }
          .title {
            font-weight: 600;
          }
          .tag {
            background-color: fade(@color-primary, 10%);
            border-radius: 5px;
            padding: 0.3em 0.5em;
          }
          .tags,
          .date,
          .author {
            font-size: 0.8em;
          }
        }
      }
    }
  }
}
</style>