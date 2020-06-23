<template>
  <factor-link v-if="avatarUrl" class="featured-image" :style="style" :path="postLink(post._id)" />
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { stored, postLink } from "@factor/api"
export default {
  components: { factorLink },
  props: {
    postId: { type: String, default: "" },
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
        backgroundImage: `url(${this.avatarUrl})`,
      }

      return style
    },
  },
  methods: { postLink },
}
</script>
<style lang="less">
.plugin-jobs {
  .featured-image {
    display: block;
    background-size: cover;
    background-position: 50%;
    height: 16em;
    margin-bottom: 1em;
    border-radius: 0.5rem;
  }
}
</style>
