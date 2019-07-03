<template>
  <div class="page-blog">
    <el-hero
      :headline="$setting.get('blog.headline')"
      :subheadline="$setting.get('blog.subheadline')"
      :image="$setting.get('blog.heroImage')"
    >
      <template v-slot:hero-content>
        <div v-formatted-text="$setting.get('blog.content')" class="content entry-content" />
      </template>
    </el-hero>

    <section class="posts">
      <div class="mast">
        <div class="posts-inner">
          <article class="post-item">
            <app-link path="/">
              <p class="tags">
                <span class="tag">Development</span>
              </p>
              <h2 class="title">7 Awesome Udemy Courses for App Development</h2>
              <p
                class="content"
              >Udemy offers a wide range of courses covering a variety of topics...</p>
              <p class="date">April 11, 2019</p>
              <p class="author">by Andrew Powers</p>
            </app-link>
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
    </section>posts:
    <section class="posts">
      <div class="mast">
        <div class="posts-inner">
          <article v-for="(post, i) in $setting.get('blog.posts.data')" :key="i" class="entry">
            <!-- <pre>
              {{ post }}
            </pre>-->
            <part-blog-entry
              format="listing"
              :authors="post.authorData"
              :title="post.title"
              :content="post.content"
              :date="post.date"
              :post-id="post.id"
              :loading="loading"
              :tags="post.tags"
              :path="$posts.getPermalink({type: post.type, permalink: post.permalink})"
            />
          </article>
        </div>
      </div>
    </section>
    <!--
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
    </div>-->

    <el-cta />
  </div>
</template>

<script>
export default {
  components: {
    "el-hero": () => import("./el/hero"),
    "part-blog-entry": () => import("./el/blog-entry"),
    "el-cta": () => import("./el/cta")
  },
  // props: {
  //   post: { type: Object, default: () => {} }
  // },
  data() {
    return {
      loading: false,
      parsedPosts: [{}, {}, {}],
      storeKey: "index"
    }
  }
  // serverPrefetch() {
  //   return this.getPosts()
  // },
  // computed: {
  //   posts() {
  //     return this.$store.getters["getItem"]("blog") || []
  //   }
  // },
  // watch: {
  //   $route: function(to) {
  //     this.getPosts()
  //   }
  // },
  // async mounted() {
  //   if (this.posts.length == 0) {
  //     await this.getPosts()
  //   }
  // },
  // methods: {
  //   async getPosts() {
  //     const tag = this.$route.params.tag || ""
  //     this.loading = true
  //     const r = await this.$posts.getPostIndex({
  //       type: "blog",
  //       tag,
  //       storeKey: "index",
  //       status: ["published"]
  //     })
  //     this.loading = false
  //   }
  // }
  // pageTemplate() {
  //   return {
  //     name: "Blog Page",
  //     inputs: [
  //       {
  //         input: "text",
  //         label: "Heading",
  //         key: "pageHeading"
  //       },
  //       {
  //         input: "image-upload",
  //         label: "Image",
  //         key: "heroImage"
  //       }
  //     ]
  //   }
  // }
}
</script>

<style lang="less">
.page-blog {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }

  .factor-btn.default {
    color: var(--color-primary);
    letter-spacing: -0.03em;
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
      .post-item,
      .entry {
        text-align: left;
        a {
          display: grid;
          height: 100%;
          grid-gap: 15px;
          padding: 2em;
          color: var(--color-text);
          background: #fff;
          border-radius: 8px;
          transition: all 0.2s ease-in-out;
          border: 1px solid rgba(90, 122, 190, 0.08);
          box-shadow: 0 3px 0 0 rgba(90, 122, 190, 0.12);
          &:hover {
            transform: translateY(-6px);
            border: 1px solid rgba(90, 122, 190, 0.08);
            box-shadow: 0 1px 1px 0 rgba(90, 122, 190, 0.1),
              0 10px 20px 0 rgba(90, 122, 190, 0.2);
            .title {
              color: var(--color-primary);
            }
          }
          .title {
            font-weight: 600;
          }
          .tag {
            background-color: var(--color-bg-alt);
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