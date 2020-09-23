<template>
  <edit-user :post="post" />
</template>
<script lang="ts">
import { userInitialized, userId } from "@factor/user"
import { stored, setting } from "@factor/api"
import { requestPostSingle } from "@factor/post/request"

export default {
  components: {
    "edit-user": setting("factorUser.dashboard.edit"),
  },

  computed: {
    post() {
      return stored(userId()) || {}
    },
  },

  async mounted() {
    const user = await userInitialized()
    if (user && user._id) await requestPostSingle({ _id: user._id, postType: "user" })
  },
}
</script>
