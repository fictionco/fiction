<template>
  <div id="app" class="factor-app" :class="classes">
    <router-view />
    <component :is="component" v-for="(component, k) in injectedComponents" :key="k" />
  </div>
</template>
<script>
import Factor from "vue"

export default {
  mixins: Factor.$filters.apply("site-mixins", []),
  computed: {
    injectedComponents() {
      return this.$filters.apply("site-components", {})
    },
    ui() {
      const { meta: { ui = "app" } = {} } =
        this.$route.matched.find(_ => _.meta.ui) || {}

      return `ui-${ui}`
    },
    classes() {
      const metaClass = this.$route.meta.routeClass || []
      const siteClasses = this.$globals.routeClass || []

      return [...metaClass, , ...siteClasses]
    }
  },
  watch: {
    ui: {
      handler: function(to, from) {
        if (typeof document != "undefined") {
          const _el = document.documentElement
          _el.classList.remove(from)
          _el.classList.add(to)
        }
      }
    }
  },

  serverPrefetch() {
    return this.$filters.run("site-prefetch")
  }
}
</script>