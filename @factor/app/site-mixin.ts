import { runCallbacks, applyFilters, stored } from "@factor/api"
import { getObservables } from "@factor/app"
import Vue, { VueConstructor } from "vue"
import { FactorPostState } from "@factor/post/types"
export default (): VueConstructor => {
  return Vue.extend({
    data() {
      return {
        scrollClass: ""
      }
    },
    computed: {
      post(): FactorPostState {
        return stored("post")
      },
      ui(this: VueConstructor): string {
        const { meta = {} } = this.$route.matched.find(_ => _.meta.ui) || {}

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
      injectedComponents(): Function[] {
        const siteComponents = applyFilters("site-components", [])

        return siteComponents.map(
          (_: { name: string; component: Function }) => _.component
        )
      }
    },

    watch: {
      ui: {
        handler: function(to: string, from: string): void {
          if (typeof document != "undefined") {
            const _el = document.documentElement
            _el.classList.remove(from)
            _el.classList.add(to)
          }
        }
      }
    },
    mounted() {
      this.setScrollClass()
      window.addEventListener("scroll", () => this.setScrollClass())
    },

    async serverPrefetch() {
      return await runCallbacks("global-prefetch", this.$route)
    },

    methods: {
      setScrollClass(this: VueConstructor): void {
        this.scrollClass = window.pageYOffset == 0 ? "top" : "scrolled"
      }
    }
  })
}
