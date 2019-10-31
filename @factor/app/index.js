import {
  onEvent,
  addFilter,
  applyFilters,
  setting,
  registerOnFilter
} from "@factor/tools"

let clientIsMountedPromise = waitForMountApp()

// Allows components to definitively wait for client to init
// otherwise we might throw hydration errors
export async function appMounted(callback) {
  await clientIsMountedPromise

  if (callback) callback()

  return true
}

function waitForMountApp() {
  return new Promise(resolve => onEvent("app-mounted", () => resolve()))
}

const error404 = setting("app.error404")
const content = setting("app.content")

if (!error404 || !content) {
  throw new Error("Factor core app components are undefined.")
}

registerOnFilter("components", "error-404", error404)

addFilter("routes", _ => {
  const contentRoutes = applyFilters("content-routes", [
    {
      name: "forbidden",
      path: "/forbidden",
      component: error404,
      meta: { error: 403 }
    }
  ]).filter((route, index, self) => {
    // remove duplicate paths
    const lastIndexOf = self.map(_ => _.path).lastIndexOf(route.path)
    return index === lastIndexOf
  })

  _.push({
    path: "/",
    component: content,
    children: contentRoutes
  })

  _.push({
    path: "*",
    component: content,
    children: applyFilters("content-routes-unmatched", [
      {
        name: "notFound",
        path: "*",
        component: error404,
        meta: { error: 404 }
      }
    ]),
    priority: 3000
  })

  return _
})
