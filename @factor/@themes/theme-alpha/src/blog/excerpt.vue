<template>
  <div class="post-excerpt">
    <span class="inline-excerpt">{{ $utils.excerpt(post.content) }}</span>
    <app-link btn="default" size="standard" class="read-link" :path="$post.link(post._id)">
      Continue Reading
      <factor-icon icon="arrow-right" />
    </app-link>
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
  margin: 0 0 1em;
  font-size: 1.2em;
  line-height: 1.4em;
  padding: 0 1.6em 1rem;
  transform: all 0.2s ease-in-out;

  @media (max-width: 767px) {
    padding: 0 1em 1rem;
  }

  .factor-link.btn-link.read-link {
    display: block;
    margin-top: 1em;
  }
}
</style>