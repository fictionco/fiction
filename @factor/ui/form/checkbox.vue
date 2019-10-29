<template>
  <label class="checkbox-wrap">
    <input type="checkbox" class="checkbox" :value="value" v-on="listeners" >
    <span v-if="label" class="checkbox-label">{{ label }}</span>
  </label>
</template>
<script>
export default {
  props: {
    value: { type: [String, Boolean, Array], default: false },
    label: { type: String, default: "" }
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
