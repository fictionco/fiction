<template>
  <dashboard-page :key="postType" class="posts-dashboard">
    <component
      :is="templateLoader"
      :list="posts"
      :meta="postsMeta"
      :loading="loading"
      :title="postTypeLabel"
    />
  </dashboard-page>
</template>
<script>
export default {
  components: {
    "posts-table": () => import("./posts-table")
  },
  data() {
    return {
      loading: true
    }
  },
  metatags() {
    return {
      title: this.postTypeLabel
    }
  },

  computed: {
    postIndex() {
      return this.$store.val(this.postType) || []
    },
    postTypeMeta() {
      return this.$post.postTypeMeta(this.postType)
    },
    templateLoader() {
      const { listTemplate } = this.postTypeMeta

      return listTemplate ? listTemplate : () => import("./posts-table")
    },
    postType() {
      return this.$route.params.postType || ""
    },
    postTypeLabel() {
      return this.postTypeMeta.namePlural
    },
    postsMeta() {
      return this.postIndex && this.postIndex.meta ? this.postIndex.meta : {}
    },
    posts() {
      return this.postIndex && this.postIndex.posts ? this.postIndex.posts : []
    },

    filters() {
      const postType = this.postType
      const { page = 1, status, category, tag, role } = this.$route.query
      return {
        postType,
        page,
        status,
        category,
        tag,
        role
      }
    }
  },
  watch: {
    $route: function(to, from) {
      this.setPosts()
    }
  },
  mounted() {
    this.setPosts()
    this.$events.$on("refresh-table", () => {
      this.setPosts()
    })
  },
  methods: {
    // async handlePostAction({ action, selected }) {
    //   if (selected.length == 0) return

    //   await this.$post.saveMany({
    //     _ids: selected,
    //     data: { status: "action" }
    //   })

    //   this.setPosts()
    // },

    async setPosts() {
      this.loading = true
      await this.$post.getPostIndex(this.filters)
      this.loading = false
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