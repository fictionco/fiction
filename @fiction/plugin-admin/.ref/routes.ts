import type { FictionRouter, FictionUser, vueRouter } from '@fiction/core'
import { AppRoute, log } from '@fiction/core'
import type { FictionAdmin } from '..'

export function getRoutes(args: { fictionAdmin: FictionAdmin, fictionUser?: FictionUser }) {
  const { fictionUser } = args
  const base = args.fictionAdmin.adminBaseRoute

  const logger = log.contextLogger('AdminRoutes')

  const authBefore = async (args: { fictionRouter: FictionRouter, redirect?: () => string, isSSR: boolean }): Promise<ReturnType<vueRouter.NavigationGuard>> => {
    const { redirect, fictionRouter, isSSR } = args

    if (!isSSR) {
      if (!fictionUser)
        throw new Error('fictionUser not defined')

      const user = await fictionUser?.userInitialized()

      if (!user) {
        logger.error('user not logged in -> /', { data: { user, fictionRouter: fictionRouter.routerId, isSSR } })
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
    //   before: ({ fictionRouter, isSSR }) => authBefore({ isSSR, fictionRouter, redirect: () => fictionRouter.link('admin', { viewId: 'home' }, {}).value }),
    // }),
    // new AppRoute({
    //   name: 'admin',
    //   path: `${base}/:orgId/:viewId?/:itemId?`,
    //   component: () => import('./el/EngineAdmin.vue'),
    //   before: ({ fictionRouter, isSSR }) => authBefore({ isSSR, fictionRouter }),
    // }),

  ]
}
