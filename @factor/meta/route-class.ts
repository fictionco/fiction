import { addFilter, addCallback, pushToFilter } from "@factor/tools"
import Vue, { Component } from "vue"

import { getObservables } from "@factor/app/extend-app"

addCallback(
  "ssr-context-callbacks",
  ({ matchedComponents }: { matchedComponents: Component[] }) =>
    matchedComponents.forEach((_: Component) => setRouteClass(_))
)

addFilter("before-app", () => {
  if (process.env.FACTOR_SSR !== "server") manageClient()
})

addFilter("register-global-observables", (__: Record<string, any>) => {
  return { ...__, routeClass: [] }
})

pushToFilter("observable-class-keys", "routeClass")

function setRouteClass(options: Vue): void {
  if (!options) return

  const { routeClass } = options
  if (routeClass) {
    let routeClassArray = typeof routeClass === "function" ? routeClass() : routeClass

    if (typeof routeClassArray == "string") routeClassArray = [routeClassArray]
    else if (!routeClassArray) return

    getObservables().routeClass.push(...routeClassArray)
  }
}

function manageClient(): void {
  addCallback("client-route-after", () => {
    getObservables().routeClass = []
  })

  Vue.mixin(
    Vue.extend({
      watch: {
        $route: {
          handler: function(this: Component): void {
            setRouteClass(this.$options)
          },
          immediate: true
        }
      }
    })
  )
}
