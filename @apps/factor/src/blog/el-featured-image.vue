<template>
  <factor-link
    v-if="avatarUrl && format == 'index'"
    :path="postLink(post._id)"
    class="featured-image-wrap"
  >
    <div class="featured-image" :style="style" />
  </factor-link>

  <div v-else class="featured-image" :style="style" />
</template>
<script lang="ts">
import { postLink, stored } from "@factor/api"
import { factorLink } from "@factor/ui"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink },
  props: {
    postId: { type: String, default: "" },
    format: { type: String, default: "" }
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
  },
  methods: {
    postLink
  }
})
</script>
<style lang="less">
.plugin-blog {
  .featured-image {
    height: 14rem;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}
</style>
