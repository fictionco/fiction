import path from 'node:path'
import type {
  CliOptions,
} from '@factor/api'
import {
  AppRoute,
  FactorApp,
  FactorAws,
  FactorDb,
  FactorEmail,
  FactorEnv,
  FactorMedia,
  FactorRouter,
  FactorServer,
  FactorUser,
  safeDirname,
  vars,
} from '@factor/api'
import { FactorHighlightCode } from '@factor/plugin-highlight-code'
import { FactorNotify } from '@factor/plugin-notify'
import { FactorStripe } from '@factor/plugin-stripe'
import { FactorUi } from '@factor/ui'
import { FactorAdmin } from '@factor/api/plugin-admin'
import {
  KaptionAccount,
  KaptionAnalytics,
  KaptionAuth,
  KaptionBilling,
  KaptionCache,
  KaptionClickHouse,
  KaptionCoreUi,
  KaptionDashboard,
  KaptionEmbed,
  KaptionEvents,
  KaptionForms,
  KaptionHeatmaps,
  KaptionNotification,
  KaptionOnboard,
  KaptionReplay,
  KaptionTeam,
  KaptionTracking,
} from '@kaption/core'
import { KaptionIntegrations } from '@kaption/connect'
import { KaptionProxyServer } from '@kaption/core/plugin-proxy/proxyServer'
import { KaptionFilter } from '@factor/api/plugin-dashboards/plugin-filters'
import { FactorDevRestart } from '@factor/api/plugin-env/restart'
import { KaptionReplayServer } from '@kaption/core/plugin-replays/replayServer'
import { KaptionTag } from '@kaption/core/plugin-tag'
import { KaptionBeacon } from '@kaption/core/plugin-beacon'
import { KaptionEventOps } from '@kaption/core/plugin-beacon/ops'

import Logo from '@kaption/core/ui/KaptionLogo.vue'
import type { CompiledServiceConfig } from '../.factor/config'
import { version } from '../package.json'
import ElDummy from './ElDummy.vue'
import { commands, envVars } from './vars'
import App from './App.vue'

export * from '../.factor/config'

const cwd = safeDirname(import.meta.url, '..')
const repoCwd = safeDirname(import.meta.url, '../../..')

vars.register(envVars)

export const factorEnv = new FactorEnv<CompiledServiceConfig>({
  envFiles: [path.join(repoCwd, './.env')],
  envFilesProd: [path.join(repoCwd, './.env.prod')],
  cwd,
  mainFilePath: path.join(cwd, './src/index.ts'),
  commands,
  appName: 'Kaption.co',
  appEmail: 'hello@kaption.co',
  id: 'app',
  version,
})

const factorDb = new FactorDb({
  factorEnv,
  connectionUrl: factorEnv.var('POSTGRES_URL'),
})

const factorServer = new FactorServer({
  factorEnv,
  serverName: 'kaptionEndpointServer',
  port: +factorEnv.var('SERVER_PORT', { fallback: 7777 }),
  liveUrl: 'https://server.kaption.co',
  isLive: factorEnv.isProd,
})

const factorRouter = new FactorRouter<CompiledServiceConfig>({
  factorEnv,
  routes: [
    new AppRoute({
      name: 'support',
      niceName: () => 'Support',
      external: true,
      menus: ['help'],
      path: 'https://www.kaption.co/support',
    }),
    new AppRoute({
      name: 'docs',
      niceName: () => 'Docs',
      external: true,
      menus: ['help'],
      path: 'https://www.kaption.co/docs',
    }),
  ],
})
const factorHighlightCode = new FactorHighlightCode({ factorEnv })
const factorNotify = new FactorNotify({ factorEnv })

export const factorApp = new FactorApp({
  factorEnv,
  factorServer,
  factorRouter,
  port: +factorEnv.var('APP_PORT', { fallback: 3434 }),
  liveUrl: 'https://app.kaption.co',
  isLive: factorEnv.isProd,
  srcFolder: path.join(cwd, './src'),
  rootComponent: App,
  uiPaths: [path.join(cwd, './src/**/*.vue'), path.join(cwd, './src/*.vue')],
  ui: { logoDark: Logo, logoLight: Logo },
  hooks: [
    {
      hook: 'viteConfig',
      callback: async (configs) => {
        return [
          ...configs,
          {
            server: {
              watch: {
                ignored: ['!**/node_modules/@kaption/**'],
              },
            },
            // The watched package must be excluded from optimization,
            // so that it can appear in the dependency graph and trigger hot reload.
            optimizeDeps: {
              exclude: ['@kaption/core'],
            },
          },
        ]
      },
    },
  ],
})

const factorUi = new FactorUi({ factorEnv, factorApp })

const factorEmail = new FactorEmail({
  factorEnv,
  smtpHost: factorEnv.var('SMTP_HOST'),
  smtpPassword: factorEnv.var('SMTP_PASSWORD'),
  smtpUser: factorEnv.var('SMTP_USER'),
  appUrl: factorApp.appUrl,
})

const factorUser = new FactorUser({
  factorEnv,
  factorServer,
  factorDb,
  factorEmail,
  factorRouter,
  googleClientId:
    '985105007162-9ku5a8ds7t3dq7br0hr2t74mapm4eqc0.apps.googleusercontent.com',
  googleClientSecret: factorEnv.var('GOOGLE_CLIENT_SECRET'),
  tokenSecret: factorEnv.var('TOKEN_SECRET'),
  hooks: [
    {
      hook: 'onLogout',
      callback: async () => {
        factorNotify.notifySuccess('You have been logged out.')
        await factorRouter.goto('authLogin')
      },
    },
  ],
})

const kaptionAuth = new KaptionAuth({
  factorEnv,
  factorUser,
  factorRouter,
  factorApp,
})

const factorStripe = new FactorStripe({
  factorEnv,
  factorApp,
  factorServer,
  factorUser,
  factorRouter,
  publicKeyTest:
    'pk_test_51KJ3HNBNi5waADGv8mJnDm8UHJcTvGgRhHmKAZbpklqEANE6niiMYJUQGvinpEt4jdPM85hIsE6Bu5fFhuBx1WWW003Fyaq5cl',
  secretKeyTest: factorEnv.var('STRIPE_SECRET_KEY_TEST'),
  isLive: factorEnv.isProd,
  hooks: [],
  products: [],
  // productsTest: [
  //   {
  //     pricing: [
  //       { priceId: "price_1LXtNzBNi5waADGvWnsVPwP7", priceKey: "month" },
  //     ],
  //     productId: "prod_MGQEFRdVgcAMDo",
  //     productKey: "proBusiness",
  //   },
  //   {
  //     pricing: [
  //       { priceId: "price_1LXtNFBNi5waADGvUCR0ryVj", priceKey: "month" },
  //     ],
  //     productId: "prod_MGQD35rJGsPfmm",
  //     productKey: "pro",
  //   },
  // ],
  // productsLive: [
  //   {
  //     pricing: [
  //       { priceId: "price_1LXtLhBNi5waADGvx7H6XQ4M", priceKey: "month" },
  //     ],
  //     productId: "prod_MGQCEinWolcPtE",
  //     productKey: "proBusiness",
  //   },
  //   {
  //     pricing: [
  //       { priceId: "price_1LXtIwBNi5waADGvQvANyVCW", priceKey: "month" },
  //     ],
  //     productId: "prod_MGQ9qhv5EYF67V",
  //     productKey: "pro",
  //   },
  // ],
})

const kaptionClickHouse = new KaptionClickHouse({
  factorEnv,
  apiServer: factorServer,
  factorUser,
  connectionUrl: factorEnv.var('CLICKHOUSE_URL'),
})

const kaptionCache = new KaptionCache({
  factorEnv,
  apiServer: factorServer,
  factorUser,
  redisConnectionUrl: factorEnv.var('REDIS_URL'),
  factorDb,
})

const factorAws = new FactorAws({
  factorEnv,
  awsAccessKey: factorEnv.var('AWS_ACCESS_KEY'),
  awsAccessKeySecret: factorEnv.var('AWS_ACCESS_KEY_SECRET'),
})

const factorMedia = new FactorMedia({
  factorEnv,
  factorAws,
  factorDb,
  factorServer,
  factorUser,
  bucket: 'kaption-media',
  unsplashAccessKey: '',
  cdnUrl: 'https://media.kaption.co',
})

export const kaptionBackingServices = {
  factorEnv,
  factorApp,
  factorRouter,
  factorDb,
  factorServer,
  factorUser,
  factorEmail,
  factorStripe,
  kaptionClickHouse,
  kaptionCache,
  factorAws,
  factorMedia,
}

export const factorAdmin = new FactorAdmin({
  ...kaptionBackingServices,
  elAdminPage: ElDummy,
  elAdminWrap: ElDummy,
})

export const kaptionTeam = new KaptionTeam({
  ...kaptionBackingServices,
  factorAdmin,
})

const kaptionFilter = new KaptionFilter({
  factorEnv,
  factorRouter,
  factorAdmin,
})

export const kaptionDashboard = new KaptionDashboard({
  ...kaptionBackingServices,
  factorAdmin,
  kaptionFilter,
  widgetPort: +factorEnv.var('WIDGET_PORT', { fallback: 5555 }),
  widgetLiveUrl: 'https://widget.kaption.co',
  isLive: factorEnv.isProd,
})

const kaptionProxyServer = new KaptionProxyServer({
  port: +factorEnv.var('PROXY_PORT', { fallback: 2233 }),
  liveUrl: 'https://special.kaption.org',
  isLive: factorEnv.isProd,
  factorEnv,
})

export const pluginServices = {
  ...kaptionBackingServices,
  kaptionFilter,
  factorAdmin,
  kaptionDashboard,
}

const kaptionIntegrations = new KaptionIntegrations(pluginServices)

const kaptionEventOps = new KaptionEventOps({
  ...pluginServices,
  cron: factorEnv.isDev.value
    ? {
        day: '*/4 * * * *',
        hour: '*/2 * * * *',
        month: '*/20 * * * *',
        quarterHour: '*/1 * * * *',
      }
    : undefined,
})

const kaptionBilling = new KaptionBilling({
  ...pluginServices,
  kaptionEventOps,
  isLive: factorEnv.isProd,
})

const kaptionBeacon = new KaptionBeacon({
  ...pluginServices,
  kaptionEventOps,
  isLive: factorEnv.isProd,
  beaconPort: 2121,
  sessionPort: 3232,
  beaconUrlLive: 'https://beacon.kaption.co',
  sessionUrlLive: 'https://session.kaption.co',
  sessionExpireAfterMs: factorEnv.isDev.value ? 20_000 : 60 * 30 * 1000,
  checkExpiredIntervalMs: factorEnv.isDev.value ? 1000 : 5000,
  bufferIntervalMs: factorEnv.isDev.value ? 300 : 1000,
})

const kaptionEmbed = new KaptionEmbed({ ...pluginServices, testSitePort: 9911 })

const kaptionTag = new KaptionTag({
  factorEnv,
  factorDb,
  kaptionBeacon,
  kaptionCache,
  scriptPort: 2222,
  testAppPort: 1111,
  scriptLiveUrl: 'https://tag.kaption.co',
  testAppLiveUrl: 'https://example.kaption.co',
  isLive: factorEnv.isProd,
  testHeadless: true,
})

const kaptionTracking = new KaptionTracking(pluginServices)
const kaptionAccount = new KaptionAccount(pluginServices)
const kaptionOnboard = new KaptionOnboard(pluginServices)
const kaptionAnalytics = new KaptionAnalytics(pluginServices)

const kaptionForms = new KaptionForms({
  ...pluginServices,
  kaptionIntegrations,
  port: +factorEnv.var('FORMS_PORT', { fallback: 12_321 }),
  liveUrl: 'https://forms.kaption.co',
  isLive: factorEnv.isProd,
})
const kaptionEvents = new KaptionEvents({ ...pluginServices, kaptionTag })
const kaptionReplay = new KaptionReplay({
  ...pluginServices,
  sessionBucket: factorEnv.isDev.value ? 'factor-testing' : 'kaption-session',
  replayPort: +factorEnv.var('REPLAY_PORT', { fallback: 7827 }),
})
const kaptionHeatmaps = new KaptionHeatmaps({
  ...pluginServices,
  kaptionProxyServer,
})
const kaptionCoreUi = new KaptionCoreUi(pluginServices)

const kaptionNotification = new KaptionNotification({
  ...pluginServices,
  kaptionEvents,
  kaptionEventOps,
})

const kaptionReplayServer = new KaptionReplayServer({
  factorEnv,
  kaptionTag,
  kaptionBeacon,
  kaptionCache,
  factorAws,
  kaptionEventOps,
  sessionBucket: factorEnv.isDev.value ? 'factor-testing' : 'kaption-session',
  replayPort: +factorEnv.var('REPLAY_PORT', { fallback: 7827 }),
  socketLiveUrl: 'https://rec.kaption.co',
  isLive: factorEnv.isProd,
  dailyLimit: factorEnv.isDev.value ? 300 : 36,
  throttleMinutes: factorEnv.isDev.value ? 1 : 15,
})

async function initializeBackingServices() {
  factorEnv.log.info('backing services [connecting]')

  const s = [
    { name: 'factorDb', service: factorDb },
    { name: 'kaptionClickHouse', service: kaptionClickHouse },
    { name: 'factorEmail', service: factorEmail },
    { name: 'kaptionCache', service: kaptionCache },
  ]

  for (const backing of s) {
    factorEnv.log.info(`initializing ${backing.name}`)
    await backing.service.init()
  }

  factorEnv.log.info('backing services [initialized]')
}

factorEnv.addHook({
  hook: 'runCommand',
  callback: async (command: string, opts: CliOptions) => {
    command = command as CompiledServiceConfig['commands']

    if (command.startsWith('r-')) {
      const realCommand = command.split('-').pop()
      if (!realCommand)
        throw new Error('No command for restart')
      await new FactorDevRestart({ factorEnv }).restartInitializer({
        command: realCommand,
        config: {
          watch: [safeDirname(import.meta.url, '../..')],
        },
      })
    }
    else if (command === 'generate') {
      await factorDb.init()
      await factorEnv.generate()
    }
    else if (command === 'build' || command === 'render') {
      const { serve } = opts

      await factorApp.buildApp({ serve, render: true })
    }
    else {
      await initializeBackingServices()
      if (command === 'server') {
        await factorServer.createServer({ factorUser })
      }
      else if (command === 'widget') {
        await kaptionDashboard.createWidgetServer()
      }
      else if (command === 'app') {
        factorUser.init()
        await Promise.all([
          factorApp.serveStaticApp(),
          kaptionDashboard.createClientSocket(),
        ])
      }
      else if (command === 'dev') {
        // prevent conflicts with other services
        // await factorServer.useDevProxy()

        factorUser.init()

        await Promise.all([
          factorServer.createServer({ factorUser }),
          kaptionDashboard.createDevSocketHandling(),
          kaptionProxyServer.dev(),
        ])

        await factorApp.serveDevApp()
      }
      else if (command === 'ddev') {
        await Promise.all([
          kaptionTag.dev({ projectIds: ['example'] }),
          kaptionReplayServer.createServer(),
          kaptionEmbed.testSite('start'),
        ])
        kaptionTag.generateTraffic().catch(console.error)
      }
      else if (command === 'proxy') {
        await kaptionProxyServer.createServer()
      }
      else if (command === 'beacon') {
        await kaptionBeacon.createBeaconServer()
      }
      else if (command === 'session') {
        await kaptionBeacon.runSessionManager()
      }
      else if (command === 'tag') {
        await kaptionTag.tagStaticServer()
      }
      else if (command === 'rec') {
        await kaptionReplayServer.createServer()
      }
      else if (command === 'example') {
        await kaptionTag.launchExampleApp(['example'])
        kaptionTag.generateTraffic().catch(console.error)
      }
    }
  },
})

export const service = {
  factorEnv,
  factorRouter,
  factorApp,
  factorServer,
  factorUser,
  factorDb,
  factorStripe,
  kaptionFilter,
  factorAdmin,
  kaptionTeam,
  kaptionAccount,
  kaptionOnboard,
  kaptionTracking,
  kaptionAuth,
  kaptionProxyServer,
  kaptionCoreUi,
  kaptionDashboard,
  kaptionAnalytics,
  kaptionForms,
  kaptionEvents,
  kaptionBilling,
  kaptionClickHouse,
  kaptionReplay,
  kaptionReplayServer,
  kaptionBeacon,
  kaptionTag,
  kaptionHeatmaps,
  kaptionNotification,
  factorAws,
  factorMedia,
  factorHighlightCode,
  factorNotify,
  factorUi,
  kaptionIntegrations,
  kaptionEmbed,
}

export type ServiceContainer = typeof service

export function setup() {
  return { service }
}
