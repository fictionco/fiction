<template>
  <div v-if="format == 'index'">
    <h1>
      <factor-link :path="postLink(post._id)">{{ post.title }}</factor-link>
    </h1>
  </div>
  <div v-else>
    <div>
      <component :is="setting('blog.components.returnLink')" />
      <h1>
        <factor-link :path="postLink(post._id)">{{ post.title }}</factor-link>
      </h1>
    </div>
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
    }
  },
  methods: {
    postLink,
    setting
  }
}
</script>