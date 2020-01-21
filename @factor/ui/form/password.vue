<template>
  <input
    :value="value"
    :autocomplete="$attrs.autocomplete || 'current-password'"
    type="password"
    minlength="6"
    :required="$attrs.required"
    v-bind="$attrs"
    v-on="listeners"
  />
</template>
<script lang="ts">
import Vue from "vue"
import { HTMLInputEvent } from "../event-types"
export default Vue.extend({
  props: {
    value: { type: String, default: "" }
  },
  computed: {
    listeners(this: any) {
      return {
        ...this.$listeners,
        input: (event: HTMLInputEvent) => this.$emit("input", event.target.value)
      }
    }
  }
})
</script>
