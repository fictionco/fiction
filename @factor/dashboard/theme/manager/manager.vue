<template>
  <div class="app-manager">
    <nav-handler />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  components: { navHandler: () => import("./nav.vue") }
})
</script>
<style lang="less">
</style>
