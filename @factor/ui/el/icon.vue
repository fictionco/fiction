<template>
  <i class="factor-icon" :class="icon" />
</template>

<script lang="ts">
import Vue from "vue"
// import "../fa/js/brands.js"
// import "../fa/js/solid.js"
// import "../fa/js/regular.js"
// import "../fa/js/fontawesome.js"
export default Vue.extend({
  props: {
    icon: { type: String, default: "" }
  }
})
</script>

<style lang="less">
@import "~../fa/css/all.css";
</style>
