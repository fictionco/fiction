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
      return this.$filters.apply("site-components", {})
    },
    ui() {
      const { meta: { ui = "app" } = {} } =
        this.$route.matched.find(_ => _.meta.ui) || {}

      return `ui-${ui}`
    }
  },
  watch: {
    ui: {
      handler: function(v) {
        if (typeof window != "undefined") {
          const el = this.$jquery("html")
          const uiClass = `ui-${v}`

          if (!el.hasClass(uiClass)) {
            el.removeClass((index, className) => {
              const reg = new RegExp("/^ui/g")
              return (className.match(reg) || []).join(" ")
            })

            el.addClass(uiClass)
          }
        }
      }
    }
  },

  async serverPrefetch() {
    return await this.$filters.run("site-prefetch")
  }
}
</script>