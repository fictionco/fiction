<template>
  <div v-if="avatarUrl" class="featured-image" :style="style" />
</template>
<script lang="ts">
import Vue from "vue"
import { stored } from "@factor/api"
export default Vue.extend({
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
    avatar(this: any) {
      return stored(this.post.avatar) || {}
    },
    avatarUrl(this: any) {
      return this.avatar.url || ""
    },
    style(this: any) {
      const style = {
        backgroundImage: `url(${this.avatarUrl})`
      }

      return style
    }
  }
})
</script>
<style lang="less">
.plugin-blog {
  .featured-image {
    background-size: cover;
    background-position: 50%;
    height: 16em;
    margin-bottom: 1em;
  }
}
</style>
