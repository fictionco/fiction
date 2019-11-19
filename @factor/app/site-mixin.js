import { runCallbacks, applyFilters } from "@factor/tools"
import { getObservables } from "@factor/app"

export default () => {
  return {
    data() {
      return {
        scrollClass: ""
      }
    },
    mounted() {
      this.setScrollClass()
      window.addEventListener("scroll", () => this.setScrollClass())
    },
    computed: {
      ui() {
        const { meta = {} } = this.$route.matched.find(_ => _.meta.ui) || {}

        let ui = meta.ui || "app"

        return `factor-${ui}`
      },
      classes() {
        const observables = getObservables()

        // Use observables for classes as these can change at any time
        const siteClasses = applyFilters("observable-class-keys", [])
          .map(_ => observables[_])
          .filter(_ => _ && Array.isArray(_))
          .map(arr => arr.join(" "))
          .join(" ")

        return [siteClasses, this.scrollClass]
      },
      injectedComponents() {
        const siteComponents = applyFilters("site-components", [])

        return siteComponents.map(_ => _.component)
      }
    },

    serverPrefetch() {
      return runCallbacks("site-pre-fetch")
    },
    methods: {
      setScrollClass() {
        this.scrollClass = window.pageYOffset == 0 ? "top" : "scrolled"
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
    }
  }
}
