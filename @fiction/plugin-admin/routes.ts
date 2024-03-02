import type { FactorRouter, FactorUser, vueRouter } from '@fiction/core'
import { AppRoute, log } from '@fiction/core'
import type { FactorAdmin } from '.'

export function getRoutes(args: { factorAdmin: FactorAdmin, factorUser?: FactorUser }) {
  const { factorUser } = args
  const base = args.factorAdmin.adminBaseRoute

  const logger = log.contextLogger('AdminRoutes')

  const authBefore = async (args: { factorRouter: FactorRouter, redirect?: () => string, isSSR: boolean }): Promise<ReturnType<vueRouter.NavigationGuard>> => {
    const { redirect, factorRouter, isSSR } = args

    if (!isSSR) {
      if (!factorUser)
        throw new Error('factorUser not defined')

      const user = await factorUser?.userInitialized()

      if (!user) {
        logger.error('user not logged in -> /', { data: { user, factorRouter: factorRouter.routerId, isSSR } })
        return '/'
      }
    }

    return redirect ? redirect() : true
  }

  return [

    new AppRoute({ name: 'appTest', path: '/testing', component: () => import('./test/AppTest.vue') }),
    // new AppRoute({
    //   name: 'adminNaked',
    //   path: base,
    //   component: () => import('./el/EngineAdmin.vue'),
    //   before: ({ factorRouter, isSSR }) => authBefore({ isSSR, factorRouter, redirect: () => factorRouter.link('admin', { viewId: 'home' }, {}).value }),
    // }),
    // new AppRoute({
    //   name: 'admin',
    //   path: `${base}/:orgId/:viewId?/:itemId?`,
    //   component: () => import('./el/EngineAdmin.vue'),
    //   before: ({ factorRouter, isSSR }) => authBefore({ isSSR, factorRouter }),
    // }),

  ]
}
