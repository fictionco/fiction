<template>
  <div class="return-link">
    <factor-link class="back label label-yellow" :path="setting('blog.indexRoute')">
      <factor-icon icon="arrow-left" />
      <span>{{ returnLinkText }}</span>
    </factor-link>
  </div>
</template>
<script>
import { setting, stored } from "@factor/tools"
export default {
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return stored(this.postId) || {}
    },
    returnLinkText() {
      return setting("blog.returnLinkText") || "All Articles"
    }
  },
  methods: { setting }
}
</script>