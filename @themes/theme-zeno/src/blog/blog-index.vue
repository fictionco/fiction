<template>
  <div class="blog">
    <el-hero
      v-if="setting('blog.title')"
      :align="`center`"
      :subheadline="setting('blog.pretitle')"
      :headline="setting('blog.title')"
      class="text-center"
    >
      <template v-slot:hero-content>
        <div v-formatted-text="setting('blog.content')" class="content entry-content" />
      </template>
    </el-hero>
    <section class="blog-posts bg-gray-100 pb-8">
      <div class="max-w-6xl mx-auto">
        <div class="blog-entries">
          <div v-if="loading" class="posts-loading">
            <factor-loading-ring />
          </div>
          <div v-else-if="blogPosts.length > 0" class="flex flex-wrap py-8">
            <div v-if="page == 1" class="blog-post w-full p-2 lg:w-1/3">
              <div
                v-if="setting('blog.promo')"
                class="blog-promo h-full overflow-hidden flex flex-col justify-center px-8 py-20 rounded-lg shadow-xl bg-cover bg-center bg-purple-900"
              >
                <div v-if="setting('blog.promo.pretitle')" class="custom-uppercase text-purple-400">{{ setting('blog.promo.pretitle') }}</div>
                <h1
                  v-if="setting('blog.promo.title')"
                  class="font-normal tracking-tight text-2xl text-gray-300"
                >{{ setting('blog.promo.title') }}</h1>
                <p v-if="setting('blog.promo.content')" class="text-gray-500 mt-2">{{ setting('blog.promo.content') }}</p>
                <factor-link
                  v-if="setting('blog.promo.button.link')"
                  :path="setting('blog.promo.button.link')"
                  class="mt-8 self-start"
                  :class="setting('blog.promo.button.classes')"
                >
                  {{ setting('blog.promo.button.text') }}
                  <factor-icon icon="angle-right" />
                </factor-link>
              </div>
            </div>

            <div v-for="post in blogPosts" :key="post._id" class="blog-post w-full p-2 lg:w-1/3">
              <div class="h-full overflow-hidden flex flex-col rounded-lg shadow-xl bg-white">
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
              <div class="font-normal tracking-tight text-2xl">{{ setting("blog.notFound.title") }}</div>
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

      const theLimit = this.page === 1 ? setting("blog.limit") - 1 : setting("blog.limit")

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
  .blog-promo {
    background-image: url(../img/promo.svg);
  }
  .loader .ring-path {
    stroke: var(--color-primary);
  }
  .posts-not-found,
  .posts-loading {
    min-height: 50vh;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
}
</style>
