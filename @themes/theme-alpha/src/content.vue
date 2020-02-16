<template>
  <div class="content-layout alpha-content">
    <header-primary />
    <div class="content-main" :style="bg">
      <router-view />
    </div>
    <footer-primary />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { setting } from "@factor/api/settings"
export default Vue.extend({
  components: {
    "header-primary": setting(`site.components.header`),
    "footer-primary": setting(`site.components.footer`)
  },
  metaInfo() {
    return {
      title: setting("metatags.defaultTitle"),
      titleTemplate: setting("metatags.titleTemplate")
    }
  },
  computed: {
    bg(this: any) {
      return {
        background: this.$route.meta.background || ""
      }
    }
  }
})
</script>

<style lang="less">
.content-layout {
  display: flex;
  flex-direction: column;
}
</style>
