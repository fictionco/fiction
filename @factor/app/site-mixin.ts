import { runCallbacks, applyFilters, stored } from "@factor/api"
import { getObservables } from "@factor/app"

import { Route } from "vue-router"
import { FactorPostState } from "@factor/post/types"
import Vue, { VueConstructor } from "vue"
import veil from "./veil.vue"
export default (): any => {
  return Vue.extend({
    data(): Record<string, any> {
      return {
        scrollClass: "",
      }
    },
    computed: {
      post(): FactorPostState {
        return stored("post")
      },
      ui(this: any): string {
        const route = this.$route

        // In testing sometimes we don't want to bother with routes
        if (!route) return "factor-app"

        const { meta = {} } = route.matched.find((_: Route) => _.meta.ui) || {}

        const ui = meta.ui || "app"

        return `factor-${ui}`
      },
      classes(this: any): string[] {
        const observables: Record<string, any> = getObservables()

        // Use observables for classes as these can change at any time
        const siteClasses = applyFilters("observable-class-keys", [])
          .map((_: string) => observables[_])
          .filter((_: any) => _ && Array.isArray(_))
          .map((arr: string[]) => arr.join(" "))
          .join(" ")

        return [siteClasses, this.scrollClass]
      },
      injectedComponents(): VueConstructor<Vue>[] {
        const siteComponents = applyFilters("site-components", [
          {
            name: "veil",
            component: veil,
          },
        ])

        return siteComponents.map(
          (_: { name: string; component: VueConstructor<Vue> }) => _.component
        )
      },
    },

    watch: {
      ui: {
        handler: function (to: string, from: string): void {
          if (typeof document != "undefined") {
            const _el = document.documentElement
            _el.classList.remove(from)
            _el.classList.add(to)
          }
        },
      },
    },
    mounted(): void {
      this.setScrollClass()
      window.addEventListener("scroll", () => this.setScrollClass())
    },

    async serverPrefetch(): Promise<void> {
      await runCallbacks("global-prefetch", this.$route)
      return
    },

    methods: {
      setScrollClass(this: any): void {
        this.scrollClass = window.pageYOffset == 0 ? "top" : "scrolled"
      },
    },
  })
}
