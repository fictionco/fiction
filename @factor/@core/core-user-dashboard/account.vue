<template>
  <edit-user :post="post" />
</template>
<script>
export default {
  components: {
    "edit-user": () => import("./edit")
  },

  computed: {
    post() {
      return this.$store.getters["getItem"](this.$userId) || {}
    }
  },

  async mounted() {
    const user = await this.$user.init()

    if (this.$userId) {
      await this.$posts.getPostById({ _id: this.$userId })
    }
  }
}
</script>
 