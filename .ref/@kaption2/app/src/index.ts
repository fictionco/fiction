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
  FactorMonitor,
  FactorRouter,
  FactorServer,
  FactorUser,
  safeDirname,
} from '@factor/api'
import { FactorHighlightCode } from '@factor/plugin-highlight-code'
import { FactorNotify } from '@factor/plugin-notify'
import { FactorContact } from '@factor/plugin-contact'
import { FactorUi } from '@factor/ui'
import { KaptionUi } from '@kaption/core/ui'
import { FactorTeam } from '@fiction/core/plugin-team'
import { FactorAuth } from '@factor/api/plugin-auth'
import { FactorCache } from '@factor/api/plugin-cache'
import { routes } from '@fiction/core/routes'
import { FactorDevRestart } from '@factor/api/plugin-env/restart'
import Logo from '@fiction/core/ui/FictionLogo.vue'
import { coreCwd } from '@fiction/core'
import { FactorAdmin } from '@fiction/core/plugin-admin'
import type { CompiledServiceConfig } from '../.factor/config'
import { version } from '../package.json'
import { commands } from './vars'
import App from './App.vue'

export * from '../.factor/config'

const cwd = safeDirname(import.meta.url, '..')

const baseUrl = 'https://app.kaption.co'
export const factorEnv = new FactorEnv<CompiledServiceConfig>({
  envFiles: [path.join(coreCwd, './.env')],
  envFilesProd: [path.join(coreCwd, './.env.prod')],
  cwd,
  mainFilePath: path.join(cwd, './src/index.ts'),
  commands,
  appName: 'Kaption Admin',
  appEmail: 'admin@kaption.co',
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
  port: +factorEnv.var('SERVER_PORT', { fallback: 6464 }),
  liveUrl: 'https://server.kaption.co',
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
  port: +factorEnv.var('APP_PORT', { fallback: 7474 }),
  liveUrl: baseUrl,
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
      callback: async (entry) => {},
    },
  ],
})

const factorUi = new FactorUi({ factorEnv, factorApp })

const factorEmail = new FactorEmail({
  factorEnv,
  smtpHost: factorEnv.var('SMTP_HOST'),
  smtpPassword: factorEnv.var('SMTP_PASSWORD'),
  smtpUser: factorEnv.var('SMTP_USER'),
  appUrl: factorApp.liveUrl,
})

const factorMonitor = new FactorMonitor({
  factorEnv,
  slackWebhookUrl: factorEnv.var('SLACK_WEBHOOK_URL'),
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
      callback: async (user) => {},
    },
  ],
})

const factorAuth = new FactorAuth({
  factorEnv,
  factorUser,
  factorRouter,
  factorApp,
  logoComponent: Logo,
  termsUrl: 'https://www.fiction.com/docs/tos',
  privacyUrl: 'https://www.fiction.com/docs/privacy-policy',
})

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
  factorCache,
  factorAws,
  factorMedia,
  factorMonitor,
}

export const factorAdmin = new FactorAdmin({
  ...backingServices,
})

export const factorTeam = new FactorTeam({ ...backingServices, factorAdmin })

const kaptionUi = new KaptionUi({
  factorEnv,
  factorUser,
  factorRouter,
  factorApp,
})

export const pluginServices = {
  ...backingServices,
  factorAdmin,
}

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
      else if (command === 'app') {
        factorUser.init()
        await Promise.all([factorApp.serveStaticApp()])
      }
      else if (command === 'dev') {
        factorUser.init()
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
  factorAdmin,
  factorTeam,
  factorAuth,
  factorAws,
  factorMedia,
  factorHighlightCode,
  factorNotify,
  factorUi,
  kaptionUi,
  factorMonitor,
  factorContact,
}

export type ServiceContainer = typeof service

export function setup() {
  return { service }
}
