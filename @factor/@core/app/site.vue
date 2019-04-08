<template>
  <div id="app" class="factor-app">
    <router-view />
    <component :is="component" v-for="(component, k) in injectedComponents" :key="k" />
  </div>
</template>
<script>
import mixin from "./mixin-site"

export default {
  mixins: [mixin],
  computed: {
    injectedComponents() {
      return this.$filters.apply("site-components")
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.doRouteChange(to, from, next)
  },

  beforeRouteLeave(to, from, next) {
    this.doRouteChange(to, from, next)
  },
  // fires when the "route component" changes
  serverPrefetch() {
    return this.setPost()
  },

  methods: {
    async doRouteChange(to, from, next) {
      if (to.params.permalink != from.params.permalink) {
        await this.setPost(to)
      }

      next()
    },
    async setPost(filter, to = null) {
      this.$events.$emit("ssr-progress", "start")
      await Promise.all(this.$filters.applyFilters("request-post", [], to))
      this.$events.$emit("ssr-progress", "finish")
    }
  }
}
</script>