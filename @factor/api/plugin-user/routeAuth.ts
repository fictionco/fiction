import { log } from "@factor/api/plugin-log"
import { isNode, isSearchBot } from "../utils"
import { FactorRouter } from "../plugin-router"
import { AuthCallback, FullUser } from "./types"
interface RouteAuthConfig {
  required?: boolean
  redirect?: string
  allowBots?: boolean
}

export const routeAuthRedirects = async (
  factorRouter: FactorRouter,
  user: FullUser | undefined,
): Promise<void> => {
  // don't worry about redirects on server
  // if runs in node, this hangs causing test problems
  if (isNode()) return

  const router = factorRouter.router
  const currentRoute = router.currentRoute.value

  if (!currentRoute) return

  const { matched } = currentRoute

  let authConfig: RouteAuthConfig = { redirect: "/" }
  matched.forEach(({ meta: { auth } }) => {
    if (auth) {
      authConfig = { ...authConfig, ...(auth as RouteAuthConfig) }
    }
  })

  for (const matchedRoute of matched) {
    const auth = matchedRoute.meta.auth as AuthCallback
    if (auth) {
      const redirect = await auth({ user, searchBot: isSearchBot() })

      if (redirect) {
        log.info("routeAuthRedirects", "auth required redirect", {
          data: { redirect },
        })
        await router.push({ path: redirect })
      }
    }
  }
}
