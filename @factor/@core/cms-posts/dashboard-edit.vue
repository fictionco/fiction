<template>
  <component :is="templateLoader" :post="post" />
</template>
<script>
export default {
  data() {
    return {}
  },

  computed: {
    post() {
      return this.$store.getters["getItem"](this._id) || {}
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
      await this.$posts.getPostById({ _id: this._id })
    }
  }
}
</script>
 