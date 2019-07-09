<template>
  <dashboard-page :key="postType" :loading="loading" class="posts-dashboard">
    <component :is="templateLoader" :rows="postIndex" :loading="loading" :title="postTypeLabel" />
  </dashboard-page>
</template>
<script>
export default {
  components: {
    "posts-table": () => import("./posts-table")
  },
  data() {
    return {
      loading: true,
      postIndex: []
    }
  },
  metatags() {
    return {
      title: this.postTypeLabel
    }
  },

  computed: {
    postTypeInfo() {
      return this.$posts.postTypeInfo(this.postType)
    },
    templateLoader() {
      if (this.postTypeInfo.index) {
        return this.postTypeInfo.index
      } else {
        return () => import("./posts-table")
      }
    },
    postType() {
      return this.$route.params.postType || ""
    },
    postTypeLabel() {
      return this.postTypeInfo.namePlural
    },
    activeIndex() {
      return this.filtered ? this.filtered : this.postIndex
    },
    posts() {
      return this.activeIndex
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
    page: function(to, from) {
      this.setPosts()
    },
    postType: function(to, from) {
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
      return this.$posts.getPermalink({ type, permalink, root })
    },

    async setPosts() {
      this.postIndex = await this.getIndex()
    },

    async getIndex(args = {}) {
      return await this.$posts.getPostIndex({
        postType: this.postType,
        page: this.page,
        ...args
      })
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