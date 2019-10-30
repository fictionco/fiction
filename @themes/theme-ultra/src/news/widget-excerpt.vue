<template>
  <div>
    <p class="content">{{ excerpt(post.content) }}</p>
    <factor-link class="read-more" :path="link(post._id)">Read More...</factor-link>
  </div>
</template>
<script>
import { link } from "@factor/post"
import { excerpt, stored } from "@factor/tools"
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
    link,
    excerpt
  }
}
</script>