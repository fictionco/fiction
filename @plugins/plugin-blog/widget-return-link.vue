<template>
  <div class="return-link">
    <factor-link class="back" :path="setting('blog.indexRoute')">
      <factor-icon icon="arrow-left" />
      <span>{{ returnLinkText }}</span>
    </factor-link>
  </div>
</template>
<script>
import { setting } from "@factor/tools"
export default {
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return this.$store.val(this.postId) || {}
    },
    returnLinkText() {
      return setting("blog.returnLinkText") || "All Posts"
    }
  },
  methods: { setting }
}
</script>
<style lang="less">
.return-link {
  margin-bottom: 2rem;
  .back {
    color: inherit;
    font-weight: var(--font-weight-bold);
    &:hover {
      color: var(--color-primary);
    }
  }
}
</style>