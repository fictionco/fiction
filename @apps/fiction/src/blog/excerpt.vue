<template>
  <div class="post-excerpt">
    <span class="inline-excerpt">{{ $utils.excerpt(post.content) }}</span>
    <factor-link class="read-link" :path="$post.link(post._id)">
      Read
      <factor-icon icon="arrow-right" />
    </factor-link>
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
.post-excerpt {
  position: relative;
  overflow: hidden;
  font-size: 1.25em;
  line-height: 1.4em;
  padding: 0 1.6em 1rem;
  transform: all 0.2s ease-in-out;
  &:after {
    display: block;
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 50px;
    width: 100%;
    background: linear-gradient(0, #fff 0, hsla(0, 0%, 100%, 0));
  }
  &:hover:after {
    display: none;
  }
  .inline-excerpt {
    margin-right: 1rem;
  }

  @media (max-width: 767px) {
    font-size: 1em;
  }
}
</style>