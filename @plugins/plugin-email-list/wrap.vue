<template>
  <component :is="form" v-bind="$attrs" :list-id="listId" />
</template>
<script lang="ts">
import { getSetting } from "@factor/plugin-email-list"
import Vue from "vue"
export default Vue.extend({
  props: {
    listId: { type: String, default: "default" }
  },
  computed: {
    form(this: any) {
      const emailComponent = getSetting({
        key: "form.component",
        listId: this.listsId
      })

      return emailComponent
    }
  }
})
</script>
