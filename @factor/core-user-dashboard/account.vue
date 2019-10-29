<template>
  <edit-user :post="post" />
</template>
<script>
import { stored } from "@factor/tools"
import { requestPostSingle } from "@factor/post"
export default {
  components: {
    "edit-user": () => import("./edit")
  },

  computed: {
    post() {
      return stored(this.$userId) || {}
    }
  },

  async mounted() {
    const user = await this.$user.init()

    if (this.$userId) {
      await requestPostSingle({ _id: this.$userId, postType: "user" })
    }
  }
}
</script>
 