<template>
  <div class="app-manager">
    <brand-area />
    <nav-handler />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  components: {
    navHandler: () => import("./nav.vue"),
    brandArea: () => import("./brand.vue")
  }
})
</script>
<style lang="less">
</style>
