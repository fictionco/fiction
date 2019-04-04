<template>
  <component :is="templateLoader" />
</template>
<script>
export default {
  data() {
    return {}
  },

  computed: {
    postType() {
      return this.$route.params.postType || ""
    },
    postTypeInfo() {
      return this.$posts.postTypeInfo(this.postType)
    },
    templateLoader() {
      if (this.postTypeInfo.edit) {
        return this.postTypeInfo.edit
      } else {
        return () => import("./posts-edit")
      }
    }
  },

  mounted() {
    this.$user.init(async () => {
      this.loading = false
    })
  }
}
</script>
 