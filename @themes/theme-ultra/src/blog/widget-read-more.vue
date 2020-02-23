<template>
  <factor-link class="read-more" :path="postLink(post._id)">Read More...</factor-link>
</template>
<script lang="ts">
import { factorLink } from "@factor/ui"
import { postLink, stored } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: { factorLink },
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    }
  },
  methods: {
    postLink
  }
})
</script>