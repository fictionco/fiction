<template>
  <div class="page-work">
    <el-hero
      v-if="page == 1 && !tag"
      :headline="setting('work.headline')"
      :subheadline="setting('work.subheadline')"
      :image="setting('work.heroImage')"
    >
      <template v-slot:hero-content>
        <div v-formatted-text="setting('work.content')" class="content entry-content" />
      </template>
    </el-hero>

    <section v-else-if="tag" class="hero">
      <div class="mast">
        <div class="hero-inner">
          <div>
            <factor-link class="back" :path="setting('work.indexRoute')">
              <factor-icon icon="arrow-left" />
              {{ returnLinkText }}
            </factor-link>
          </div>
        </div>
      </div>
    </section>

    <div v-if="loading" class="loading-entries">
      <factor-loading-ring />
    </div>
    <section class="work-posts">
      <div class="mast">
        <div if="workPosts.length > 0" class="posts-index">
          <div v-for="post in workPosts" :key="post._id" class="post">
            <component
              :is="setting(`work.components.${comp}`)"
              v-for="(comp, i) in setting('work.layout.index')"
              :key="i"
              :post-id="post._id"
              format="index"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { setting } from "@factor/tools"
import { requestPostIndex } from "@factor/post"
export default {
  components: {
    "el-hero": () => import("../el/hero.vue")
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
    tag() {
      return this.$route.params.tag || this.$route.query.tag || ""
    },
    index() {
      return this.$store.val(this.postType) || {}
    },
    workPosts() {
      const { posts = [] } = this.index
      return posts
    },
    page() {
      return this.$route.query.page || 1
    },
    returnLinkText() {
      return setting("work.returnLinkText") || "All Projects"
    }
  },
  watch: {
    $route: {
      handler: function(to) {
        this.getPosts()
      }
    }
  },
  mounted() {
    this.getPosts()
  },
  methods: {
    setting,
    async getPosts() {
      this.loading = true

      const r = await requestPostIndex({
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
}
</script>

<style lang="less">
.page-work {
  .loading-entries {
    height: 50vh;
    padding: 5em;
  }
  .work-posts {
    padding: 6em 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
    .posts-index {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 2em;
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
      }

      > div {
        &:nth-child(2n) {
          margin-top: 120px;
          @media (max-width: 767px) {
            margin: 0;
          }
        }
      }
    }
  }
}
</style>
