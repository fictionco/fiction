import type {
  FactorApp,
  FactorDb,
  FactorEmail,
  FactorEnv,
  FactorRouter,
  FactorServer,
  FactorUser,
  HookType,
  MenuGroup,
  OrganizationMember,
} from '@factor/api'
import {
  FactorPlugin,
} from '@factor/api'

import routes from './routes'

const menuRouteKeys = {
  primary: [],
  secondary: [],
}

type MenuConfig = Record<keyof typeof menuRouteKeys, string[]>

export type AdminHookDictionary = {
  menus: { args: [MenuConfig, { relation?: OrganizationMember }] }
  organizationMenu: { args: [MenuGroup[]] }
}
interface PageLinesAdminSettings {
  hooks?: HookType<AdminHookDictionary>[]
  factorEnv: FactorEnv
  factorDb: FactorDb
  factorUser?: FactorUser
  factorEmail: FactorEmail
  factorServer: FactorServer
  factorApp: FactorApp
  factorRouter: FactorRouter
  redirectForLogin?: string
}

export class PageLinesAdmin extends FactorPlugin<PageLinesAdminSettings> {
  factorEnv = this.settings.factorEnv
  factorDb = this.settings.factorDb
  factorUser = this.settings.factorUser
  factorEmail = this.settings.factorEmail
  factorServer = this.settings.factorServer
  factorApp = this.settings.factorApp
  factorRouter = this.settings.factorRouter
  redirectForLogin = this.settings.redirectForLogin
  queries = this.createQueries()
  requests = this.createRequests({
    queries: this.queries,
    basePath: '/user',
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  hooks = this.settings.hooks || []
  root = this.utils.safeDirname(import.meta.url)

  menuConfig?: MenuConfig
  badges = this.utils.vue.ref<
    Record<
      string,
      { text: string, action: string, actionText: string, color: string }
    >
  >({},
  )

  orgMenu = this.utils.vue.shallowRef<MenuGroup[]>([])
  isLive = this.factorEnv?.isProd
  constructor(settings: PageLinesAdminSettings) {
    super('admin', settings)

    this.factorEnv?.addUiPaths([`${this.root}/*.vue`, `${this.root}/**/*.vue`])

    this.factorRouter?.update(routes())
  }

  getOrgMenu() {
    if (!this.factorRouter)
      throw new Error('no router')

    // const baseMenu = [
    //   // this.factorRouter.getRouteMenuItem('orgSettings'),
    //   // this.factorRouter.getRouteMenuItem('team'),
    //   // this.factorRouter.getRouteMenuItem('developer'),
    // ]

    return this.utils.vue.computed(() => {
      const menu: MenuGroup[] = [{ menu: [] }]

      return menu
    })
  }
}
