import type { FictionAdmin } from '@fiction/admin'
import type { template as TransactionTemplate } from '@fiction/cards/page-transaction/index.js'
import type { FictionServer } from '@fiction/core'
import type { FictionApp } from '@fiction/core/plugin-app'
import type { FictionEmail } from '@fiction/core/plugin-email'
import type { FictionMedia } from '@fiction/core/plugin-media'
import type { FictionRouter } from '@fiction/core/plugin-router'
import type { FictionUser } from '@fiction/core/plugin-user'
import type { FictionPluginSettings } from '@fiction/core/plugin.js'
import type { FictionTransactions } from '@fiction/plugin-transactions'
import { FictionPlugin } from '@fiction/core/plugin.js'
import { safeDirname, vue } from '@fiction/core/utils'
import { getWidgets } from './widgets/widgets'

export type FictionOnboardSettings = {
  fictionEmail: FictionEmail
  fictionTransactions: FictionTransactions
  fictionUser: FictionUser
  fictionMedia: FictionMedia
  fictionApp: FictionApp
  fictionRouter: FictionRouter
  fictionServer: FictionServer
  fictionAdmin: FictionAdmin
} & FictionPluginSettings

export class FictionOnboard extends FictionPlugin<FictionOnboardSettings> {
  constructor(settings: FictionOnboardSettings) {
    super('FictionOnboard', { root: safeDirname(import.meta.url), ...settings })

    this.admin()
  }

  admin() {
    const { fictionAdmin } = this.settings
    const widgets = getWidgets(this.settings)

    fictionAdmin.widgetRegister.value.push(...Object.values(widgets))
    fictionAdmin.addToWidgetArea('homeMain', [{ key: 'overviewWidget', priority: 40 }])
    fictionAdmin.addToWidgetArea('homeSecondary', [{ key: 'onboardWelcome', priority: 40 }])

    fictionAdmin.addAdminPages({
      key: 'onboardSurvey',
      loader: async ({ factory }) => [
        await factory.fromTemplate<typeof TransactionTemplate>({
          templateId: 'cardTransactionViewV1',
          slug: 'onboard',
          title: 'Onboard Survey',
          cards: [
            await factory.fromTemplate({
              el: vue.defineAsyncComponent(async () => import('./survey/OnboardSurvey.vue')),
            }),
          ],
        }),

      ],
    })
  }
}
