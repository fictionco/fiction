import { RouteRecordRaw } from "vue-router"
/**
 * Pull routes for sitemap out of a router config
 * @recursive
 */
export const getRouterPaths = (
  routes: RouteRecordRaw[],
  parent = "",
): string[] => {
  let out: string[] = []

  routes
    .filter((_) => _.path !== "*")
    .forEach((_) => {
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
  const allPaths = getRouterPaths([])
  const theRoutes = allPaths.filter((fullPath: string, index: number) => {
    return !fullPath.includes(":") && allPaths.indexOf(fullPath) == index
  })

  return theRoutes
}
