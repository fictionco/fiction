<template>
  <component :is="templateLoader" :post="post" />
</template>
<script>
export default {
  computed: {
    post() {
      return this.$store.val(this._id) || {}
    },
    _id() {
      return this.$route.query._id || ""
    },
    postType() {
      return this.$route.params.postType || ""
    },
    postTypeMeta() {
      return this.$posts.postTypeMeta(this.postType)
    },
    templateLoader() {
      const { editTemplate } = this.postTypeMeta

      return editTemplate ? editTemplate : () => import("./posts-edit")
    }
  },
  watch: {
    $route: function(to, from) {
      if (!this._id) this.requestPost()
    }
  },

  mounted() {
    this.requestPost()
  },
  methods: {
    async requestPost() {
      const post = await this.$posts.getSinglePost({
        _id: this._id,
        postType: this.postType,
        createOnEmpty: true,
        depth: 100
      })

      // If a new post was started, an id comes with it.
      if (post._id != this._id) {
        this.$router.replace({
          query: { ...this.$route.query, _id: post._id }
        })
      }
    }
  }
}
</script>
 