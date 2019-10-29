<template>
  <factor-link v-if="avatarUrl && format == 'index'" :path="link(post._id)">
    <div class="featured-image" :style="style" />
  </factor-link>
  <div v-else-if="avatarUrl" class="featured-image" :style="style" />
</template>
<script>
import { link } from "@factor/post"
import { stored } from "@factor/tools"
export default {
  props: {
    postId: { type: String, default: "" },
    format: { type: String, default: "" }
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
    height: 300px;
    margin: 0;
    border-radius: 5px 5px 0 0;
  }
  .single-entry .featured-image {
    border-radius: 0;
    height: 400px;
  }
}
</style>
