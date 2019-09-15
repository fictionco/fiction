<template>
  <div class="return-link">
    <factor-link class="back" :path="$setting.get('portfolio.indexRoute')">
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
      return this.$setting.get("portfolio.returnLinkText") || "All Posts"
    }
  }
}
</script>