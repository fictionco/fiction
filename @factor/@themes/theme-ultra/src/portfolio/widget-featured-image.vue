<template>
  <factor-link v-if="avatarUrl && format == 'index'" :path="$post.link(post._id)">
    <div class="featured-image" :style="style" />
  </factor-link>
  <div v-else class="featured-image-wrap">
    <factor-link :path="$post.link(post._id)">
      <img v-if="avatarUrl" :src="avatarUrl" :alt="post.title" class="featured-image" >
    </factor-link>
  </div>
</template>
<script>
export default {
  props: {
    postId: { type: String, default: "" },
    format: { type: String, default: "" }
  },
  computed: {
    post() {
      return this.$store.val(this.postId) || {}
    },
    avatar() {
      return this.$store.val(this.post.avatar) || {}
    },
    avatarUrl() {
      return this.avatar.url || ""
    },
    style() {
      const style = {}

      style.backgroundImage = `url(${this.avatarUrl})`

      return style
    }
  }
}
</script>
<style lang="less">
.portfolio-posts {
  .featured-image {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 550px;
    transition: all 500ms cubic-bezier(0.165, 0.84, 0.44, 1);
    &:hover {
      transform: scale(0.9) rotate(-3deg);
      box-shadow: rgba(0, 0, 0, 0.28) 1px 5px 15px 2px;
    }
  }
}
.portfolio-single-entry {
  .featured-image-wrap {
    position: relative;
    z-index: 1;
    margin: -40px auto 2em;
    padding: 0 2em;
    max-width: 50rem;

    .featured-image {
      display: block;
      width: 100%;

      box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
        0 18px 36px -18px rgba(0, 0, 0, 0.3),
        0 -12px 36px -8px rgba(0, 0, 0, 0.025);
      border-radius: 4px;
    }
  }
}
</style>
