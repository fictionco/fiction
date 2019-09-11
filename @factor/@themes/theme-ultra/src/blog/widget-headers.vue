<template>
  <div>
    <h1 class="title">
      <factor-link :path="$post.link(post._id)">{{ post.title }}</factor-link>
    </h1>
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