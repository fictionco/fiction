<template>
  <div class="jobs-post-excerpt">
    <span class="inline-excerpt">{{ excerpt(post.content) }}</span>
    <factor-link class="read-link" :path="postLink(post._id)">
      Learn More
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
  methods: { postLink, excerpt }
}
</script>
<style lang="less">
.jobs-post-excerpt {
  font-size: 1.2em;
  line-height: 1.6em;
  font-weight: var(--font-weight-normal, 400);
  .inline-excerpt {
    margin-right: 1rem;
  }
}
</style>