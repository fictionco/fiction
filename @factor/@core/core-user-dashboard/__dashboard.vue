<template>
  <posts-table
    :rows="posts"
    :loading="loading"
    :index="postIndex"
    :filtered="activeIndex"
    :title="postTypeLabel"
  >
    <template slot="nav">
      <factor-link
        :path="`/dashboard/posts/${postType}/add-new`"
        btn="primary"
        data-test="add-post"
      >
        Invite
        <factor-icon icon="arrow-right" />
      </factor-link>
    </template>
  </posts-table>
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
    activeIndex() {
      return this.filtered && this.filtered.posts
        ? this.filtered
        : this.postIndex
    },
    posts() {
      return this.activeIndex.posts
    },
    status() {
      return this.$route.query.status || ""
    },
    page() {
      return this.$route.query.page || 1
    }
  },
  watch: {
    status: function(to, from) {
      this.setFiltered()
    },
    page: async function(to, from) {
      this.setPosts()
    }
  },
  mounted() {
    this.$user.init(async () => {
      this.loading = true
      await this.setPosts()
      this.loading = false
    })
  },
  methods: {
    postlink(type, permalink, root = true) {
      return this.$posts.getPermalink({ postType, permalink, root })
    },
    async setFiltered() {
      if (this.status) {
        this.filtered = await this.$posts.getPostIndex({
          model: "User",
          status: this.status
        })
      } else {
        this.filtered = {}
      }
    },
    async setPosts() {
      this.postIndex = await this.getIndex()

      // this.setFiltered()
    },

    async getIndex(args = {}) {
      return await this.$posts.getPostIndex({
        type: this.postType,
        page: this.page,
        ...args
      })
    },

    async trashPost(id, index) {
      await this.$posts.trashPost({ id })

      this.posts.splice(index, 1)
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