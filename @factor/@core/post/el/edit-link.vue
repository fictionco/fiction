<template>
  <factor-link
    v-if="postId && canEdit"
    btn="default"
    size="tiny"
    btn-element="factor-btn"
    class="edit"
    :path="`/dashboard/posts/${post.postType}/edit`"
    :query="{_id: post._id}"
  >{{ editText }}</factor-link>
</template>

<script>
import { postTypeMeta } from "@factor/post"
export default {
  props: {
    postId: { type: String, default: "" }
  },

  computed: {
    editText() {
      return this.meta && this.meta.nameSingle ? `Edit ${this.meta.nameSingle}` : "Edit"
    },
    meta() {
      return this.post.postType ? postTypeMeta(this.post.postType) : {}
    },
    post() {
      return this.postId ? this.$store.val(this.postId) : {}
    },
    author() {
      return this.post && this.post.author ? this.post.author : []
    },
    accessLevel() {
      const { accessLevel } = this.$currentUser
      return accessLevel || 0
    },
    canEdit() {
      return this.accessLevel > 100 || this.author.includes(this.$userId)
    }
  },
  mounted() {}
}
</script>