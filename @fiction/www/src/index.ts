import path from 'node:path'
import { FactorUi } from '@fiction/ui'
import type { ServiceConfig } from '@fiction/core'
import { AppRoute, FactorApp, FactorAws, FactorDb, FactorEmail, FactorEnv, FactorMedia, FactorRouter, FactorServer, FactorUser, apiRoot, safeDirname } from '@fiction/core'

import { FactorTeam } from '@fiction/core/plugin-team'
import { FactorMonitor } from '@fiction/plugin-monitor'
import { FactorNotify } from '@fiction/plugin-notify'
import { FactorDevRestart } from '@fiction/core/plugin-env/restart'
import { FactorAdmin } from '@fiction/plugin-admin'
import { FactorAdminPluginIndex, createPluginConfig } from '@fiction/plugin-admin-index'

import XSite from '@fiction/plugin-sites/engine/XSite.vue'
import { FactorAi } from '@fiction/plugin-ai'
import { version } from '../package.json'
import { config as adminConfig } from './admin'
import { commands } from './commands'

const cwd = safeDirname(import.meta.url, '..')
const appName = 'Fiction'
const appEmail = 'hello@fiction.com'
const tld = 'cx'
const appUrl = `https://www.fiction.${tld}`
const appUrlSites = `https://*.fiction.${tld}`

const envFiles = [path.join(apiRoot, './.env')]

const factorEnv = new FactorEnv({
  cwd,
  envFiles,
  envFilesProd: envFiles,
  mainFilePath: path.join(cwd, './src/index.ts'),
  appName,
  appEmail,
  appUrl,
  version,
  commands,
})

const comboPort = +factorEnv.var('APP_PORT', { fallback: 4444 })

const factorRouter = new FactorRouter({
  routerId: 'parentRouter',
  factorEnv,
  baseUrl: factorEnv.appUrl,
  routes: (factorRouter) => {
    return [
      new AppRoute({ name: 'testInputs', path: '/inputs', component: (): Promise<any> => import('@fiction/ui/test/TestInputsAll.vue') }),
      new AppRoute({ name: 'dash', path: '/app/:viewId?/:itemId?', component: XSite, props: { siteRouter: factorRouter, themeId: 'admin' } }),
      new AppRoute({ name: 'engine', path: '/:viewId?/:itemId?', component: XSite, props: { siteRouter: factorRouter, themeId: 'fiction' } }),
    ]
  },

})

const factorApp = new FactorApp({
  liveUrl: factorEnv.appUrl,
  port: comboPort,
  factorRouter,
  isLive: factorEnv.isProd,
  uiPaths: [
    path.join(cwd, './src/**/*.{vue,js,ts,html}'),
    path.join(cwd, './src/*.{vue,js,ts,html}'),
  ],
  factorEnv,
  srcFolder: path.join(cwd, './src'),
})

const factorRouterSites = new FactorRouter({
  routerId: 'siteRouter',
  factorEnv,
  baseUrl: appUrlSites,
  routes: [new AppRoute({ name: 'engine', path: '/:viewId?/:itemId?', component: XSite })],
})

const factorAppSites = new FactorApp({
  appInstanceId: 'sites',
  factorEnv,
  factorRouter: factorRouterSites,
  port: +factorEnv.var('SITES_PORT', { fallback: 6565 }),
  localHostname: '*.lan.com',
  liveUrl: appUrlSites,
  altHostnames: [{ prod: 'theme-minimal.fiction.com', dev: 'theme-minimal.lan.com' }],
  isLive: factorEnv.isProd,
  srcFolder: path.join(cwd, './src'),
})

const factorServer = new FactorServer({ factorEnv, serverName: 'FactorMain', port: comboPort, liveUrl: appUrl })
const factorDb = new FactorDb({ factorEnv, factorServer, connectionUrl: factorEnv.var('POSTGRES_URL') })
const factorNotify = new FactorNotify({ factorEnv })
const factorEmail = new FactorEmail({ factorEnv, smtpHost: factorEnv.var('SMTP_HOST'), smtpPassword: factorEnv.var('SMTP_PASSWORD'), smtpUser: factorEnv.var('SMTP_USER') })

const factorUser = new FactorUser({
  factorEnv,
  factorServer,
  factorDb,
  factorEmail,
  factorRouter,
  googleClientId: factorEnv.var('GOOGLE_CLIENT_ID'),
  googleClientSecret: factorEnv.var('GOOGLE_CLIENT_SECRET'),
  tokenSecret: factorEnv.var('TOKEN_SECRET'),
  hooks: [
    {
      hook: 'onLogout',
      callback: async () => {
        factorNotify.notifySuccess('You have been logged out.')
        await factorRouter.push('/')
      },
    },
  ],
})

const factorMonitor = new FactorMonitor({
  factorApp,
  factorEmail,
  factorEnv,
  slackWebhookUrl: factorEnv.var('SLACK_WEBHOOK_URL'),
  factorUser,
})

const basicService = {
  factorEnv,
  factorApp,
  factorRouter,
  factorServer,
  factorDb,
  factorUser,
  factorEmail,
  factorMonitor,
}

const factorAws = new FactorAws({
  factorEnv,
  awsAccessKey: factorEnv.var('AWS_ACCESS_KEY'),
  awsAccessKeySecret: factorEnv.var('AWS_ACCESS_KEY_SECRET'),
})

const factorMedia = new FactorMedia({
  factorEnv,
  factorDb,
  factorUser,
  factorServer,
  factorAws,
  bucket: 'factor-tests',
})

const factorAi = new FactorAi({
  ...basicService,
  factorMedia,
  pineconeApiKey: factorEnv.var('PINECONE_API_KEY'),
  pineconeEnvironment: factorEnv.var('PINECONE_ENVIRONMENT'),
  pineconeIndex: factorEnv.var('PINECONE_INDEX'),
  openaiApiKey: factorEnv.var('OPENAI_API_KEY'),
})

const pluginServices = {
  ...basicService,
  factorAppSites,
  factorRouterSites,
  factorAws,
  factorMedia,
}
const plugins = createPluginConfig([
  {
    load: () => import('@fiction/plugin-sites'),
    settings: { factorAppSites, factorRouterSites, flyIoApiToken: '', flyIoAppId: '' },
  },
])
const factorAdminPluginIndex = new FactorAdminPluginIndex({ ...pluginServices, plugins })

const factorAdmin = new FactorAdmin({
  ...pluginServices,
  pluginIndex: factorAdminPluginIndex,
  views: adminConfig.views,
  widgets: adminConfig.widgets,
  ui: adminConfig.ui,
  factorAi,
})

const factorTeam = new FactorTeam({ ...pluginServices })

const factorUi = new FactorUi({ factorEnv, apps: [factorApp, factorAppSites] })

async function initializeBackingServices() {
  await factorDb.init()
  factorEmail.init()
}

export const service = { ...pluginServices, factorAdmin, factorTeam, factorUi }

export function setup(): ServiceConfig {
  return {
    factorEnv,
    runCommand: async (args) => {
      const { command, options = {}, context } = args

      if (command.endsWith('-r')) {
        const realCommand = command.split('-').shift()
        if (!realCommand)
          throw new Error('No command for restart')
        await new FactorDevRestart({ factorEnv }).restartInitializer({
          command: realCommand,
          config: { watch: [safeDirname(import.meta.url, '../../..')] },
        })
      }
      else {
        await initializeBackingServices()

        if (command === 'app' || command === 'dev') {
          const { build } = options as { build?: boolean, useLocal?: boolean }

          const srv = await factorServer.initServer({ useLocal: true, factorUser })

          if (context === 'node') {
            if (build) {
              await factorApp.buildApp()
              await factorAppSites.buildApp()
            }

            await factorApp.ssrServerSetup({
              expressApp: srv?.expressApp,
              isProd: command !== 'dev',
            })

            await srv?.run()

            await factorAppSites.ssrServerCreate({ isProd: command !== 'dev' })

            factorApp.logReady({ serveMode: 'comboSSR' })
          }
          else if (context === 'app') {
            factorUser.init()
          }
        }
        else if (command === 'sites') {
          const { build } = options as { build?: boolean, useLocal?: boolean }
          const srv = await factorServer.initServer({ useLocal: true, factorUser, port: factorAppSites.port })
          if (context === 'node') {
            if (build)
              await factorAppSites.buildApp()

            await factorAppSites.ssrServerSetup({
              expressApp: srv?.expressApp,
              isProd: true,
            })

            await srv?.run()

            factorAppSites.logReady({ serveMode: 'comboSSR' })
          }
          else if (context === 'app') {
            factorUser.init()
          }
        }

        else if (command === 'build' || command === 'render') {
          const { serve } = options

          await factorAppSites.buildApp({ serve, render: true })
          await factorApp.buildApp({ serve, render: true })
        }
        else if (command === 'generate') {
          await factorDb.init()
          await factorEnv.generate()
        }
      }
    },
    createService: async () => service,
    createMount: async (args) => {
      // APP_INSTANCE is the APP being run
      if (args.runVars.APP_INSTANCE === 'sites') {
        return await factorAppSites.mountApp(args)
      }
      else {
        // prevent sub route from screwing with URL
        // factorRouterSites.historyMode = 'memory'
        // factorRouterSites.create()
        return await factorApp.mountApp(args)
      }
    },
  }
}
