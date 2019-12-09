<template>
  <div>
    <p class="content">{{ excerpt(post.content) }}</p>
    <factor-link class="read-more" :path="postLink(post._id)">Read More...</factor-link>
  </div>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { excerpt } from "@factor/api/excerpt"
import { postLink, stored } from "@factor/api"
import Vue from 'vue'
export default Vue.extend({
  components: { factorLink },
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post() {
      return stored(this.postId) || {}
    }
  },
  methods: {
    postLink,
    excerpt
  }
})
</script>
