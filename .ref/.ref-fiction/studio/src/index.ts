import path from 'node:path'
import type {
  CliOptions,
} from '@factor/api'
import {
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
} from '@factor/api'
import { FactorMonitor } from '@factor/plugin-monitor'
import { FictionAppStore } from '@fiction/core/plugin-app-store'
import { FactorHighlightCode } from '@factor/plugin-highlight-code'
import { FactorNotify } from '@factor/plugin-notify'
import { FactorStripe } from '@factor/plugin-stripe'
import { FactorContact } from '@factor/plugin-contact'
import { FactorUi } from '@factor/ui'
import { FactorTeam } from '@fiction/core/plugin-team'
import { FactorCache } from '@factor/api/plugin-cache'
import { FictionPush } from '@fiction/core/plugin-push'
import { FictionInstance } from '@fiction/core/plugin-instance'
import { FictionOnboard } from '@fiction/core/plugin-onboard'
import { routes } from '@fiction/core/routes'
import { getStripeConfig } from '@fiction/core/stripe'
import { FactorDevRestart } from '@factor/api/plugin-env/restart'
import Logo from '@fiction/core/ui/FictionLogo.vue'
import { FictionJobs } from '@fiction/core/plugin-jobs'
import { FictionUsage } from '@fiction/core/plugin-usage'
import { installBrowserMonitoring, onNewUser } from '@fiction/core/monitor'
import { FictionModel, FictionPayment, FictionUi, coreCwd } from '@fiction/core'
import { FactorAdmin } from '@fiction/core/plugin-admin'
import AdminWrap from '@fiction/core/plugin-admin/AdminWrap.vue'
import AdminPage from '@fiction/core/plugin-admin/AdminPage.vue'
import { version } from '../package.json'
import type { CompiledServiceConfig } from '../.factor/config'
import { commands } from './vars'
import App from './App.vue'

export * from '../.factor/config'

const cwd = safeDirname(import.meta.url, '..')

const baseUrl = 'https://studio.fiction.com'
export const factorEnv = new FactorEnv<CompiledServiceConfig>({
  envFiles: [path.join(coreCwd, './.env')],
  envFilesProd: [path.join(coreCwd, './.env.prod')],
  cwd,
  mainFilePath: path.join(cwd, './src/index.ts'),
  commands,
  appName: 'Fiction Admin',
  appEmail: 'admin@fiction.com',
  id: 'app',
  version,
})

const factorDb = new FactorDb({
  factorEnv,
  connectionUrl: factorEnv.var('POSTGRES_URL'),
})

const factorServer = new FactorServer({
  factorEnv,
  serverName: 'fictionEndpointServer',
  port: +factorEnv.var('SERVER_PORT', { fallback: 8282 }),
  liveUrl: 'https://server.fiction.com',
  isLive: factorEnv.isProd,
})

const factorRouter = new FactorRouter<CompiledServiceConfig>({
  factorEnv,
  routes,
  baseUrl,
})
const factorHighlightCode = new FactorHighlightCode({ factorEnv })
const factorNotify = new FactorNotify({ factorEnv })

export const factorApp = new FactorApp({
  factorEnv,
  factorServer,
  factorRouter,
  port: +factorEnv.var('APP_PORT', { fallback: 8181 }),
  liveUrl: baseUrl,
  isLive: factorEnv.isProd,
  srcFolder: path.join(cwd, './src'),
  rootComponent: App,
  uiPaths: [path.join(cwd, './src/**/*.vue'), path.join(cwd, './src/*.vue')],
  ui: { },
  hooks: [
    {
      hook: 'viteConfig',
      callback: async (configs) => {
        return [
          ...configs,
          {
            server: {
              watch: {
                ignored: [
                  '!**/node_modules/@fiction/**',
                  '!**/node_modules/@factor/**',
                ],
              },
            },
            // The watched package must be excluded from optimization,
            // so that it can appear in the dependency graph and trigger hot reload.
            optimizeDeps: {
              exclude: ['@kaption/core', '@fiction/core', '@factor/api'],
            },
          },
        ]
      },
    },
    {
      hook: 'beforeAppMounted',
      callback: async (entry) => {
        await installBrowserMonitoring(entry)
      },
    },
  ],
})

const factorUi = new FactorUi({
  factorEnv,
  factorApp,
  factorRouter,
  Logo,
  AdminPage,
  AdminWrap,
})

const factorEmail = new FactorEmail({
  factorEnv,
  smtpHost: factorEnv.var('SMTP_HOST'),
  smtpPassword: factorEnv.var('SMTP_PASSWORD'),
  smtpUser: factorEnv.var('SMTP_USER'),
  appUrl: factorApp.liveUrl,
})

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
        await factorRouter.goto('authLogin')
      },
    },
    {
      hook: 'createUser',
      callback: async (user) => {
        await onNewUser({ user, factorEnv })
      },
    },
  ],
})

const factorMonitor = new FactorMonitor({
  factorApp,
  factorEmail,
  factorEnv,
  factorUser,
  slackWebhookUrl: factorEnv.var('SLACK_WEBHOOK_URL'),
})

const factorStripe = new FactorStripe(
  getStripeConfig({
    factorEnv,
    factorApp,
    factorRouter,
    factorServer,
    factorUser,
    factorDb,
    isLive: true,
    hooks: [],
  }),
)

const factorCache = new FactorCache({
  factorEnv,
  factorServer,
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
  cdnUrl: 'https://media.fiction.com',
})

export const backingServices = {
  factorEnv,
  factorApp,
  factorRouter,
  factorDb,
  factorServer,
  factorUser,
  factorEmail,
  factorStripe,
  factorCache,
  factorAws,
  factorMedia,
  factorMonitor,
}

export const factorAdmin = new FactorAdmin({
  ...backingServices,
})

const fictionPayment = new FictionPayment({
  ...backingServices,
})
const fictionUsage = new FictionUsage({ ...backingServices, fictionPayment })

const fictionPush = new FictionPush({
  ...backingServices,
  vapidPrivateKey: factorEnv.var('VAPID_PRIVATE_KEY'),
  vapidPublicKey: factorEnv.var('VAPID_PUBLIC_KEY'),
})

const fictionJobs = new FictionJobs({ ...backingServices })

const fictionInstance = new FictionInstance({
  ...backingServices,
  fictionPayment,
  socketPort: 2222,
  socketUrlLive: 'https://socket.fiction.com',
  fictionJobs,
  fictionUsage,
  fictionPush,
})

export const factorTeam = new FactorTeam({ ...backingServices })

const fictionUi = new FictionUi({
  factorEnv,
  factorUser,
  factorRouter,
  factorApp,
})

export const pluginServices = {
  ...backingServices,
  factorAdmin,
}

export const fictionModel = new FictionModel({
  ...pluginServices,
  fictionInstance,
  modelBucket: 'fiction-data',
  fictionJobs,
})

export const fictionOnboard = new FictionOnboard({
  ...backingServices,
  fictionPayment,
  fictionModel,
})

const fictionAppStore = new FictionAppStore({
  ...backingServices,
})

const factorContact = new FactorContact({ ...pluginServices })

async function initializeBackingServices() {
  const s = [
    { name: 'factorDb', service: factorDb },
    { name: 'factorEmail', service: factorEmail },
    { name: 'factorCache', service: factorCache },
  ]

  for (const backing of s)
    await backing.service.init()
}

factorEnv.addHook({
  hook: 'runCommand',
  callback: async (command: string, opts: CliOptions) => {
    factorEnv.log.info(`running command: ${command}`)
    command = command as CompiledServiceConfig['commands']

    if (command.startsWith('r-')) {
      const realCommand = command.split('-').pop()
      if (!realCommand)
        throw new Error('No command for restart')
      await new FactorDevRestart({ factorEnv }).restartInitializer({
        command: realCommand,
        config: {
          watch: [safeDirname(import.meta.url, '../../..')],
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
      else if (command === 'socket') {
        await fictionInstance.initServer()
      }
      else if (command === 'app') {
        factorUser.init()
        await fictionInstance.initApp()
        await Promise.all([factorApp.serveStaticApp()])
      }
      else if (command === 'dev') {
        factorUser.init()
        await fictionInstance.dev()

        await Promise.all([factorServer.createServer({ factorUser })])

        await factorApp.ssrServerCreate()
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
  fictionJobs,
  fictionUsage,
  factorStripe,
  factorAdmin,
  factorTeam,
  factorAws,
  fictionInstance,
  factorMedia,
  factorHighlightCode,
  factorNotify,
  factorUi,
  fictionUi,
  fictionModel,
  fictionPayment,
  fictionOnboard,
  fictionPush,
  fictionAppStore,
  factorMonitor,
  factorContact,
}

export type ServiceContainer = typeof service

export function setup() {
  return { service }
}
