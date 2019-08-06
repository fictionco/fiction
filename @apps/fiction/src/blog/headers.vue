<template>
  <div class="entry-headers">
    <h1 class="entry-title">
      <factor-link :path="$post.link(post._id)">{{ post.title }}</factor-link>
    </h1>
    <h3 class="entry-sub-title">{{ post.subTitle }}</h3>
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
.entry-headers {
  margin: 1rem 0;
  padding: 0 2em;
  .entry-title {
    font-weight: var(--font-weight-bold);
    font-size: 2.5em;
    line-height: 1.1;

    @media (max-width: 767px) {
      font-size: 2em;
    }
    a {
      color: inherit;
      &:hover {
        color: var(--color-primary);
      }
      &:active {
        opacity: 0.7;
      }
    }
  }
  .entry-sub-title {
    font-size: 1.4em;
    opacity: 0.7;
  }
}
</style>