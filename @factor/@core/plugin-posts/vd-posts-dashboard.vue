<template>
  <dashboard-page :loading="loading" class="posts-dashboard">
    <posts-table :rows="posts" :loading="loading">
      <template v-slot:title>
        <factor-btn
          :btn="buttonState('draft')"
          @click="setStatus(['draft', 'published'])"
        >{{ title }}</factor-btn>
        <factor-btn :btn="buttonState('trash')" @click="setStatus(['trash'])">Trash</factor-btn>
      </template>
      <template slot="nav">
        <factor-link
          :path="`/dashboard/posts/${postType}/add-new`"
          btn="primary"
          data-test="add-post"
        >
          Add {{ postTypeLabel }}
          <i class="fa fa-arrow-right" />
        </factor-link>
      </template>
    </posts-table>
  </dashboard-page>
</template>
<script>
export default {
  components: {
    "posts-table": () => import("./part-posts-table")
  },
  data() {
    return {
      loading: true,
      type: "blog",
      posts: [],
      status: ["published", "draft"]
    }
  },
  metatags() {
    return {
      title: this.title
    }
  },

  computed: {
    postType() {
      return this.$route.params.postType || ""
    },
    postTypeLabel() {
      return this.$utils.toLabel(this.postType)
    },
    title() {
      return `${this.postTypeLabel} Posts`
    }
  },
  watch: {
    $route: function(to, from) {
      this.setPosts()
    },
    status: {
      handler: function(v) {
        this.setPosts()
      },
      deep: true
    }
  },
  mounted() {
    this.$user.init(async () => {
      await this.setPosts()
    })
  },
  methods: {
    buttonState(item) {
      return this.status.includes(item) ? "selected" : ""
    },
    setStatus(status) {
      this.status = status
    },
    postlink(type, permalink, root = true) {
      return this.$posts.getPermalink({ type, permalink, root })
    },
    async setPosts() {
      const status = this.status || ["published", "draft"]
      this.loading = true
      this.posts = await this.$posts.getTable({
        type: this.postType,
        status
      })

      this.loading = false
    },

    async trashPost(id, index) {
      await this.$posts.trashPost({ id })

      this.posts.splice(index, 1)
    },
    setDefault() {
      return true
    }
  }
}
</script>
<style lang="less">
.posts-dashboard {
  .post-title {
    > a {
      display: block;
    }
    .permalink {
      margin-top: 5px;
      opacity: 0.3;
      color: inherit;
      font-size: 10px;
      font-weight: 500;
    }
  }
}
</style>