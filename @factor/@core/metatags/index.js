export default Factor => {
  return new (class {
    constructor() {
      this.metatags = []
      this.routeClass = []

      Factor.$filters.callback("ssr-context-callbacks", ({ matchedComponents }) =>
        matchedComponents.forEach(_ => this.setRouteClass(_))
      )

      Factor.$filters.add("before-app", () => {
        if (Factor.FACTOR_SSR !== "server") {
          this.manageClient()
        }
      })
    }

    setRouteClass(options) {
      if (!options) {
        return
      }
      const { routeClass } = options
      if (routeClass) {
        let routeClassArray =
          typeof routeClass === "function" ? routeClass.call(this) : routeClass

        if (typeof routeClassArray == "string") {
          routeClassArray = [routeClassArray]
        } else if (!routeClassArray) {
          return
        }

        Factor.$globals.routeClass.push(...routeClassArray)
      }
    }

    manageClient() {
      const _this = this

      Factor.$filters.callback("client-route-after", ({ to, from, next }) => {
        Factor.$globals.routeClass = []
        Factor.$globals.metatags = []
      })

      Factor.mixin({
        created() {
          _this.setRouteClass(this.$options)
        },
        watch: {
          $route: {
            handler: function() {
              _this.setRouteClass(this.$options)
            }
          },
          immediate: true
        }
      })
    }
  })()
}
