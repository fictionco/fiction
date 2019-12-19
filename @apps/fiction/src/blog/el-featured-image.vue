<template>
  <factor-link v-if="avatarUrl && format == 'index'" :path="postLink(post._id)">
    <div class="featured-image" :style="style" />
  </factor-link>
  <div v-else-if="avatarUrl" class="featured-image-wrap">
    <div class="featured-image" :style="style" />
  </div>
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
    background-size: cover;
    background-position: 50%;
    height: 16em;
    margin-bottom: 1em;
    border-radius: 5px;
  }
  .single-entry .featured-image {
    height: 16em;
  }
}
</style>
