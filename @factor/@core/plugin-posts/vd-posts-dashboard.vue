<template>
  <dashboard-page :loading="loading" class="posts-dashboard">
    <posts-table :rows="posts" :loading="loading" :meta="postIndex" :title="postTypeLabel">
      <template slot="nav">
        <factor-link
          :path="`/dashboard/posts/${postType}/add-new`"
          btn="primary"
          data-test="add-post"
        >
          Add New
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
      postIndex: {},
      filtered: {}
    }
  },
  metatags() {
    return {
      title: this.postTypeLabel
    }
  },

  computed: {
    postType() {
      return this.$route.params.postType || ""
    },
    postTypeLabel() {
      const postTypeInfo = this.$posts.postTypeInfo(this.postType)
      return postTypeInfo.namePlural
    },
    posts() {
      return this.filtered.posts ? this.filtered.posts : this.postIndex.posts
    },
    status() {
      return this.$route.query.status || ""
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

    postlink(type, permalink, root = true) {
      return this.$posts.getPermalink({ type, permalink, root })
    },
    async setPosts() {
      this.loading = true

      this.postIndex = await this.$posts.getPostIndex({
        type: this.postType
      })

      if (this.status) {
        this.filtered = await this.$posts.getPostIndex({
          type: this.postType,
          status: this.status
        })
      } else {
        this.filtered = {}
      }
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