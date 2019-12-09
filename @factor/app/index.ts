import { setting } from "@factor/api/settings"
import { addFilter, applyFilters, addCallback } from "@factor/api/hooks"
import { onEvent } from "@factor/api/events"
export * from "./extend-app"
import { RouteConfig } from "vue-router"

const waitForMountApp = (): Promise<void> => {
  return new Promise(resolve => onEvent("app-mounted", () => resolve()))
}

const clientIsMountedPromise = waitForMountApp()

// Allows components to definitively wait for client to init
// otherwise we might throw hydration errors
export const appMounted = async (callback?: Function): Promise<void> => {
  await clientIsMountedPromise

  if (callback) callback()

  return
}

export const setup = (): void => {
  addCallback({
    hook: "initialize-app",
    key: "setupApp",
    callback: () => {
      const factorError404 = setting("app.components.error404")
      const factorContent = setting("app.components.content")

      if (!factorError404 || !factorContent) {
        throw new Error("core components missing")
      }

      addFilter({
        hook: "routes",
        key: "appRoutes",
        callback: (_: RouteConfig[]) => {
          const contentRoutes = applyFilters("content-routes", [
            {
              name: "forbidden",
              path: "/forbidden",
              component: factorError404,
              meta: { error: 403 }
            }
          ]).filter((route: RouteConfig, index: number, self: RouteConfig[]) => {
            // remove duplicate paths
            const lastIndexOf = self.map(_ => _.path).lastIndexOf(route.path)
            return index === lastIndexOf
          })

          _.push({
            path: "/",
            component: factorContent,
            children: contentRoutes
          })

          _.push({
            path: "*",
            component: factorContent,
            children: applyFilters("content-routes-unmatched", [
              {
                name: "notFound",
                path: "*",
                component: factorError404,
                meta: { error: 404 }
              }
            ]),
            priority: 3000
          })

          return _
        }
      })
    }
  })
}

setup()
