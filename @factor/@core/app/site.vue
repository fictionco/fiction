<template>
  <div id="app" class="factor-app" :class="classes">
    <router-view />
    <component :is="component" v-for="(component, k) in injectedComponents" :key="k" />
  </div>
</template>
<style src="~/.factor/loader-styles.less" lang="less"></style>
<script>
import Factor from "vue"

export default {
  mixins: Factor.$filters.apply("site-mixins", []),
  computed: {
    injectedComponents() {
      return this.$filters.apply("site-components", {})
    },

    classes() {
      const metaClass = this.$route.meta.routeClass || []
      const siteClasses = this.$globals.routeClass || []

      return [...metaClass, , ...siteClasses]
    }
  },

  serverPrefetch() {
    return this.$filters.run("site-prefetch")
  }
}
</script>