<template>
  <edit-user :post="post" />
</template>
<script>
import { userInitialized, userId } from "@factor/user"
import { stored } from "@factor/tools"
import { requestPostSingle } from "@factor/post"
export default {
  components: {
    "edit-user": () => import("./v-edit.vue")
  },

  computed: {
    post() {
      return stored(userId()) || {}
    }
  },

  async mounted() {
    const user = await userInitialized()
    if (user._id) await requestPostSingle({ _id: user._id, postType: "user" })
  }
}
</script>
 