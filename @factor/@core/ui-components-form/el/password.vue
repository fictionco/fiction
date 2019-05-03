<template>
  <input
    :value="value"
    :autocomplete="$attrs.autocomplete || 'current-password'"
    type="password"
    minlength="6" 
  >
</template>
<script>
export default {
  props: {
    value: { type: String, default: "" }
  },
  computed: {
 
  }
}
</script>
