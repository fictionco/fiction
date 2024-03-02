<template>
  <div class="content-layout bg-gradient-to-r from-black via-gray-900 to-black">
    <SiteHead />
    <router-view />
    <SiteFooter />
  </div>
</template>
<script lang="ts">
import "mapbox-gl/dist/mapbox-gl.css"

import sharingIcon from "./public/icon-500.jpg"
import socialImage from "./public/social.jpg"

import SiteFooter from "./el/SiteFooter.vue"
import SiteHead from "./el/SiteHead.vue"
export default {
  name: "ContentWrap",
  components: {
    SiteHead,
    SiteFooter,
  },
  metaInfo() {
    return {
      titleTemplate: "%s - Darwin Analytics",
      link: [
        {
          vmid: "icon",
          rel: "icon",
          href: sharingIcon,
        },
      ],
      meta: [
        {
          vmid: "socialImage",
          property: "og:image",
          content: socialImage,
        },
      ],
    }
  },
}
</script>

<style lang="less">
@import "./styles.less";
</style>
