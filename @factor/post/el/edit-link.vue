<template>
  <factor-link
    v-if="postId && canEdit"
    class="edit"
    :path="`/dashboard/posts/${post.postType}/edit`"
    :query="{ _id: post._id }"
  >{{ editText }} &rarr;</factor-link>
</template>

<script lang="ts">
import { factorLink, factorBtn } from "@factor/ui"
import { stored, getPostTypeConfig } from "@factor/api"
import { userId, currentUser } from "@factor/user"
import { FactorPost } from "@factor/post/types"
import Vue from "vue"
export default Vue.extend({
  components: { factorLink },
  props: {
    postId: { type: String, default: "" }
  },
  data() {
    return {
      factorBtn
    }
  },

  computed: {
    post(this: any): FactorPost {
      return this.postId ? stored(this.postId) : {}
    },
    editText(this: any): string {
      return this.meta && this.meta.nameSingle ? `Edit ${this.meta.nameSingle}` : "Edit"
    },
    meta(this: any) {
      return this.post.postType ? getPostTypeConfig(this.post.postType) : {}
    },

    author(this: any) {
      return this.post && this.post.author ? this.post.author : []
    },
    accessLevel(this: any) {
      const user = currentUser()

      return user ? user.accessLevel : 0
    },
    canEdit(this: any) {
      return this.accessLevel > 100 || this.author.includes(userId())
    }
  }
})
</script>
