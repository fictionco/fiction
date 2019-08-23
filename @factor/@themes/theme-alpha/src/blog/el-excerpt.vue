<template>
  <div class="post-excerpt">
    <span class="inline-excerpt">{{ $utils.excerpt(post.content) }}</span>
    <app-link btn="default" size="standard" class="read-link" :path="$post.link(post._id)">
      Continue Reading
      <factor-icon icon="arrow-right" />
    </app-link>
  </div>
</template>
<script>
export default {
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return this.$store.val(this.postId) || {}
    }
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