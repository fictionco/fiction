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
<script lang="ts">
import { postLink, setting, stored } from "@factor/api"
import { factorLink } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink
  },
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
})
</script>
