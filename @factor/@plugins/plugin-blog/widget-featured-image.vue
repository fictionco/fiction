<template>
  <div v-if="postId" class="featured-image" :style="style" />
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
    style() {
      const style = {}

      style.backgroundImage = `url(${this.post.url})`

      return style
    }
  }
}
</script>
<style lang="less">
.featured-image {
  background-size: cover;
  background-position: 50%;
  height: 50vh;
  margin: 1.5rem 0;
}
</style>
