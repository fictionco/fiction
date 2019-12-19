<template>
  <h1 class="entry-title">
    <factor-link :path="postLink(post._id)">{{ post.title }}</factor-link>
  </h1>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { stored, postLink } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink },
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return stored(this.postId) || {}
    }
  },
  methods: { postLink }
})
</script>
<style lang="less">
.plugin-blog {
  .entry-title {
    font-weight: var(--font-weight-bold);
    font-size: 2em;
    letter-spacing: -0.03em;
    line-height: 1.2;
  }
}
</style>
