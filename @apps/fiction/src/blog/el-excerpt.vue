<template>
  <div class="post-excerpt">
    <span class="inline-excerpt">{{ $utils.excerpt(post.content) }}</span>
    <factor-link class="read-link" :path="$post.link(post._id)">
      Read
      <factor-icon icon="arrow-right" />
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
.post-excerpt {
  position: relative;
  overflow: hidden;
  font-size: 1.4em;
  line-height: 1.6em;
  padding: 0 1.6em 1rem;
  transform: all 0.2s ease-in-out;
  // .inline-excerpt {
  //   margin-right: 1rem;
  // }

  @media (max-width: 767px) {
    padding: 0 1em 1rem;
    font-size: 1.2em;
  }
}
</style>