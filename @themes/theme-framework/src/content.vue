<template>
  <div class="content-layout">
    <header-primary class="nav-show-desktop" />
    <header-mobile class="nav-show-mobile" />
    <div class="content-main">
      <router-view />
    </div>
    <footer-primary />
  </div>
</template>

<script lang="ts">
import { setting } from "@factor/api/settings"
export default {
  components: {
    "header-primary": setting("site.components.header"),
    "footer-primary": setting("site.components.footer"),
    "header-mobile": () => import("./header-mobile.vue"),
  },
  metaInfo() {
    return {
      title: setting("metatags.defaultTitle"),
      titleTemplate: setting("metatags.titleTemplate"),
    }
  },
}
</script>

<style lang="less">
.content-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .nav-show-mobile {
    display: none;
    @media (max-width: 1100px) {
      display: block;
    }
  }

  .nav-show-desktop {
    display: block;
    @media (max-width: 1100px) {
      display: none;
    }
  }

  .content-main {
    min-height: 60vh;
  }
}
</style>
