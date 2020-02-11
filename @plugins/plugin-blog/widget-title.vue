<template>
  <h1 class="entry-title">
    <factor-link class="entry-title-text" :path="postLink(post._id)">{{ post.title }}</factor-link>
    <factor-post-edit :post-id="post._id" />
  </h1>
</template>
<script lang="ts">
import { factorPostEdit } from "@factor/post"
import { factorLink } from "@factor/ui"
import { stored, postLink } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink, factorPostEdit },
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    }
  },
  methods: { postLink }
})
</script>
<style lang="less">
.plugin-blog {
  .entry-title {
    font-weight: var(--font-weight-bold, 700);
    font-size: 2em;
    letter-spacing: -0.03em;
    line-height: 1.2;
    .entry-title-text {
      color: inherit;
    }
  }
  .edit {
    display: block;
    font-size: 1rem;
    letter-spacing: initial;
    margin: 0.5em 0;
  }
}
</style>
