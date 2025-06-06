import type { MetaAppDetails, ServiceConfig } from '@fiction/core/index.js'
import path from 'node:path'
import { FictionAdmin } from '@fiction/admin/index.js'
import { FictionAnalytics } from '@fiction/analytics/index.js'
import { FictionCards } from '@fiction/cards'
import CardSite from '@fiction/cards/CardSite.vue'
import { apiRoot, AppRoute, FictionApp, FictionAws, FictionCache, FictionDb, FictionEmail, FictionEnv, FictionMedia, FictionRevision, FictionRouter, FictionServer, FictionUser, safeDirname } from '@fiction/core/index.js'
import { FictionDevRestart } from '@fiction/core/plugin-env/restart'
import { FictionTeam } from '@fiction/core/plugin-team/index.js'
import { getEnvVars } from '@fiction/core/utils/index.js'
import { FictionOnboard } from '@fiction/onboard'
import { FictionAi } from '@fiction/plugin-ai'
import { FictionContact } from '@fiction/plugin-contact/index.js'
import { FictionMonitor } from '@fiction/plugin-monitor/index.js'
import { FictionStripe } from '@fiction/plugin-stripe/index.js'
import { FictionPosts } from '@fiction/posts'
import { FictionSites } from '@fiction/site/index.js'
import { FictionUi } from '@fiction/ui/index.js'
import { version } from '../package.json'
import { commands } from './commands.js'
import { getThemes } from './extend.js'
import { getStripeProductConfig } from './stripeProducts'

const cwd = safeDirname(import.meta.url, '..')

// Core configuration
function META(): MetaAppDetails {
  return {
    version,
    name: 'Fiction',
    email: 'admin@fiction.com',
    url: 'https://www.fiction.com',
    domain: 'fiction.com',
    termsUrl: 'https://docs.fiction.com/resources/terms.html',
    privacyUrl: 'https://docs.fiction.com/resources/privacy.html',
    admins: ['arpowers@gmail.com'],
  }
}

const URLS = {
  app: `https://www.fiction.com`,
  beacon: `https://beacon.fiction.com`,
  gateway: `https://*.fiction.com`,
  sites: `https://*.fiction.com`,
} as const

const envFiles = [path.join(apiRoot, './.env')]
const mainFilePath = path.join(cwd, './src/index.ts')

const fictionEnv = new FictionEnv({ cwd, envFiles, envFilesProd: envFiles, mainFilePath, version, commands, meta: META })

const envVarNames = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'TOKEN_SECRET',
  'POSTGRES_URL',
  'SMTP_HOST',
  'SMTP_PASSWORD',
  'SMTP_USER',
  'SLACK_WEBHOOK_URL',
  'DISCORD_WEBHOOK_URL',
  'SENTRY_PUBLIC_DSN',
  'AWS_ACCESS_KEY',
  'AWS_ACCESS_KEY_SECRET',
  'AWS_BUCKET_MEDIA',
  'AWS_REGION',
  'FLY_API_TOKEN',
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'XAI_API_KEY',
  'REDIS_URL',
  'APOLLO_API_KEY',
  'CLICKHOUSE_URL',
  'PROXYCURL_API_KEY',
  'MIXPANEL_TOKEN',
] as const

const v = getEnvVars(fictionEnv, envVarNames)
const {
  redisUrl,
  apolloApiKey,
  googleClientId,
  googleClientSecret,
  tokenSecret,
  postgresUrl,
  smtpHost,
  smtpPassword,
  smtpUser,
  slackWebhookUrl,
  sentryPublicDsn,
  awsAccessKey,
  awsBucketMedia,
  clickhouseUrl,
  awsAccessKeySecret,
  openaiApiKey,
  anthropicApiKey,
  xaiApiKey,
  mixpanelToken,
  discordWebhookUrl,
} = v

const comboPort = +fictionEnv.var('APP_PORT')

const fictionRouter = new FictionRouter({
  routerId: 'parentRouter',
  fictionEnv,
  baseUrl: fictionEnv.meta?.url,
  routes: (fictionRouter) => {
    return [
      new AppRoute({ name: 'dash', path: '/app/:viewId?/:itemId?', component: CardSite, props: { siteRouter: fictionRouter, themeId: 'admin' }, noSitemap: true }),
      new AppRoute({ name: 'engine', path: '/:viewId?/:itemId?', component: CardSite, props: { siteRouter: fictionRouter, themeId: 'fiction' } }),
    ]
  },
})

const fictionApp = new FictionApp({
  liveUrl: fictionEnv.meta?.url,
  port: comboPort,
  fictionRouter,
  isLive: fictionEnv.isProd,
  fictionEnv,
  srcFolder: path.join(cwd, './src'),
  renderTokenSecret: tokenSecret,
})

const fictionRouterSites = new FictionRouter({
  routerId: 'siteRouter',
  fictionEnv,
  baseUrl: URLS.gateway,
  routes: [
    new AppRoute({ name: 'engine', path: '/:viewId?/:itemId?', component: CardSite }),
  ],
})

const fictionAppSites = new FictionApp({
  appInstanceId: 'gateway',
  fictionEnv,
  fictionRouter: fictionRouterSites,
  port: +fictionEnv.var('GATEWAY_PORT'),
  localHostname: '*.lan.com',
  liveUrl: URLS.sites,
  renderTokenSecret: tokenSecret,
  altHostnames: [{ prod: `theme-minimal.${fictionEnv.meta?.domain}`, dev: 'theme-minimal.lan.com' }],
  isLive: fictionEnv.isProd,
  srcFolder: path.join(cwd, './src'),
})
const fictionCache = new FictionCache({ fictionEnv, redisUrl })

const fictionServer = new FictionServer({ fictionEnv, serverName: 'FictionMain', port: comboPort, liveUrl: URLS.app })
const fictionDb = new FictionDb({ fictionEnv, fictionServer, postgresUrl })

const fictionEmail = new FictionEmail({ fictionEnv, smtpHost, smtpPassword, smtpUser, sendingDomain: 'mail.fiction.com' })
const base = { fictionEnv, fictionApp, fictionServer, fictionDb, fictionEmail, fictionRouter }
const fictionUser = new FictionUser({ ...base, googleClientId, googleClientSecret, tokenSecret, apolloApiKey })
const fictionRevision = new FictionRevision({ fictionEnv, fictionDb, fictionUser, fictionServer })
const fictionAnalytics = new FictionAnalytics({
  ...base,
  fictionUser,
  fictionCache,
  clickhouseUrl,
  beaconPort: +fictionEnv.var('BEACON_PORT'),
  beaconUrlLive: URLS.beacon,
})

const fictionMonitor = new FictionMonitor({ ...base, fictionUser, slackWebhookUrl, sentryPublicDsn, mixpanelToken, discordWebhookUrl })
const basicService = { ...base, fictionRevision, fictionUser, fictionMonitor, fictionAnalytics, fictionCache }

const fictionAws = new FictionAws({ ...basicService, awsAccessKey, awsAccessKeySecret })
const fictionMedia = new FictionMedia({ ...basicService, fictionAws, awsBucketMedia, cdnUrl: `https://media.fiction.com` })
const fictionAi = new FictionAi({ ...basicService, fictionMedia, openaiApiKey, anthropicApiKey, xaiApiKey })
const fictionStripe = new FictionStripe({
  ...basicService,
  secretKeyLive: fictionEnv.var('STRIPE_SECRET_KEY_PROD'),
  publicKeyLive: fictionEnv.var('STRIPE_PUBLIC_KEY_PROD'),
  secretKeyTest: fictionEnv.var('STRIPE_SECRET_KEY_TEST'),
  publicKeyTest: fictionEnv.var('STRIPE_PUBLIC_KEY_TEST'),
  customerPortalUrl: `https://billing.stripe.com/p/login/fZedS66gTaiegww7ss`,
  products: getStripeProductConfig(),
})
const fictionUi = new FictionUi({ fictionEnv, apps: [fictionApp, fictionAppSites] })
const fictionAdmin = new FictionAdmin({ ...basicService, fictionAi, fictionMedia })

const s = { ...basicService, fictionAppSites, fictionStripe, fictionRouterSites, fictionAws, fictionMedia, fictionAi, fictionAdmin }

const themes = async () => getThemes({ ...s, fictionStripe })

const fictionContact = new FictionContact(s)
const fictionTeam = new FictionTeam({ ...s })

const fictionSites = new FictionSites({
  ...s,
  fictionContact,
  fictionAnalytics,
  fictionAppSites,
  fictionRouterSites,
  fictionOrgId: fictionEnv.var('FICTION_ORG_ID'),
  themes,
})
const fictionCards = new FictionCards({ ...s, fictionSites })

const fictionPosts = new FictionPosts({ fictionContact, fictionSites, ...s })

const fictionOnboard = new FictionOnboard({ ...s, fictionContact, fictionPosts, fictionSites, proxycurlApiKey: v.proxycurlApiKey })

const baseService = { ...s, fictionAnalytics, fictionSites, fictionCards, fictionTeam, fictionUi, fictionStripe, fictionContact, fictionPosts, fictionOnboard }

export type SpecificService = typeof baseService

const service = { ...baseService }

export function setup(): ServiceConfig {
  async function initializeBackingServices(_args: { context: 'node' | 'app' }) {
    fictionCache.init()
    await Promise.all([
      fictionDb.init(),
      fictionEmail.init(),
      fictionAnalytics.serverInit(),
      fictionCache.init(),
    ])
  }

  return {
    service,
    runVars: {},
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
        await initializeBackingServices(args)

        if (command === 'app' || command === 'dev') {
          const { build } = options as { build?: boolean, useLocal?: boolean }

          const srv = await fictionServer.initServer({ useLocal: true, fictionUser })

          if (context === 'node') {
            if (build) {
              await fictionApp.buildApp()
              await fictionAppSites.buildApp()
            }

            if (command === 'dev') {
              await fictionAnalytics.runBeacon()
            }

            // check scheduled and publish posts on interval
            fictionPosts.fictionPublish.init()

            const mode = command !== 'dev' ? 'prod' : 'dev'
            await fictionApp.ssrServerSetup({ expressApp: srv?.expressApp, mode })

            await srv?.run()

            await fictionAppSites.ssrServerCreate({ mode })

            fictionApp.logReady({ serveMode: 'comboSSR' })
          }
        }
        else if (command === 'gateway') {
          const { build } = options as { build?: boolean, useLocal?: boolean }
          const srv = await fictionServer.initServer({ useLocal: true, fictionUser, port: fictionAppSites.port.value })
          if (context === 'node') {
            if (build)
              await fictionAppSites.buildApp()

            await fictionAppSites.ssrServerSetup({ expressApp: srv?.expressApp, mode: 'prod' })

            await srv?.run()

            fictionAppSites.logReady({ serveMode: 'comboSSR' })
          }
        }
        else if (command === 'beacon') {
          await fictionAnalytics.runBeacon()
        }

        else if (command === 'build' || command === 'render') {
          const { serve } = options
          await fictionAppSites.buildApp({ serve, render: false })
          await fictionApp.buildApp({ serve, render: false })
        }
        else if (command === 'generate') {
          await fictionEnv.generate()
        }
      }
    },

    createMount: async (args) => {
      // APP_INSTANCE is the APP being run
      if (args.serviceConfig.runVars?.APP_INSTANCE === 'gateway') {
        return fictionAppSites.mountApp(args)
      }
      else {
        // prevent sub route from screwing with URL
        // fictionRouterSites.historyMode = 'memory'
        // fictionRouterSites.create()
        return fictionApp.mountApp(args)
      }
    },
  }
}
