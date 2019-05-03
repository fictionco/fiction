<template>
  <input 
    :value="value"
    type="email" 
    autocomplete="email" 
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
