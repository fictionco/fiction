<template>
  <input
    :value="value"
    type="text"
  >
</template>
<script>
export default {
  props: {
    value: { type: [String, Number], default: "" }
  }
}
</script>
<style lang="less">
.text-input {}
</style>
