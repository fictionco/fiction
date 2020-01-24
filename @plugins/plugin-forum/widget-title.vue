<template>
  <h1 class="topic-title">
    <factor-link class="topic-title-text" :path="postLink(post._id)">{{ post.title }}</factor-link>
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
.plugin-forum {
  .topic-title {
    font-weight: 600;
    font-size: 2em;
    letter-spacing: -0.03em;
    line-height: 1.2;
    .topic-title-text {
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
