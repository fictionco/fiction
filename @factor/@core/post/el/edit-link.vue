<template>
  <factor-link
    v-if="canEdit"
    btn="default"
    size="tiny"
    btn-element="app-btn"
    class="edit"
    :path="`/dashboard/posts/${post.postType}/edit`"
    :query="{_id: post._id}"
  >Edit {{ $utils.toLabel(post.postType) }}</factor-link>
</template>

<script>
export default {
  props: {
    post: { type: Object, default: () => {} }
  },

  computed: {
    authors() {
      return this.post && this.post.authors ? this.post.authors : []
    },
    accessLevel() {
      const { accessLevel } = this.$currentUser
      return accessLevel || 0
    },
    canEdit() {
      return this.accessLevel > 100 || this.authors.includes(this.$userId)
    }
  },
  mounted() {}
}
</script>