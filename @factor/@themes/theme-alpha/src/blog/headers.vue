<template>
  <div class="entry-headers">
    <h1 class="entry-title">
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
<style lang="less">
.entry-headers {
  padding: 0 2em;
  @media (max-width: 767px) {
    padding: 0 1em;
  }

  .entry-title {
    font-weight: var(--font-weight-bold);
    font-size: 2em;
    line-height: 1.1;
    margin: 0.5em 0;

    @media (max-width: 767px) {
      font-size: 2em;
    }
    a {
      &:hover {
        text-decoration: underline;
        text-decoration-color: var(--color-tertiary);
      }
      &:active {
        opacity: 0.7;
      }
    }
  }
  .entry-sub-title {
    font-size: 1.4em;
    line-height: 1.6em;
    opacity: 0.7;
    @media (max-width: 767px) {
      font-size: 1.2em;
    }
  }
}
</style>