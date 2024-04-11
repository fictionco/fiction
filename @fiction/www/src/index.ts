import path from 'node:path'
import { FictionUi } from '@fiction/ui'
import type { ServiceConfig } from '@fiction/core'
import { AppRoute, FictionApp, FictionAws, FictionDb, FictionEmail, FictionEnv, FictionMedia, FictionRouter, FictionServer, FictionUser, apiRoot, safeDirname } from '@fiction/core'

import { FictionTeam } from '@fiction/core/plugin-team'
import { FictionMonitor } from '@fiction/plugin-monitor'
import { FictionNotify } from '@fiction/plugin-notify'
import { FictionStripe } from '@fiction/plugin-stripe'
import { FictionDevRestart } from '@fiction/core/plugin-env/restart'
import { FictionSites } from '@fiction/site'

import FSite from '@fiction/cards/CardSite.vue'
import { FictionAi } from '@fiction/plugin-ai'
import { version } from '../package.json'
import { getThemes } from './themes'

import { commands } from './commands'

const cwd = safeDirname(import.meta.url, '..')
const appName = 'Fiction'
const appEmail = 'hello@fiction.com'
const domain = `fiction.com`
const appUrl = `https://www.${domain}`
const appUrlSites = `https://*.${domain}`

const envFiles = [path.join(apiRoot, './.env')]

const fictionEnv = new FictionEnv({
  cwd,
  envFiles,
  envFilesProd: envFiles,
  mainFilePath: path.join(cwd, './src/index.ts'),
  appName,
  appEmail,
  appUrl,
  version,
  commands,
  meta: { version, app: { name: appName, email: appEmail, url: appUrl, domain } },
})

const comboPort = +fictionEnv.var('APP_PORT', { fallback: 4444 })

const fictionRouter = new FictionRouter({
  routerId: 'parentRouter',
  fictionEnv,
  baseUrl: fictionEnv.appUrl,
  routes: (fictionRouter) => {
    return [
      new AppRoute({ name: 'testInputs', path: '/inputs', component: (): Promise<any> => import('@fiction/ui/test/TestInputsAll.vue') }),
      new AppRoute({ name: 'dash', path: '/app/:viewId?/:itemId?', component: FSite, props: { siteRouter: fictionRouter, themeId: 'admin' } }),
      new AppRoute({ name: 'engine', path: '/:viewId?/:itemId?', component: FSite, props: { siteRouter: fictionRouter, themeId: 'fiction' } }),
    ]
  },

})

const fictionApp = new FictionApp({
  liveUrl: fictionEnv.appUrl,
  port: comboPort,
  fictionRouter,
  isLive: fictionEnv.isProd,
  uiPaths: [
    path.join(cwd, './src/**/*.{vue,js,ts,html}'),
    path.join(cwd, './src/*.{vue,js,ts,html}'),
  ],
  fictionEnv,
  srcFolder: path.join(cwd, './src'),
})

const fictionRouterSites = new FictionRouter({
  routerId: 'siteRouter',
  fictionEnv,
  baseUrl: appUrlSites,
  routes: [new AppRoute({ name: 'engine', path: '/:viewId?/:itemId?', component: FSite })],
})

const fictionAppSites = new FictionApp({
  appInstanceId: 'sites',
  fictionEnv,
  fictionRouter: fictionRouterSites,
  port: +fictionEnv.var('SITES_PORT', { fallback: 6565 }),
  localHostname: '*.lan.com',
  liveUrl: appUrlSites,
  altHostnames: [{ prod: `theme-minimal.${domain}`, dev: 'theme-minimal.lan.com' }],
  isLive: fictionEnv.isProd,
  srcFolder: path.join(cwd, './src'),
})

const fictionServer = new FictionServer({ fictionEnv, serverName: 'FictionMain', port: comboPort, liveUrl: appUrl })
const fictionDb = new FictionDb({ fictionEnv, fictionServer, connectionUrl: fictionEnv.var('POSTGRES_URL') })
const fictionNotify = new FictionNotify({ fictionEnv })
const fictionEmail = new FictionEmail({ fictionEnv, smtpHost: fictionEnv.var('SMTP_HOST'), smtpPassword: fictionEnv.var('SMTP_PASSWORD'), smtpUser: fictionEnv.var('SMTP_USER') })

const fictionUser = new FictionUser({
  fictionEnv,
  fictionServer,
  fictionDb,
  fictionEmail,
  fictionRouter,
  googleClientId: fictionEnv.var('GOOGLE_CLIENT_ID'),
  googleClientSecret: fictionEnv.var('GOOGLE_CLIENT_SECRET'),
  tokenSecret: fictionEnv.var('TOKEN_SECRET'),
  hooks: [
    {
      hook: 'onLogout',
      callback: async () => {
        fictionNotify.notifySuccess('You have been logged out.')
        await fictionRouter.push('/', { caller: 'onLogout' })
      },
    },
  ],
})

const fictionMonitor = new FictionMonitor({
  fictionApp,
  fictionEmail,
  fictionEnv,
  slackWebhookUrl: fictionEnv.var('SLACK_WEBHOOK_URL'),
  fictionUser,
})

const basicService = {
  fictionEnv,
  fictionApp,
  fictionRouter,
  fictionServer,
  fictionDb,
  fictionUser,
  fictionEmail,
  fictionMonitor,
}

const fictionAws = new FictionAws({
  fictionEnv,
  awsAccessKey: fictionEnv.var('AWS_ACCESS_KEY'),
  awsAccessKeySecret: fictionEnv.var('AWS_ACCESS_KEY_SECRET'),
})

const fictionMedia = new FictionMedia({
  fictionEnv,
  fictionDb,
  fictionUser,
  fictionServer,
  fictionAws,
  bucket: 'factor-tests',
})

const fictionAi = new FictionAi({
  ...basicService,
  fictionMedia,
  pineconeApiKey: fictionEnv.var('PINECONE_API_KEY'),
  pineconeEnvironment: fictionEnv.var('PINECONE_ENVIRONMENT'),
  pineconeIndex: fictionEnv.var('PINECONE_INDEX'),
  openaiApiKey: fictionEnv.var('OPENAI_API_KEY'),
})

const pluginServices = {
  ...basicService,
  fictionAppSites,
  fictionRouterSites,
  fictionAws,
  fictionMedia,
  fictionAi,
}

const fictionStripe = new FictionStripe({
  ...pluginServices,
  secretKeyLive: fictionEnv.var('STRIPE_SECRET_KEY_PROD'),
  publicKeyLive: fictionEnv.var('STRIPE_PUBLIC_KEY_PROD'),
  secretKeyTest: fictionEnv.var('STRIPE_SECRET_KEY_TEST'),
  publicKeyTest: fictionEnv.var('STRIPE_PUBLIC_KEY_TEST'),
  customerPortalUrl: `https://billing.stripe.com/p/login/fZedS66gTaiegww7ss`,
  products: [
    {
      alias: 'standard',
      productId: 'prod_Ptz7sEMEmJvZ6s',
      tier: 10,
      pricing: [
        { duration: 'month', priceId: 'price_1P4B95FofsEYcKEPApAIRcWH' },
        { duration: 'year', priceId: 'price_1P4B95FofsEYcKEPjdwAKb9j' },
      ],
    },
    {
      alias: 'pro',
      productId: 'prod_PtzAeKqhL7w5fs',
      tier: 20,
      pricing: [
        { duration: 'month', priceId: 'price_1P4BCZFofsEYcKEPX8BAkBlt' },
        { duration: 'year', priceId: 'price_1P4BDBFofsEYcKEPdz8dDkT4' },
      ],
    },
    {
      alias: 'advanced',
      productId: 'prod_PtzDXv4G19aO4m',
      tier: 30,
      pricing: [
        { duration: 'month', priceId: 'price_1P4BF6FofsEYcKEPW6rBsDVO' },
        { duration: 'year', priceId: 'price_1P4BFjFofsEYcKEPU6zDPhfl' },
      ],
    },
  ],
})

const fictionSites = new FictionSites({
  ...pluginServices,
  fictionAppSites,
  fictionRouterSites,
  flyIoApiToken: fictionEnv.var('FLY_API_TOKEN'),
  flyIoAppId: 'fiction-sites',
  adminBaseRoute: '/admin',
  themes: getThemes({ fictionEnv, fictionStripe }),
})

// const plugins = createPluginConfig([
//   {
//     load: () => import('@fiction/site'),
//     settings: () => {
//       return { fictionAppSites, fictionRouterSites, flyIoApiToken: fictionEnv.var('FLY_API_TOKEN'), flyIoAppId: 'fiction-sites' }
//     },
//   },
// ])
// const fictionAdminPluginIndex = new FictionAdminPluginIndex({ ...pluginServices, plugins })

// const fictionAdmin = new FictionAdmin({
//   ...pluginServices,
//   pluginIndex: fictionAdminPluginIndex,
//   fictionAi,
// })

const fictionTeam = new FictionTeam({ ...pluginServices })

const fictionUi = new FictionUi({ fictionEnv, apps: [fictionApp, fictionAppSites] })

async function initializeBackingServices() {
  await fictionDb.init()
  fictionEmail.init()
}

export const service = { ...pluginServices, fictionSites, fictionTeam, fictionUi, fictionStripe }

export function setup(): ServiceConfig {
  return {
    fictionEnv,
    runCommand: async (args) => {
      const { command, options = {}, context } = args

      if (command.endsWith('-r')) {
        const realCommand = command.split('-').shift()
        if (!realCommand)
          throw new Error('No command for restart')
        await new FictionDevRestart({ fictionEnv }).restartInitializer({
          command: realCommand,
          config: { watch: [safeDirname(import.meta.url, '../../..')] },
        })
      }
      else {
        await initializeBackingServices()

        if (command === 'app' || command === 'dev') {
          const { build } = options as { build?: boolean, useLocal?: boolean }

          const srv = await fictionServer.initServer({ useLocal: true, fictionUser })

          if (context === 'node') {
            if (build) {
              await fictionApp.buildApp()
              await fictionAppSites.buildApp()
            }

            await fictionApp.ssrServerSetup({
              expressApp: srv?.expressApp,
              isProd: command !== 'dev',
            })

            await srv?.run()

            await fictionAppSites.ssrServerCreate({ isProd: command !== 'dev' })

            fictionApp.logReady({ serveMode: 'comboSSR' })
          }
          else if (context === 'app') {
            fictionUser.init()
          }
        }
        else if (command === 'sites') {
          const { build } = options as { build?: boolean, useLocal?: boolean }
          const srv = await fictionServer.initServer({ useLocal: true, fictionUser, port: fictionAppSites.port })
          if (context === 'node') {
            if (build)
              await fictionAppSites.buildApp()

            await fictionAppSites.ssrServerSetup({
              expressApp: srv?.expressApp,
              isProd: true,
            })

            await srv?.run()

            fictionAppSites.logReady({ serveMode: 'comboSSR' })
          }
          else if (context === 'app') {
            fictionUser.init()
          }
        }

        else if (command === 'build' || command === 'render') {
          const { serve } = options
          await fictionAppSites.buildApp({ serve, render: true })
          await fictionApp.buildApp({ serve, render: true })
        }
        else if (command === 'generate') {
          await fictionDb.init()
          await fictionEnv.generate()
        }
      }
    },
    createService: async () => service,
    createMount: async (args) => {
      // APP_INSTANCE is the APP being run
      if (args.runVars.APP_INSTANCE === 'sites') {
        return await fictionAppSites.mountApp(args)
      }
      else {
        // prevent sub route from screwing with URL
        // fictionRouterSites.historyMode = 'memory'
        // fictionRouterSites.create()
        return await fictionApp.mountApp(args)
      }
    },
  }
}
