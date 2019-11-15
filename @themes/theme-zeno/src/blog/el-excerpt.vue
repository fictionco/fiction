<template>
  <div class="post-excerpt">
    <span class="inline-excerpt">{{ excerpt(post.content) }}</span>
    <factor-link class="read-link" :path="postLink(post._id)">
      Read
      <factor-icon icon="arrow-right" />
    </factor-link>
  </div>
</template>
<script>
import { postLink, excerpt, stored } from "@factor/tools"

export default {
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return stored(this.postId) || {}
    }
  },
  methods: {
    postLink,
    excerpt
  }
}
</script>