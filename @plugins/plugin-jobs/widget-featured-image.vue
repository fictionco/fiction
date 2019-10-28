<template>
  <div v-if="avatarUrl" class="featured-image" :style="style" />
</template>
<script>
export default {
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return this.$store.val(this.postId) || {}
    },
    avatar() {
      return this.$store.val(this.post.avatar) || {}
    },
    avatarUrl() {
      return this.avatar.url || ""
    },
    style() {
      const style = {}

      style.backgroundImage = `url(${this.avatarUrl})`

      return style
    }
  }
}
</script>
<style lang="less">
.featured-image {
  background-size: cover;
  background-position: 50%;
  height: 40vh;
  margin: 0 0 1.5rem;
}
</style>
