<template>
  <div>
    <factor-link v-if="format == 'index'" :path="postLink(post._id)">
      <div v-if="avatarUrl" class="featured-image" :style="style" />
    </factor-link>
    <div v-else class="featured-image" :style="style" />
  </div>
</template>
<script>
import { postLink, setting, stored } from "@factor/tools"
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
    postLink,
    setting
  }
}
</script>
<style lang="less">
.featured-image {
  background-size: cover;
  background-position: 50%;
  height: 40vh;
  margin: 1.5rem 0;
}
</style>
