<template lang="pug">
  input.form-control(
    :value="value"
    type="password"
    :autocomplete="$attrs.autocomplete || 'current-password'"
    :required="$attrs.required"
    minlength="6"
    v-bind="$attrs"
    :class="$attrs.inputClasses"
    v-on="listeners")
</template>
<script lang="ts">
export default {
  props: {
    value: { type: [String, Number], default: "" },
  },
  computed: {
    listeners(this: any) {
      return {
        ...this.$listeners,
        input: (event: Event & { target: HTMLInputElement }) =>
          this.$emit("input", event.target.value),
      }
    },
  },
}
</script>
