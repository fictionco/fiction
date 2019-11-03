<template>
  <component :is="form" v-bind="$attrs" :list-id="listId" />
</template>
<script>
import { getSetting } from "@factor/plugin-email-list"

export default {
  props: {
    listId: { type: String, default: "default" }
  },
  computed: {
    form() {
      const emailComponent = getSetting({
        key: "form.component",
        listId: this.listsId
      })
      console.log("emailComponent", emailComponent)
      return emailComponent
    }
  }
}
</script>



