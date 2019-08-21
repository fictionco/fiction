<template>
  <div class="single-entry-headers">
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
.single-entry-headers {
  margin: 1rem 0;
  padding: 2em;
  @media (max-width: 767px) {
    padding: 2em 1em;
  }
  .entry-title {
    font-weight: var(--font-weight-bold);
    font-size: 2.5em;
    line-height: 1.1;

    @media (max-width: 767px) {
      font-size: 2em;
    }
    a {
      color: var(--color-primary, #1a49bd);
      &:hover {
        text-decoration: underline;
        text-decoration-color: var(--color-tertiary, #9afecb);
      }
      &:active {
        opacity: 0.7;
      }
    }
  }
  .entry-sub-title {
    padding-top: 0.3em;
    font-size: 1.4em;
    opacity: 0.7;
  }
}
</style>
