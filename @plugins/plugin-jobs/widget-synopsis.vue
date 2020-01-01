<template>
  <h3 v-if="post.synopsis" itemprop="description" class="entry-synopsis">{{ post.synopsis }}</h3>
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
.plugin-jobs {
  .entry-synopsis {
    font-size: 1.2rem;
    line-height: 1.6em;
    padding-top: 0.5rem;
  }
}
</style>
