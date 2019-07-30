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
      return this.postTypeMeta.edit
        ? this.postTypeMeta.edit
        : () => import("./posts-edit")
    }
  },

  mounted() {
    this.requestPost(this._id)
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
 