<template>
  <div class="page-home">
    <el-hero :title="splashTitle" :buttons="splashButtons">
      <template v-slot:hero-content>
        <div v-if="splashContent" v-formatted-text="splashContent" class="content" />
      </template>
    </el-hero>

    <section v-if="features" class="mast features">
      <div v-for="(item, i) in features" :key="i" class="feature">
        <h2 v-if="item.title" class="title">{{ item.title }}</h2>
        <div v-if="item.content" v-formatted-text="item.content" class="content" />
      </div>
    </section>

    <section class="mast">
      <div>
        <h2>Built for developers</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      </div>
      <div>Image</div>
    </section>

    <div class="mast home-blog">
      <!-- <pre>
      HERE {{ blogPosts }}
      </pre>-->
      <div v-if="blogPosts.length > 0" class="post-index">
        <div v-for="post in blogPosts" :key="post._id" class="post">
          <factor-link v-if="post.title" class="title" :path="postLink(post._id)">
            <!-- <factor-link :path="postLink(post._id)">{{ post.title }}</factor-link> -->
            {{ post.title }}
          </factor-link>

          <div v-if="post.synopsis" v-formatted-text="post.synopsis" class="content" />
          <!-- <component
            :is="setting(`blog.components.${comp}`)"
            v-for="(comp, i) in setting('blog.layout.index')"
            :key="i"
            :post-id="post._id"
          />-->
        </div>
      </div>
    </div>

    <el-newsletter />
  </div>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"
import { setting, stored, postLink } from "@factor/api"
import { loadAndStoreBlogIndex } from "@factor/plugin-blog"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    "el-hero": () => import("./el/hero.vue"),
    "el-newsletter": () => import("./el/newsletter.vue"),
  },
  data() {
    return {
      loading: true,
      postType: "blog",
      splashTitle: setting("home.splash.title"),
      splashContent: setting("home.splash.subtitle"),
      splashButtons: setting("home.splash.buttons"),
      features: setting("home.features"),
    }
  },
  metaInfo() {
    return {
      title: setting("home.metatags.title"),
      description: setting("home.metatags.description"),
      image: setting("home.metatags.image"),
    }
  },
  serverPrefetch() {
    return this.getPosts()
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
    postLink,
    setting,
    async getPosts(this: any) {
      this.loading = true

      await loadAndStoreBlogIndex()

      this.loading = false
    },
    // async getPosts(this: any) {
    //   this.loading = true

    //   await requestPostIndex({
    //     postType: this.postType,
    //     //tag: this.tag,
    //     status: "published",
    //     sort: "-date",
    //     page: this.page,
    //     limit: setting("home.section3.limit"),
    //   })

    //   this.loading = false
    // },
  },
})
</script>

<style lang="less">
.page-home {
  padding-bottom: 3rem;
  .mast {
    margin: 0 auto;
    max-width: 1140px;
  }
  .hero .hero-inner {
    padding: 6em 2em;
  }
  .features {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1rem;
    padding: 4rem 2rem;
    .feature {
      .title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
    }
  }
  .home-blog {
    padding: 4rem 2rem;
  }
}
</style>
