<template>
  <factor-link :path="link(post._id)">
    <div v-if="avatarUrl" class="featured-image" :style="style" />
  </factor-link>
</template>
<script>
import { stored } from "@factor/tools"
import { link } from "@factor/post"
export default {
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return stored(this.postId) || {}
    },
    avatar() {
      return stored(this.post.avatar) || {}
    },
    avatarUrl() {
      return this.avatar.url || ""
    },
    style() {
      const style = {}

      style.backgroundImage = `url(${this.avatarUrl})`

      return style
    }
  },
  methods: {
    link
  }
}
</script>
<style lang="less">
.blog-wrap {
  .featured-image {
    background-size: cover;
    background-position: 50%;
    min-height: 300px;
    height: 40vh;
    margin: 0;
    border-radius: 5px 5px 0 0;
  }
}
</style>
