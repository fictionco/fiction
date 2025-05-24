import type { FictionApp, FictionEmail, FictionMedia, FictionRouter, FictionServer, FictionUser } from '@fiction/core'
import type { FictionPluginSettings } from '@fiction/core/plugin.js'
import type { FictionStripe } from '@fiction/plugin-stripe/index.js'
import type { FictionAi } from '@fiction/plugins/plugin-ai/index.js'
import type { CardFactory } from '@fiction/site/cardFactory.js'
import type { Card, CardConfigPortable, CardTemplate, TableCardConfig } from '@fiction/site/index.js'
import type { dashTemplate } from './dashboard/templates.js'
import type { WidgetLoader } from './widgets/index.js'
import { EnvVar, vars } from '@fiction/core'
import { FictionPlugin } from '@fiction/core/plugin.js'
import { safeDirname, sortPriority, vue } from '@fiction/core/utils'
import { cardTemplate } from '@fiction/site/index.js'

export * from './tools/tools.js'
export * from './types.js'
export * from './utils/index.js'

vars.register(() => [
  new EnvVar({ name: 'PROXYCURL_API_KEY' }),
])

export type FictionAdminSettings = {
  fictionEmail: FictionEmail
  fictionUser: FictionUser
  fictionMedia: FictionMedia
  fictionApp: FictionApp
  fictionRouter: FictionRouter
  fictionServer: FictionServer
  fictionAi: FictionAi
  proxycurlApiKey?: string
} & FictionPluginSettings

type PageLoader = (args: { factory: CardFactory }) => (Promise<CardConfigPortable[]> | CardConfigPortable[])

type AdminFeature = { key: string, getPages?: PageLoader, getTemplates?: () => Promise<CardTemplate<any>[]> }

export class FictionAdmin extends FictionPlugin<FictionAdminSettings> {
  constructor(settings: FictionAdminSettings) {
    super('FictionAdmin', { root: safeDirname(import.meta.url), ...settings })
  }

  urls() {
    const appUrl = this.settings.fictionApp.appUrl.value
    return { auth: `${appUrl}/app/auth`, dashboard: `${appUrl}/app`, settings: `${appUrl}/app/settings` }
  }

  async redirectIfLoggedOut() {
    if (typeof window === 'undefined') {
      return
    }

    const { fictionUser } = this.settings

    const u = await fictionUser.userInitialized({ caller: 'FictionAdmin' })

    if (!u) {
      window.location.href = `${this.urls().auth}?redirect=${encodeURIComponent(window.location.href)}`
      return false
    }
    else {
      return true
    }
  }

  widgetLoaders = vue.shallowRef<WidgetLoader[]>([
    {
      key: 'overview',
      loader: () => ({
        el: vue.defineAsyncComponent(() => import('./widgets/overview/ElWidget.vue')),
        title: 'Overview',
        description: 'Overview of your dashboard',
        priority: 0,
      }),
    },
  ])

  async getWidgets(args: { card: Card }) {
    const { card } = args
    const widgets = await Promise.all(this.widgetLoaders.value.map(async _ => _.loader({ fictionAdmin: this, card })))
    return sortPriority(widgets, { centerNumber: 100 })
  }

  features = vue.shallowRef<AdminFeature[]>([
    {
      key: 'settings',
      getPages: async ({ factory }) => [
        await factory.fromTemplate<typeof dashTemplate>({
          templateId: 'dash',
          slug: 'settings',
          title: `Settings`,
          userConfig: { navIcon: 'i-tabler-settings', navIconAlt: 'i-tabler-settings-filled' },
          cards: [
            await factory.fromTemplate({ templateId: 'tplSettingsPage' }),
          ],
        }),
        await factory.fromTemplate<typeof dashTemplate>({
          templateId: 'dash',
          slug: 'welcome',
          isHome: true,
          title: 'Home',
          cards: [
            await factory.fromTemplate({ templateId: 'tplDashboardWelcome' }),
          ],
          userConfig: { isNavItem: true, navIcon: 'i-heroicons-home', navIconAlt: 'i-heroicons-home-20-solid', priority: 0 },
        }),
      ],
      getTemplates: async () => {
        return [
          cardTemplate({ templateId: 'tplSettingsPage', el: vue.defineAsyncComponent(() => import('./settings/SettingsMain.vue')) }),
          cardTemplate({ templateId: 'tplDashboardWelcome', el: vue.defineAsyncComponent(() => import('./dashboard/ViewDashboard.vue')) }),
        ]
      },
    },
  ])

  async getAdminPages(args: { factory: CardFactory }): Promise<TableCardConfig[]> {
    const { factory } = args
    const pages = await Promise.all(this.features.value.map(async _ => _.getPages?.({ factory })))

    return pages.flat().filter(Boolean) as TableCardConfig[]
  }

  async getAdminTemplates(): Promise<CardTemplate[]> {
    const templates = await Promise.all(this.features.value.map(async _ => _.getTemplates?.()))
    return templates.flat().filter(Boolean) as CardTemplate[]
  }

  addFeature(args: AdminFeature) {
    this.features.value.push(args)
  }

  async onClientMounted(args: { card: Card }) {
    const { card } = args

    const { fictionEnv } = this.settings

    const service = fictionEnv.getService<{ fictionStripe?: FictionStripe }>()

    const user = await service.fictionUser.userInitialized({ caller: 'DashWrap' })

    if (!user) {
      await card.goto('/auth', { isRedirect: true, caller: 'Admin Client Mount: Not Logged In' })
    }
    else if (service.fictionUser.activeOrganization.value?.needsOnboarding) {
      await card.goto('/onboard', { retainQueryVars: true, isRedirect: true, caller: 'Admin Client Mount: Needs Onboarding' })
    }

    if (user && service.fictionStripe)
      await service.fictionStripe.customerInitialized({ caller: 'DashWrap' })
  }
}
