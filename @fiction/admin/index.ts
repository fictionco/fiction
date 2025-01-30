import type { template as TransactionTemplate } from '@fiction/cards/page-transaction/index.js'
import type { FictionServer } from '@fiction/core'
import type { FictionApp } from '@fiction/core/plugin-app'
import type { FictionEmail } from '@fiction/core/plugin-email'
import type { FictionMedia } from '@fiction/core/plugin-media'
import type { FictionRouter } from '@fiction/core/plugin-router'
import type { FictionUser } from '@fiction/core/plugin-user'
import type { FictionPluginSettings } from '@fiction/core/plugin.js'
import type { FictionStripe } from '@fiction/plugin-stripe/index.js'
import type { FictionTransactions } from '@fiction/plugin-transactions'
import type { CardFactory } from '@fiction/site/cardFactory.js'
import type { Card, TableCardConfig } from '@fiction/site/index.js'
import type { template as dashTemplate, panelTemplate } from './dashboard/cardDash.js'
import type { Widget } from './dashboard/widget.js'
import type { WidgetLocation } from './types.js'
import { envConfig } from '@fiction/core'
import { FictionPlugin } from '@fiction/core/plugin.js'
import { safeDirname, vue } from '@fiction/core/utils'
import { createWidgetEndpoints } from './dashboard/util.js'
import { getEmails } from './emails/index.js'
import { getWidgets } from './widgets/widgets'

export * from './tools/tools.js'
export * from './types.js'

envConfig.register({ name: 'ADMIN_UI_ROOT', onLoad: ({ fictionEnv }) => { fictionEnv.addUiRoot(safeDirname(import.meta.url)) } })

export type FictionAdminSettings = {
  fictionEmail: FictionEmail
  fictionTransactions: FictionTransactions
  fictionUser: FictionUser
  fictionMedia: FictionMedia
  fictionApp: FictionApp
  fictionRouter: FictionRouter
  fictionServer: FictionServer
} & FictionPluginSettings

type PageLoader = (args: { factory: CardFactory }) => (Promise<TableCardConfig[]> | TableCardConfig[])

export type WidgetFactoryEntry = { key: string, priority?: number }

export class FictionAdmin extends FictionPlugin<FictionAdminSettings> {
  widgetRequests?: ReturnType<typeof createWidgetEndpoints>
  constructor(settings: FictionAdminSettings) {
    super('FictionAdmin', { root: safeDirname(import.meta.url), ...settings })

    this.admin()
  }

  admin() {
    const widgets = getWidgets(this.settings)

    this.widgetRegister.value.push(...Object.values(widgets))

    this.addToWidgetArea('homeMain', [{ key: 'overviewWidget', priority: 40 }])
    this.addToWidgetArea('homeSecondary', [{ key: 'onboardWelcome', priority: 40 }])

    this.addAdminPages({
      key: 'onboardSurvey',
      loader: async ({ factory }) => [
        await factory.fromTemplate<typeof TransactionTemplate>({
          templateId: 'cardTransactionViewV1',
          slug: 'onboard',
          title: 'Onboard Survey',
          cards: [
            await factory.fromTemplate({
              el: vue.defineAsyncComponent(() => import('./dashboard/OnboardSurvey.vue')),
            }),
          ],
        }),

      ],
    })
  }

  emailActions = getEmails({ fictionAdmin: this })

  widgetRegister = vue.shallowRef<Widget[]>([])
  widgetMapRaw = vue.shallowRef<Record<string, WidgetFactoryEntry[]>>({})
  addToWidgetArea<T extends WidgetFactoryEntry[] = WidgetFactoryEntry[]>(widgetArea: WidgetLocation, widgetKeys: T) {
    this.widgetMapRaw.value[widgetArea] = this.widgetMapRaw.value[widgetArea] ?? []
    this.widgetMapRaw.value[widgetArea]?.push(...widgetKeys)
  }

  adminPageLoaders = vue.shallowRef<PageLoader[]>([async ({ factory }) => [
    await factory.fromTemplate<typeof dashTemplate>({
      templateId: 'dash',
      slug: '_home',
      isHome: true,
      title: 'Home',
      cards: [
        await factory.fromTemplate<typeof panelTemplate>({
          el: vue.defineAsyncComponent(async () => import('./dashboard/ViewDashboard.vue')),
        }),
      ],
      userConfig: { isNavItem: true, navIcon: 'i-heroicons-home', navIconAlt: 'i-heroicons-home-20-solid', priority: 0 },
    }),
  ]])

  async getAdminPages(args: { factory: CardFactory }): Promise<TableCardConfig[]> {
    const { factory } = args
    const pages = await Promise.all(this.adminPageLoaders.value.map(async loader => loader({ factory })))

    return pages.flat()
  }

  addAdminPages(args: { key: string, loader: PageLoader }) {
    const { loader } = args
    this.adminPageLoaders.value.push(loader)
  }

  override async setup() {
    this.widgetRequests = createWidgetEndpoints({ fictionAdmin: this })
  }

  hooks() {
    const fictionUser = this.settings.fictionUser

    fictionUser.events.on('newUser', async (_event) => {
      // const { user, params } = event.detail

      // if (params.isVerifyEmail) {
      //   await this.emailActions.verifyEmailAction.serveSend({ recipient: user, queryVars: { code: user.verify?.code || '', email: user.email || '' } }, { server: true })
      // }
    })
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
