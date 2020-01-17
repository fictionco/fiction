<template>
  <factor-link v-if="avatarUrl && format == 'index'" :path="postLink(post._id)">
    <div class="h-56 w-full bg-cover bg-center bg-no-repeat" :style="style" />
  </factor-link>
  <img v-else-if="avatarUrl" :src="avatarUrl" :alt="post.title" class="h-56 w-full" />
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
