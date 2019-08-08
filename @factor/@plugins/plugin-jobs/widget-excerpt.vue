<template>
  <div class="jobs-post-excerpt">
    <span class="inline-excerpt">{{ $utils.excerpt(post.content) }}</span>
    <factor-link class="read-link" :path="$post.link(post._id)">
      Learn More
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
      return this.$store.val(this.postId) || {};
    }
  }
};
</script>
<style lang="less">
.jobs-post-excerpt {
  font-size: 1.25em;
  line-height: 1.4em;
  @media (max-width: 767px) {
    font-size: 1em;
    padding: 0 1em;
  }
  .inline-excerpt {
    margin-right: 1rem;
  }
}
</style>