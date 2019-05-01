<template>
  <div id="app" class="factor-app" :class="ui">
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
      return this.$filters.apply("site-components")
    },
    ui() {
      const { meta: { ui = "theme" } = {} } =
        this.$route.matched.find(_ => _.meta.ui) || {}

      return `ui-${ui}`
    }
  },

  async serverPrefetch() {
    return await Promise.all(this.$filters.apply("site-prefetch", []))
  }
}
</script>