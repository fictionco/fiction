import type { FactorStripe } from '@factor/plugin-stripe'
import type {
  FactorApp,
  FactorAws,
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
interface FactorAdminSettings {
  hooks?: HookType<AdminHookDictionary>[]
  factorEnv: FactorEnv
  factorDb: FactorDb
  factorUser?: FactorUser
  factorStripe?: FactorStripe
  factorEmail: FactorEmail
  factorServer: FactorServer
  factorApp: FactorApp
  factorRouter: FactorRouter
  factorAws?: FactorAws
}

export class FactorAdmin extends FactorPlugin<FactorAdminSettings> {
  factorEnv = this.settings.factorEnv
  factorDb = this.settings.factorDb
  factorUser = this.settings.factorUser
  factorStripe = this.settings.factorStripe
  factorEmail = this.settings.factorEmail
  factorServer = this.settings.factorServer
  factorApp = this.settings.factorApp
  factorRouter = this.settings.factorRouter
  factorAws = this.settings.factorAws
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
  constructor(settings: FactorAdminSettings) {
    super('admin', settings)

    this.factorEnv?.uiPaths.push(`${this.root}/*.vue`, `${this.root}/**/*.vue`)

    this.factorRouter?.update(routes())
  }

  getOrgMenu() {
    if (!this.factorRouter)
      throw new Error('no router')

    const baseMenu = [
      this.factorRouter.getRouteMenuItem('orgSettings'),
      this.factorRouter.getRouteMenuItem('team'),
      this.factorRouter.getRouteMenuItem('developer'),
    ]

    return this.utils.vue.computed(() => {
      const menu: MenuGroup[] = [{ menu: baseMenu }]

      return menu
    })
  }
}
