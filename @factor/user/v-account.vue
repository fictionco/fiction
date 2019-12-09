<template>
  <edit-user :post="post" />
</template>
<script lang="ts">
import { userInitialized, userId } from "@factor/user"
import { stored } from "@factor/api"
import { requestPostSingle } from "@factor/post/request"
import Vue from "vue"
export default Vue.extend({
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
    if (user && user._id) await requestPostSingle({ _id: user._id, postType: "user" })
  }
})
</script>
