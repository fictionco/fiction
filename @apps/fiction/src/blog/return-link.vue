<template>
  <div class="return-link">
    <factor-link class="back" :path="$setting.get('blog.indexRoute')">
      <factor-icon icon="arrow-left" />
      <span>All Posts</span>
    </factor-link>
  </div>
</template>
<script>
export default {
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return this.$store.val(this.postId) || {}
    }
  }
}
</script>
<style lang="less">
.return-link {
  margin-bottom: 2rem;
  .back {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #f3c101;

    &:hover {
      color: #f3c101;
      opacity: 0.7;
    }
  }
}
</style>