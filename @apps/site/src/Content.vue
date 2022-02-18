<template>
  <div class="content-layout min-h-screen">
    <SiteHead />
    <router-view />
    <SiteFooter />
  </div>
</template>
<script lang="ts" setup>
import { useMeta } from "@factor/api"
import { computed } from "vue"
import SiteHead from "./el/SiteHead.vue"
import SiteFooter from "./el/SiteFooter.vue"
// eslint-disable-next-line import/no-unresolved
import ImgShare from "/share.jpg"
// eslint-disable-next-line import/no-unresolved
import ImgIcon from "/icon.jpg"

useMeta({
  title: computed(() => {
    return `FactorJS Static Site Framework by Kaption Co.`
  }),
  meta: [
    {
      name: `description`,
      content:
        "A next-generation framework for building websites, blogs, and apps with JavaScript. Powered by Node, TypeScript, Vite.",
    },
    {
      vmid: "og:image",
      property: "og:image",
      content: ImgShare,
    },
    {
      vmid: "icon",
      rel: "icon",
      href: ImgIcon,
    },
  ],
})
</script>

<style lang="less">
@import "./styles.less";
</style>
