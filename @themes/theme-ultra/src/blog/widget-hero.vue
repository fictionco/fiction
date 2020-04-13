<template>
  <div class="hero">
    <div class="hero-inner">
      <div v-if="format == 'index'">
        <h1 class="title">
          <factor-link :path="postLink(post._id)" class="text-white">{{
            post.title
          }}</factor-link>
          <factor-post-edit :post-id="post._id" />
        </h1>
      </div>
      <div v-else>
        <factor-link class="back" :path="setting('blog.indexRoute')">
          <factor-icon icon="fas fa-arrow-left" />
          {{ returnLinkText }}
        </factor-link>
        <h1 class="title">
          <factor-link
            :path="postLink(post._id)"
            class="text-gray-100 hover:text-red-500"
            >{{ post.title }}</factor-link
          >
        </h1>
        <h3 class="entry-subtitle text-gray-100">{{ post.subTitle }}</h3>
        <factor-post-edit :post-id="post._id" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { factorPostEdit } from "@factor/post"
import { postLink } from "@factor/api/permalink"
import { setting } from "@factor/api"
import { stored } from "@factor/app/store"
import Vue from "vue"
export default Vue.extend({
  components: { factorPostEdit, factorLink, factorIcon },
  props: {
    postId: { type: String, default: "" },
    format: { type: String, default: "" },
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
    returnLinkText() {
      return setting("blog.returnLinkText") || "All News"
    },
  },
  methods: {
    postLink,
    setting,
  },
})
</script>
