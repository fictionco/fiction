<template>
  <factor-link v-if="avatarUrl && format == 'index'" :path="postLink(post._id)">
    <div class="featured-image" :style="style" />
  </factor-link>
  <div v-else class="featured-image-wrap">
    <img v-if="avatarUrl" :src="avatarUrl" :alt="post.title" class="featured-image" />
  </div>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { stored, postLink } from "@factor/api"

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
.work-posts {
  .featured-image {
    height: 280px;
    width: 100%;
    border-radius: 0.5rem;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: all 500ms cubic-bezier(0.165, 0.84, 0.44, 1);
  }
}
.work-single-entry {
  .featured-image-wrap {
    position: relative;
    z-index: 1;
    margin: -30px auto 3em;
    padding: 0 2em;

    .featured-image {
      display: block;
      width: 100%;
      box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
        0 18px 36px -18px rgba(0, 0, 0, 0.3), 0 -12px 36px -8px rgba(0, 0, 0, 0.025);
      border-radius: 0.5rem;
    }

    @media (max-width: 900px) {
      margin: 2em auto;
      padding: 0;
    }
  }
}
</style>
