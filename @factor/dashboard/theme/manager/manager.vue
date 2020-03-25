<template>
  <div class="app-manager">
    <brand-area mode="brand" class="manager-area manager-header" />
    <div class="manager-area manager-content">
      <nav-handler />
    </div>
    <brand-area mode="account" class="manager-area manager-footer" />
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
.app-manager {
  height: 100vh;
  display: grid;
  grid-template-rows: 3rem 1fr 4rem;
  grid-gap: 1rem;
  overflow: auto;
  padding: 0.5rem;
  position: relative;
  .manager-area {
    min-width: 0;
  }
  .manager-content {
    min-width: 0;
    min-height: 0;
    overflow: auto;
  }
  // .manager-footer {
  //   position: absolute;
  //   bottom: 0;
  //   width: 100%;
  // }
}
</style>
