import { FictionPlugin, type FictionPluginSettings } from '@fiction/core/plugin.js'
import { safeDirname, vue } from '@fiction/core/utils'
import type { FictionEmail } from '@fiction/core/plugin-email'
import type { FictionMedia } from '@fiction/core/plugin-media'
import type { FictionUser } from '@fiction/core/plugin-user'
import type { FictionApp } from '@fiction/core/plugin-app'
import type { FictionRouter } from '@fiction/core/plugin-router'
import type { FictionTransactions } from '@fiction/plugin-transactions'
import type { FictionServer } from '@fiction/core'
import { envConfig } from '@fiction/core'
import type { TableCardConfig } from '@fiction/site/index.js'
import { CardFactory } from '@fiction/site/cardFactory.js'
import { getEmails } from './emails/index.js'
import { createWidgetEndpoints } from './dashboard/util.js'
import type { Widget } from './dashboard/widget.js'
import type { WidgetLocation } from './types.js'
import { templates } from './templates.js'

export * from './tools/tools.js'
export * from './types.js'

envConfig.register({ name: 'ADMIN_UI_ROOT', onLoad: ({ fictionEnv }) => { fictionEnv.addUiRoot(safeDirname(import.meta.url)) } })

type FictionAdminSettings = {
  fictionEmail: FictionEmail
  fictionTransactions: FictionTransactions
  fictionUser: FictionUser
  fictionMedia: FictionMedia
  fictionApp: FictionApp
  fictionRouter: FictionRouter
  fictionServer: FictionServer
} & FictionPluginSettings

const factory = new CardFactory({ templates })
type PageLoader = (args: { factory: typeof factory }) => (Promise<TableCardConfig[]> | TableCardConfig[])

export class FictionAdmin extends FictionPlugin<FictionAdminSettings> {
  widgetRequests?: ReturnType<typeof createWidgetEndpoints>
  constructor(settings: FictionAdminSettings) {
    super('FictionAdmin', { root: safeDirname(import.meta.url), ...settings })
  }

  emailActions = getEmails({ fictionAdmin: this })

  widgetRegister = vue.shallowRef<Widget[]>([])
  widgetMapRaw = vue.shallowRef<Record<string, string[]>>({})
  addToWidgetArea(widgetArea: WidgetLocation, widgetKeys: string[]) {
    this.widgetMapRaw.value[widgetArea] = this.widgetMapRaw.value[widgetArea] ?? []
    this.widgetMapRaw.value[widgetArea]?.push(...widgetKeys)
  }

  adminPageLoaders = vue.shallowRef<PageLoader[]>([async ({ factory }) => [
    await factory.create({
      templateId: 'dash',
      slug: 'home',
      isHome: true,
      title: 'Home',
      cards: [await factory.create({ el: vue.defineAsyncComponent(async () => import('./dashboard/ViewDashboard.vue')) })],
      userConfig: { isNavItem: true, navIcon: 'i-heroicons-home', navIconAlt: 'i-heroicons-home-20-solid', priority: 0 },
    }),
  ]])

  async getAdminPages(): Promise<TableCardConfig[]> {
    const pages = await Promise.all(this.adminPageLoaders.value.map(loader => loader({ factory })))
    return pages.flat()
  }

  addAdminPages(getPages: PageLoader) {
    this.adminPageLoaders.value.push(getPages)
  }

  override async setup() {
    this.widgetRequests = createWidgetEndpoints({ fictionAdmin: this })
  }

  hooks() {
    const fictionUser = this.settings.fictionUser

    fictionUser.events.on('newUser', async (event) => {
      const { user, params } = event.detail

      // if (params.isVerifyEmail) {
      //   await this.emailActions.verifyEmailAction.serveSend({ recipient: user, queryVars: { code: user.verify?.code || '', email: user.email || '' } }, { server: true })
      // }
    })
  }
}
