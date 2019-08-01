<template>
  <div class="author-card">
    <factor-avatar :post-id="post.avatar" width="3em" />
    <div class="text">
      <div class="sup">Written By</div>
      <span class="name">{{ post.displayName }}</span>
      <div v-if="post.bio" class="bio">{{ post.bio }}</div>
    </div>
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
.author-card {
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  padding: 1em 0;

  margin-right: 0;
  .avatar {
    margin-right: 20px;
  }
  .text {
    font-size: 1.5em;
    line-height: 1.4;
    .sup {
      font-size: 1rem;
      text-transform: uppercase;
      opacity: 0.3;
      line-height: 1.2;
    }
    .name {
      font-weight: var(--font-weight-bold);
    }
    .bio {
      margin-top: 0.5em;
      padding-left: 78px;
      opacity: 0.5;
    }
  }
}
</style>