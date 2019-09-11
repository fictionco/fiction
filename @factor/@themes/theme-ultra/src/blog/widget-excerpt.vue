<template>
  <div>
    <p class="content">
      {{ $utils.excerpt(post.content) }}
      <factor-post-edit :post-id="post._id" />
    </p>

    <factor-link class="read-more" :path="$post.link(post._id)">Read More...</factor-link>
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