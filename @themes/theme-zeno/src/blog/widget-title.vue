<template>
  <div>
    <h1 class="entry-title pt-2 px-8">
      <factor-link
        class="font-normal tracking-tight leading-tight text-2xl text-purple-900 mt-5 hover:text-purple-500"
        :path="postLink(post._id)"
      >{{ post.title }}</factor-link>
      <factor-post-edit
        :post-id="post._id"
        class="block mt-2 text-normal text-gray-600 hover:text-purple-500"
      />
    </h1>
  </div>
</template>
<script lang="ts">
import { factorPostEdit } from "@factor/post"
import { factorLink } from "@factor/ui"
import { setting, stored, postLink } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink, factorPostEdit },
  props: {
    postId: { type: String, default: "" },
    format: { type: String, default: "" }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    }
  },
  methods: { setting, postLink }
})
</script>
