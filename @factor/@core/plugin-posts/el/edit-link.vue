<template>
  <factor-link
    v-if="canEdit"
    class="edit"
    :path="`/dashboard/posts/${post.type}/edit`"
    :query="{id: post.id}"
  >Edit</factor-link>
</template>

<script>
export default {
  props: {
    post: { type: Object, default: () => {} }
  },
  data() {
    return {
      user: null
    }
  },
  computed: {
    authors() {
      return this.post && this.post.authors ? this.post.authors : []
    },
    accessLevel() {
      return this.user && this.user.accessLevel ? this.user.accessLevel : 0
    },
    canEdit() {
      if (this.accessLevel > 300 || this.authors.includes(this.$uid)) {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    this.$user.init(async uid => {
      this.user = await this.$user.request(uid)
    })
  }
}
</script>