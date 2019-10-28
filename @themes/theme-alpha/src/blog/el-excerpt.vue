<template>
  <div class="post-excerpt">
    <span class="inline-excerpt">{{ excerpt(post.content) }}</span>
    <factor-link btn="default" size="standard" class="read-link" :path="link(post._id)">
      Continue Reading
      <factor-icon icon="arrow-right" />
    </factor-link>
  </div>
</template>
<script>
import { link } from "@factor/post"
import { excerpt } from "@factor/tools"
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
    link,
    excerpt
  }
}
</script>
<style lang="less">
.blog-posts {
  .post-excerpt {
    position: relative;
    overflow: hidden;
    padding: 0 2em 2rem;

    .inline-excerpt {
      //font-size: 1.2em;
      line-height: 1.7;
    }

    @media (max-width: 767px) {
      padding: 0 1em 1rem;
    }

    .factor-link.btn-link.read-link {
      display: block;
      margin-top: 1em;
    }
  }
}
</style>