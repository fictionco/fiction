<template>
  <input
    :value="value"
    type="text"
    :required="$attrs.required"
    v-bind="$attrs"
    :class="$attrs.inputClasses"
    v-on="listeners"
  />
</template>
<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: {
    value: { type: [String, Number], default: "" }
  },
  computed: {
    listeners(this: any) {
      return {
        ...this.$listeners,
        input: (event: Event & { target: HTMLInputElement }) =>
          this.$emit("input", event.target.value)
      }
    }
  }
})
</script>
