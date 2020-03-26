<template>
  <div class="app-manager">
    <brand-area mode="brand" class="manager-area manager-header" @click="search()" />
    <div class="manager-area manager-content">
      <nav-handler />
    </div>
    <brand-area
      mode="account"
      class="manager-area manager-footer"
      :active="active == 'account'"
      @click="active = 'account'"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  components: {
    navHandler: () => import("./nav.vue"),
    brandArea: () => import("./brand.vue")
  },
  data() {
    return {
      active: ""
    }
  },
  methods: {
    search(this: any) {
      console.log("show search")
    }
  }
})
</script>
<style lang="less">
.app-manager {
  height: 100vh;
  display: grid;
  grid-template-rows: minmax(3rem, auto) 1fr minmax(4rem, auto);
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
