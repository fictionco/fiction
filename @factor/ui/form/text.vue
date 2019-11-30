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
<script>
import Vue from "vue"
export default Vue.extend({
  props: {
    value: { type: [String, Number], default: "" }
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: (event) => this.$emit("input", event.target.value)
      }
    }
  }
})
</script>
