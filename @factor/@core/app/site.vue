<template>
  <div id="app" class="factor-app">
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
    }
  },

  async serverPrefetch() {
    return await Promise.all(this.$filters.apply("site-prefetch", []))
  }
}
</script>