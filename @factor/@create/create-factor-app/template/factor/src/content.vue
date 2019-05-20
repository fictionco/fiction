<template>
  <div class="content-container" :style="routeStyle">
    <site-head>
      <factor-link path="/">Home</factor-link>
      <factor-link path="/example">Example Page</factor-link>
    </site-head>
    <div class="page-content">
      <router-view />
    </div>

    <site-footer v-if="$route.meta.footer !== false" />
  </div>
</template>
<style src="./css/style.less" lang="less"></style>
<script>
import { name, description } from "../package"
export default {
  components: {
    "site-head": () => import("./header"),
    "site-footer": () => import("./footer")
  },

  computed: {
    siteName() {
      return this.$utils.toLabel(name)
    },
    description() {
      return description
    },
    routeStyle() {
      const style = {}
      if (this.$route.meta.style) {
        const { backgroundImage, color } = this.$route.meta.style
        if (color) style.color = color
        if (backgroundImage) style.backgroundImage = `url(${backgroundImage})`
      }
      return style
    }
  },
  metatags() {
    return {
      titleSuffix: ` | ${this.siteName}`
    }
  }
}
</script>
<style lang="less">
.content-container {
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
  height: 100vh;
  overflow: scroll;
}
</style>