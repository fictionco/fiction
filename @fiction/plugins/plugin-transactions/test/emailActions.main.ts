import * as adminTheme from '@fiction/admin/theme'
import CardSite from '@fiction/cards/CardSite.vue'
import { AppRoute, type ServiceConfig, vue } from '@fiction/core'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import * as fictionTheme from '@fiction/theme-fiction'
import { EmailAction, FictionTransactions } from '..'
import '@fiction/plugin-ai'

export async function setup(args: { context?: 'node' | 'app', mainFilePath?: string } = {}) {
  const { context } = args
  const mainFilePath = args.mainFilePath || new URL(import.meta.url).pathname

  const testUtils = await createSiteTestUtils({
    mainFilePath,
    context,
    themes: [fictionTheme.setup, adminTheme.setup],
    delaySiteRouterCreation: true, // created on editor start
  })

  const siteRouter = testUtils.fictionRouter
  const component = CardSite
  testUtils.fictionRouter.update([
    new AppRoute({ name: 'dash', path: '/app/:viewId?/:itemId?', component, props: { siteRouter, themeId: 'admin' } }),
    new AppRoute({ name: 'engine', path: '/:viewId?/:itemId?', component, props: { siteRouter, themeId: 'fiction' } }),
  ])

  const fictionTransactions = new FictionTransactions({ ...testUtils })

  const service = { ...testUtils, fictionTransactions }

  const actionId = 'testAction'

  const emailAction = new EmailAction({
    actionId,
    template: vue.defineAsyncComponent(async () => import('./ElTestAction.vue')),
    fictionTransactions,
    emailConfig: async (emailVars) => {
      const emailConfig = {
        emailVars,
        subject: `${emailVars.appName}: Email Action Subject`,
        heading: 'Email Action Heading',
        subHeading: 'Email Action Subheading',
        bodyMarkdown: `Email Action Body Markdown`,
        to: `${emailVars.email}`,
        actions: [
          {
            name: 'Verify Email',
            href: emailVars.callbackUrl,
            btn: 'primary' as const,
          },
        ],
      }

      return emailConfig
    },
  })

  return {
    service: { ...service, emailAction },
    runVars: {},
    runCommand: async args => service.runApp(args),
    createMount: async args => service.fictionApp.mountApp(args),
  } satisfies ServiceConfig
}
