<template>
  <logo />
</template>
<script lang="ts">
import Vue from "vue"
/* eslint-disable import/no-unresolved */
export default Vue.extend({
  components: {
    logo: () => import("__FALLBACK__/logo.vue")
  }
})
</script>
