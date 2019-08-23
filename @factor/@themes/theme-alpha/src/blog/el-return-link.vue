<template>
  <div class="return-link">
    <factor-link class="back" :path="$setting.get('blog.indexRoute')">
      <factor-icon icon="arrow-left" />
      <span>{{ returnLinkText }}</span>
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
      return this.$store.val(this.postId) || {}
    },
    returnLinkText() {
      return this.$setting.get("blog.returnLinkText") || "All Articles"
    }
  }
}
</script>
<style lang="less">
.return-link {
  margin-bottom: 2rem;
  .back {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-primary, #1a49bd);
    border-radius: 3px;

    &:hover {
      opacity: 1;
      color: var(--color-primary, #1a49bd);
      background: var(--color-tertiary, #9afecb);
    }
  }
}
</style>