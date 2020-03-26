<template>
  <div class="app-manager">
    <div class="manager-area manager-header">
      <brand-area mode="brand" @click="search()" />
      <mobile-toggle />
    </div>
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
import { currentUser } from "@factor/user"
export default Vue.extend({
  components: {
    navHandler: () => import("./nav.vue"),
    brandArea: () => import("./brand.vue"),
    mobileToggle: () => import("./mobile-toggle.vue")
  },
  data() {
    return {
      active: ""
    }
  },
  methods: {
    currentUser,
    search(this: any) {
      console.log("show search")
    },
    getUser(this: any, field: string) {
      if (!field) {
        return this.currentUser
      }
      return this.currentUser ? this.currentUser[field] : undefined
    }
  }
})
</script>
<style lang="less">
.app-manager {
  background: #fff;
  height: 100vh;
  display: grid;
  grid-template-rows: minmax(3rem, auto) 1fr minmax(4rem, auto);
  grid-gap: 1rem;
  overflow: auto;
  padding: 0.5rem;
  position: relative;
  border-right: 1px solid var(--panel-border-color);
  .manager-area {
    min-width: 0;
  }
  .manager-content {
    min-width: 0;
    min-height: 0;
    overflow: auto;
  }
  .manager-header {
    display: grid;
    grid-template-columns: 1fr 5rem;
  }
  // .manager-footer {
  //   position: absolute;
  //   bottom: 0;
  //   width: 100%;
  // }
}
</style>
