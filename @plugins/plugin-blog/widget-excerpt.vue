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
    excerpt,
    postLink
  }
}
</script>
<style lang="less">
.post-excerpt {
  font-size: 1.25em;
  line-height: 1.4em;
  @media (max-width: 767px) {
    font-size: 1em;
  }
  padding-bottom: 1rem;
  .inline-excerpt {
    margin-right: 1rem;
  }
}
</style>