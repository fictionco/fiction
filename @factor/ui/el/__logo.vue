<template>
  <logo />
</template>
<script lang="ts">
import Vue from "vue"
/* eslint-disable import/no-unresolved */
export default Vue.extend({
  components: {
    logo: () => import("__FIND__/logo.vue")
  }
})
</script>
