<template>
  <div class="job-entry-headers">
    <h1 class="entry-title">
      <factor-link :path="$post.link(post._id)">{{ post.title }}</factor-link>
      <span>{{ post.jobLocation }}</span>
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
      return this.$store.val(this.postId) || {};
    }
  }
};
</script>
<style lang="less">
.job-entry-headers {
  @media (max-width: 767px) {
    padding: 1em 1em 0;
  }

  .entry-title {
    font-weight: var(--font-weight-bold);
    font-size: 1.2em;
    margin-bottom: 1em;

    a {
      display: inline-block;
      max-width: 65%;
      color: inherit;
      &:hover {
        color: var(--color-primary);
      }
      &:active {
        opacity: 0.7;
      }
    }
    span {
      float: right;
      font-size: 0.9em;
      line-height: 1.4em;
      font-weight: 300;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-align: right;
    }
  }
  .entry-sub-title {
    font-size: 1.25em;
    opacity: 0.7;
    margin-bottom: 1em;
  }
}
</style>