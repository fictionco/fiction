<template>
  <div class="jobs-entries">
    <el-hero :title="jobsTitle">
      <template v-slot:hero-content>
        <div v-if="jobsSubtitle" v-formatted-text="jobsSubtitle" class="content" />
      </template>
    </el-hero>

    <div v-if="loading" class="posts-loading">
      <factor-loading-ring />
    </div>
    <div v-else-if="jobsPosts.length > 0" class="post-index">
      <div v-for="post in jobsPosts" :key="post._id" class="jobs-post">
        <div>
          <component
            :is="setting(`jobs.components.${comp}`)"
            v-for="(comp, i) in setting('jobs.layout.index')"
            :key="i"
            :post-id="post._id"
          />
        </div>
      </div>
    </div>

    <div v-else class="posts-not-found">
      <div class="text">
        <div class="title">{{ setting("jobs.notFound.title") }}</div>
        <div class="sub-title">{{ setting("jobs.notFound.subTitle") }}</div>
      </div>
    </div>
    <component :is="setting('jobs.components.pagination')" :post-type="postType" />
  </div>
</template>
<script lang="ts">
import { factorLoadingRing } from "@factor/ui"
import { setting, stored } from "@factor/api"
import { requestPostIndex } from "@factor/post/request"
import { PostStatus, SortDelimiters } from "@factor/post/types"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLoadingRing,
    "el-hero": () => import("../el/hero.vue"),
  },
  data() {
    return {
      postType: "jobs",
      loading: false,
      jobsTitle: setting("jobs.title"),
      jobsSubtitle: setting("jobs.subtitle"),
    }
  },
  metaInfo() {
    const title = this.tag ? `Tag "${this.tag}"` : setting("jobs.metatags.index.title")

    const description = this.tag
      ? `Articles related to tag: ${this.tag}`
      : setting("jobs.metatags.index.description")

    return {
      title,
      description,
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
    jobsPosts(this: any) {
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
    setting,
    async getPosts(this: any) {
      this.loading = true

      await requestPostIndex({
        postType: this.postType,
        tag: this.tag,
        status: PostStatus.Published,
        sort: { date: SortDelimiters.Descending },
        page: this.page,
        limit: setting("jobs.limit"),
      })

      this.loading = false
    },
  },
})
</script>

<style lang="less">
.plugin-jobs {
  padding-bottom: 3rem;
  .jobs-entries {
    .hero {
      text-align: center;
      margin-bottom: 3rem;
    }
    .post-index {
      max-width: 48rem;
      margin: 0 auto;
      .jobs-post {
        padding: 1.5em 0;
      }
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
        font-weight: 600;
      }
    }
  }
}
</style>
