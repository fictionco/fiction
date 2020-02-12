<template>
  <div class="page-work">
    <el-hero
      v-if="page == 1 && !tag"
      :pretitle="setting('work.headline')"
      :title="setting('work.subheadline')"
      :image="setting('work.heroImage')"
    >
      <template v-slot:hero-content>
        <div v-formatted-text="setting('work.content')" class="content entry-content" />
      </template>
    </el-hero>

    <section v-else-if="tag" class="hero">
      <div class="mast">
        <div class="hero-inner">
          <div class="work-return-link">
            <factor-link class="back label label-primary" :path="setting('work.indexRoute')">
              <factor-icon icon="fas fa-arrow-left" />
              {{ returnLinkText }}
            </factor-link>
          </div>
        </div>
      </div>
    </section>

    <div v-if="loading" class="loading-entries">
      <factor-loading-ring />
    </div>
    <section class="work-posts-wrap">
      <div class="mast">
        <div v-if="workPosts.length > 0" class="work-posts posts-index">
          <div v-for="post in workPosts" :key="post._id" class="work-post">
            <component
              :is="setting(`work.components.${comp}`)"
              v-for="(comp, i) in setting('work.layout.index')"
              :key="i"
              :post-id="post._id"
              format="index"
            />
          </div>
        </div>
        <div v-else class="posts-not-found">
          <div class="text">
            <div class="font-normal tracking-tight text-2xl">{{ setting("work.notFound.title") }}</div>
            <div class="sub-title">{{ setting("work.notFound.subTitle") }}</div>
          </div>
        </div>
        <component :is="setting('work.components.workPagination')" :post-type="postType" />
      </div>

      <!-- <div class="mast">
        <div if="workPosts.length > 0" class="work-posts posts-index">
          <div v-for="post in workPosts" :key="post._id" class="work-post">
            <component
              :is="setting(`work.components.${comp}`)"
              v-for="(comp, i) in setting('work.layout.index')"
              :key="i"
              :post-id="post._id"
              format="index"
            />
          </div>
        </div>
      </div>-->
    </section>
    <el-cta />
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
    "el-hero": () => import("../el/hero.vue"),
    "el-cta": () => import("../el/cta.vue")
  },
  data() {
    return {
      postType: "work",
      loading: false
    }
  },
  metaInfo() {
    const tag = this.$route.params.tag || ""
    const title = tag ? `Tag "${tag}"` : "Projects"

    const description = tag ? `Articles related to tag: ${tag}` : "Projects and more..."
    return {
      title,
      description
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
    workPosts(this: any) {
      const { posts = [] } = this.index
      return posts
    },
    page(this: any) {
      return this.$route.query.page || 1
    },
    returnLinkText() {
      return setting("work.returnLinkText") || "All Projects"
    }
  },
  watch: {
    $route: {
      handler: function(this: any) {
        this.getPosts()
      }
    }
  },
  mounted() {
    this.getPosts()
  },
  methods: {
    setting,
    async getPosts(this: any) {
      this.loading = true

      await requestPostIndex({
        postType: this.postType,
        tag: this.tag,
        status: "published",
        sort: "-date",
        page: this.page,
        limit: setting("work.limit")
      })

      this.loading = false
    }
  }
})
</script>

<style lang="less">
.page-work {
  padding-bottom: 3rem;
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }
  .loading-entries {
    height: 50vh;
    padding: 5em;
  }
  a {
    color: inherit;
    &:hover {
      color: var(--color-primary, #1a49bd);
    }
  }
  .work-posts-wrap {
    padding: 4em 0 8em;
  }
  .work-posts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }
}
</style>
