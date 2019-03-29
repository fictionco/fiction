<template>
  <input :value="value" type="text" :required="$attrs.required" v-bind="$attrs" v-on="listeners">
</template>
<script>
export default {
  props: {
    value: { type: [String, Number], default: "" }
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: event => this.$emit("input", event.target.value)
      }
    }
  }
}
</script>
<style lang="less">
</style>
