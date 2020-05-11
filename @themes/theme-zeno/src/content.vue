<template>
  <div class="zeno-content">
    <header-primary />
    <router-view />
    <footer-primary />
  </div>
</template>

<script lang="ts">
import { setting } from "@factor/api/settings"
export default {
  components: {
    "header-primary": setting(`site.components.header`),
    "footer-primary": setting(`site.components.footer`),
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
.zeno-content {
  opacity: 0;
}
</style>
