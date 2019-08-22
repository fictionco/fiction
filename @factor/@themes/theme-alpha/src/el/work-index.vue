<template>
  <div class="page-work">
    <el-hero
      v-if="page == 1 && !tag"
      :headline="$setting.get('work.headline')"
      :subheadline="$setting.get('work.subheadline')"
      :image="$setting.get('work.heroImage')"
    >
      <template v-slot:hero-content>
        <div
          v-formatted-text="$setting.get('work.content')"
          class="content entry-content"
        />
      </template>
    </el-hero>

    <div v-if="loading" class="loading-entries">
      <factor-loading-ring />
    </div>
    <section class="work-posts">
      <div class="mast">
        <div if="workPosts.length > 0" class="posts-inner">
          <div v-for="post in workPosts" :key="post._id" class="post">
            <component
              :is="$setting.get(`work.components.${comp}`)"
              v-for="(comp, i) in $setting.get('work.layout.index')"
              :key="i"
              :post-id="post._id"
              format="index"
            />
          </div>
        </div>
        <!-- <div v-for="(post, i) in $setting.get('work.posts.data')" :key="i">
            <part-work-entry
              format="listing"
              :images="post.images"
              :title="post.title"
              :authors="post.authorData"
              :content="post.content"
              :post-id="post._id"
              :loading="loading"
              :tags="post.tags"
              :path="post.path"
            />
          </div> -->
      </div>
    </section>
  </div>
</template>
<script>
export default {
  components: {
    "el-hero": () => import("./hero.vue"),
    "part-work-entry": () => import("./work-entry")
  },
  data() {
    return {
      postType: "work",
      loading: false
    }
  },
  metatags() {
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
    async getPosts() {
      this.loading = true

      const r = await this.$post.getPostIndex({
        postType: this.postType,
        tag: this.tag,
        status: "published",
        sort: "-date",
        page: this.page,
        limit: this.$setting.get("work.limit")
      })

      this.loading = false
    }
  }
}
</script>

<style lang="less">
.work-posts {
  .posts-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2em;
  }
}
.page-work {
  .loading-entries {
    height: 50vh;
    padding: 5em;
  }
}
.posts-inner {
  > div {
    &:nth-last-of-type(odd) {
      margin-top: 120px;
      @media (max-width: 767px) {
        margin: 0;
      }
    }
  }
}
</style>
