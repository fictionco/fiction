<template>
  <div>
    <p class="content">{{ excerpt(post.content) }}</p>
    <factor-link class="read-more" :path="postLink(post._id)">Read More...</factor-link>
  </div>
</template>
<script>
import { factorLink } from "@factor/ui"
import { postLink, excerpt, stored } from "@factor/tools"

export default {
  components: { factorLink },
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
