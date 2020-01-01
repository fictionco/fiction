<template>
  <h3 class="entry-subtitle">{{ post.synopsis }}</h3>
</template>
<script lang="ts">
import { stored } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    }
  }
})
</script>
<style lang="less">
.plugin-blog {
  .entry-subtitle {
    font-size: 1.2em;
    line-height: 1.6em;
    margin-bottom: 1em;
  }
}
</style>
