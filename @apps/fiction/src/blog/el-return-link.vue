<template>
  <div class="return-link">
    <factor-link class="back label label-yellow" :path="$setting.get('blog.indexRoute')">
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

  .label {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: var(--font-weight-normal, 400);
    &.label-yellow {
      color: #f3c101;
      &:hover {
        color: #f3c101;
        opacity: 0.7;
      }
    }
  }
}
</style>