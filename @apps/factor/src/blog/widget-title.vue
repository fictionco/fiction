<template>
  <div>
    <h1 class="entry-title">
      <factor-link :path="postLink(post._id)" class="title">{{ post.title }}</factor-link>
      <factor-post-edit :post-id="post._id" class="post-edit" />
    </h1>
  </div>
</template>
<script lang="ts">
import { factorPostEdit } from "@factor/post"
import { factorLink } from "@factor/ui"
import { setting, stored, postLink } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink, factorPostEdit },
  props: {
    postId: { type: String, default: "" },
    format: { type: String, default: "" }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    }
  },
  methods: { setting, postLink }
})
</script>

<style lang="less">
.plugin-blog {
  .entry-title {
    padding-top: 0.5rem;
    padding-left: 2rem;
    padding-right: 2rem;
    .title {
      letter-spacing: -0.025em;
      line-height: 1.25;
      font-size: 1.5rem;
      margin-top: 1.25rem;
      color: var(--color-text);
      &:hover {
        color: var(--color-secondary);
      }
    }
    .edit {
      display: block;
      margin-top: 0.5rem;
    }
  }
}
</style>
