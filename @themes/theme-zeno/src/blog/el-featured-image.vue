<template>
  <factor-link v-if="avatarUrl && format == 'index'" :path="postLink(post._id)">
    <div class="h-56 bg-cover bg-center bg-no-repeat" :style="style" />
  </factor-link>

  <div
    v-else
    class="featured-image min-h-full h-screen bg-cover bg-center bg-no-repeat"
    :style="style"
  />
  <!-- <img v-if="avatarUrl" :src="avatarUrl" :alt="post.title" class="h-64" /> -->
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
  // .featured-image {
  //   &:after {
  //     position: absolute;
  //     top: auto;
  //     right: 0;
  //     bottom: 0;
  //     left: 0;
  //     content: "";
  //     display: block;
  //     width: 100%;
  //     height: 30%;
  //     clip-path: polygon(100% 60%, 0 100%, 100% 100%);
  //     background: #fff;
  //   }
  // }
  // .single-entry {
  //   .featured-image-wrap {
  //     max-width: 1000px;
  //     position: relative;
  //     z-index: 1;
  //     margin: 2em auto;
  //     padding: 0 2em;

  //     .featured-image {
  //       display: block;
  //       width: 100%;
  //       box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
  //         0 18px 36px -18px rgba(0, 0, 0, 0.3), 0 -12px 36px -8px rgba(0, 0, 0, 0.025);
  //       border-radius: 4px;
  //     }

  //     @media (max-width: 767px) {
  //       margin: 0 auto;
  //     }
  //   }
  // }
}
</style>
