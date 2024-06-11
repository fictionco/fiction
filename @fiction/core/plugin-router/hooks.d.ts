import '@fiction/core/plugin-env/hooks'
import type { vueRouter } from '../utils/index.ts'
import type { NavigateRoute } from './types.ts'

type RLoc = vueRouter.RouteLocationNormalized
declare module '@fiction/core/plugin-env/hooks' {
  interface FictionEnvHookDictionary {
    routeBeforeEach: { args: [{ to: RLoc, from: RLoc, navigate: NavigateRoute }] }
    routeAfterEach: { args: [{ to: RLoc, from: RLoc } ] }
  }
}
