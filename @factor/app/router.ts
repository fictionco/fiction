import { applyFilters, runCallbacks, pushToFilter, addFilter } from "@factor/api/hooks"
import { emitEvent } from "@factor/api/events"
import Vue from "vue"
import VueRouter, { RouteConfig, Route, RouterOptions, Location } from "vue-router"
import qs from "qs"
import { uniq } from "@factor/api"
Vue.use(VueRouter)

let __initialPageLoad = true

/**
 * In client, when we change routes, we should run checks for auth, preloaders, etc.
 * @param to - next route
 * @param from - current route
 * @param next - next function, call with false to prevent nav, must call!
 *
 * @remarks
 *  If a user needs to sign in (with modal) or be redirected after an action
 *  Those hooks may not want the navigation to continue
 *  As they will be handling with navigation with a redirect instead
 */
const hookClientRouterBefore = async (
  to: Route,
  from: Route,
  next: Function
): Promise<void> => {
  if (__initialPageLoad || to.path == from.path) {
    next()
  } else {
    const doBefore = runCallbacks<boolean | undefined>("client-route-before", {
      to,
      from,
      next
    })

    emitEvent("ssr-progress", "start")

    const results: (boolean | undefined)[] = await doBefore

    if (results.length == 0 || !results.some(_ => _ === false)) {
      // proceed
      next()
    } else {
      // Abort navigation
      emitEvent("ssr-progress", "finish")
      next(false)
    }
  }
}

const hookClientRouterAfter = (to: Route, from: Route): void => {
  __initialPageLoad = false
  emitEvent("ssr-progress", "finish")
  applyFilters("client-route-after", [], { to, from })

  const { query } = to

  if (query._action) {
    runCallbacks(`route-query-action-${query._action}`, query)
  }
}

/**
 * Pull routes for sitemap out of a router config
 */
export const getRouterPaths = (routes: RouteConfig[], parent = ""): string[] => {
  let out: string[] = []

  routes
    .filter(_ => _.path !== "*")
    .forEach(_ => {
      if (_.path) {
        let _p = _.path

        if (parent && !_.path.startsWith("/")) {
          _p = `${parent}/${_.path}`
        } else if (parent && _.path == "/") {
          _p = parent
        }

        out.push(_p)
      }

      if (_.children) {
        out = [...out, ...getRouterPaths(_.children, _.path)]
      }
    })

  return out
}

/**
 * get statically assigned routes
 * then remove duplicated and dynamic routes (which include a colon (:))
 */
export const getKnownRoutePaths = (): string[] => {
  const contentRoutes = applyFilters("content-routes", [])

  const theRoutes = uniq(getRouterPaths(contentRoutes)).filter((fullPath: string) => {
    return !fullPath.includes(":")
  })

  return theRoutes
}

/**
 * Creates the Vue Router instance
 * @library vue-router
 */
export const createRouter = (): VueRouter => {
  const routes: RouteConfig[] = applyFilters("routes", []).filter((_: RouteConfig) => _)

  const router = new VueRouter({
    mode: "history",
    routes,
    base: applyFilters("app-base-route", "/"),
    scrollBehavior: (to, from, saved) => {
      const position = { x: 0, y: 0 }

      if (to.hash) {
        return { ...position, selector: to.hash }
      } else if (saved) {
        return { ...position, ...saved }
      } else {
        return position
      }
    },
    parseQuery: query => qs.parse(query),
    stringifyQuery: query => (qs.stringify(query) ? `?${qs.stringify(query)}` : "")
  } as RouterOptions)

  /**
   * Load hooks for client navigation handling
   * Don't run on server as this causes the hooks to run twice
   */
  if (process.env.FACTOR_BUILD_ENV == "client") {
    router.beforeEach((to, from, next) => hookClientRouterBefore(to, from, next))
    router.afterEach((to, from) => hookClientRouterAfter(to, from))
  }

  Vue.$router = router

  return router
}

export const getRouter = (): VueRouter => {
  return Vue.$router
}

/**
 * Adds a route to the app.
 *
 * @param routeItem Standard Route Config
 * @param options Optional route options
 * @category app
 */
export const addContentRoute = (routeItem: RouteConfig, options?: object): void => {
  pushToFilter({
    hook: "content-routes",
    key: `add-${routeItem.path}`,
    item: routeItem,
    ...options
  })
}

/**
 * Recurse through routes and child routes
 * Calling a callback for each route
 * @param routes
 * @param cb
 */
const eachRoute = (
  routes: RouteConfig[],
  cb: (r: RouteConfig) => RouteConfig | undefined
): RouteConfig[] => {
  const newRoutes: RouteConfig[] = []
  routes.forEach((rr: RouteConfig) => {
    const edited = cb(rr)
    if (edited) {
      // Recursive
      if (edited.children) {
        edited.children = eachRoute(edited.children, cb)
      }

      newRoutes.push(edited)
    }
  })

  return newRoutes
}

/**
 * Make edits to existing routes
 * This can be useful to modify routes added by extensions and themes
 * For now, only supports removing the route by path
 */
export const editContentRoute = ({
  path,
  action = "edit",
  callback
}: {
  path: string | string[];
  action: "remove" | "edit";
  callback?: (r: RouteConfig) => RouteConfig | undefined;
}): void => {
  addFilter({
    hook: "content-routes",
    key: `edit-${path}`,
    callback: (allRoutes: RouteConfig[]): RouteConfig[] => {
      allRoutes = eachRoute(allRoutes, (r: RouteConfig): RouteConfig | undefined => {
        if (
          (typeof path == "object" && path.includes(r.path)) ||
          (typeof path == "string" && r.path == path)
        ) {
          if (action == "edit" && callback) {
            return callback(r)
          } else if (action == "remove") {
            return undefined
          } else {
            return r
          }
        } else return r
      })

      return allRoutes
    },
    priority: 200
  })
}

/**
 * Adds an array of routes to the router.
 *
 * @param _id A unique group identifier for the routes
 * @param routeItems Array of standard routes
 * @param options Optional route options
 * @category app
 */
export const addContentRoutes = ({
  key,
  routes
}: {
  key: string;
  routes: RouteConfig[] | (() => RouteConfig[]);
}): void => {
  addFilter({
    hook: "content-routes",
    key,
    callback: (allRoutes: RouteConfig[]): RouteConfig[] => {
      const r = typeof routes === "function" ? routes() : routes

      return allRoutes.concat(r)
    }
  })
}

export const currentRoute = (): Route => {
  return getRouter().currentRoute
}

export const navigateToRoute = (r: Location): Promise<Route> => {
  return getRouter().push(r)
}
