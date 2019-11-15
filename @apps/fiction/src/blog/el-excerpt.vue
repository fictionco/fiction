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
import { factorLink, factorIcon } from "@factor/ui"
export default {
  components: { factorLink, factorIcon },
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
<style lang="less">
.post-excerpt {
  position: relative;
  overflow: hidden;
  font-size: 1.4em;
  line-height: 1.6em;
  padding: 0 1.6em 1rem;
  transform: all 0.2s ease-in-out;

  @media (max-width: 767px) {
    padding: 0 1em 1rem;
    font-size: 1.2em;
  }
}
</style>
