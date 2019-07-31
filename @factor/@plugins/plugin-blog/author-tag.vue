<template>
  <div class="blog-author-card">
    <factor-avatar :post-id="post.avatar" />
    <span class="name">{{ post.displayName }}</span>
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
.blog-author-card {
  display: flex;
  align-items: center;
  margin-right: 1em;
  padding: 0.3em 0;

  .avatar {
    display: block;
    margin-right: 10px;
    float: left;
  }
  .name {
    font-weight: var(--font-weight-bold);
  }
}
</style>
