export default Factor => {
  return {
    data() {
      return {
        scrollClass: ""
      }
    },
    mounted() {
      this.setScrollClass()
      window.addEventListener("scroll", () => {
        this.setScrollClass()
      })
    },
    computed: {
      ui() {
        const { meta: { ui = "app" } = {} } =
          this.$route.matched.find(_ => _.meta.ui) || {}

        return `factor-${ui}`
      },
      classes() {
        const siteClasses = this.$globals.routeClass || []

        return [...siteClasses, this.scrollClass]
      },
      injectedComponents() {
        return this.$filters.apply("site-components", {})
      }
    },

    serverPrefetch() {
      return this.$filters.run("site-prefetch")
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
