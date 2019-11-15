<template>
  <factor-link
    v-if="postId && canEdit"
    btn="default"
    size="tiny"
    btn-element="factor-btn"
    class="edit"
    :path="`/dashboard/posts/${post.postType}/edit`"
    :query="{ _id: post._id }"
  >{{ editText }}</factor-link>
</template>

<script>
import { factorLink } from "@factor/ui"
import { stored, getPostTypeConfig } from "@factor/tools"
import { userId, currentUser } from "@factor/user"
import Vue from "vue"
export default Vue.extend({
  components: { factorLink },
  props: {
    postId: { type: String, default: "" }
  },

  computed: {
    editText() {
      return this.meta && this.meta.nameSingle ? `Edit ${this.meta.nameSingle}` : "Edit"
    },
    meta() {
      return this.post.postType ? getPostTypeConfig(this.post.postType) : {}
    },
    post() {
      return this.postId ? stored(this.postId) : {}
    },
    author() {
      return this.post && this.post.author ? this.post.author : []
    },
    accessLevel() {
      const { accessLevel } = currentUser()
      return accessLevel || 0
    },
    canEdit() {
      return this.accessLevel > 100 || this.author.includes(userId())
    }
  },
  mounted() {}
})
</script>
