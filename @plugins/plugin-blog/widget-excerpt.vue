<template>
  <div class="post-excerpt">
    <span class="inline-excerpt">{{ excerpt(post.content) }}</span>
    <factor-link class="read-link" :path="link(post._id)">
      Read
      <factor-icon icon="arrow-right" />
    </factor-link>
  </div>
</template>
<script>
import { link } from "@factor/post"
import { excerpt } from "@factor/tools/utils"
export default {
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return this.$store.val(this.postId) || {}
    }
  },
  methods: {
    excerpt,
    link
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