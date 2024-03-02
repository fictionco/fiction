import path from 'node:path'
import { FactorUi } from '@factor/ui'
import type {
  CliOptions,
  ServiceConfig,
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
import { FactorCache } from '@factor/api/plugin-cache'
import { FactorNotify } from '@factor/plugin-notify'
import { FactorDevRestart } from '@factor/api/plugin-env/restart'
import { FactorStripe } from '@factor/plugin-stripe'
import { FictionUi } from '@fiction/core'
import FictionLogo from '@fiction/core/ui/FictionLogo.vue'
import { getStripeConfig } from '@pagelines/core/stripe'
import { pageLinesCoreRoot } from '@pagelines/core/util'
import { PageLinesAdmin } from '@pagelines/core/plugin-admin'
import { PageLinesAgent } from '@pagelines/core/plugin-agent'
import { PageLinesData } from '@pagelines/core/plugin-data'
import { PageLinesEmbed } from '@pagelines/core/plugin-embed'
import { PageLinesTag } from '@pagelines/core/plugin-tag'
import { FactorTeam } from '@factor/api/plugin-team'
import { FactorContact } from '@factor/plugin-contact'

import type { CompiledServiceConfig } from '../.factor/config'
import { version } from '../package.json'
import { routes } from './routes'
import AppEntry from './AppEntry.vue'
import { commands } from './vars'

const cwd = safeDirname(import.meta.url, '..')
export const appName = 'PageLines'
export const appEmail = 'hello@pagelines.com'
export const liveUrl = 'https://www.pagelines.com'

export const factorEnv = new FactorEnv<CompiledServiceConfig>({
  envFiles: [path.join(pageLinesCoreRoot, './.env')],
  envFilesProd: [path.join(pageLinesCoreRoot, './.env.prod')],
  cwd,
  commands,
  mainFilePath: path.join(cwd, './src/index.ts'),
  appName,
  appEmail,
  id: 'pagelines',
  version,
})

export const factorRouter = new FactorRouter<CompiledServiceConfig>({
  routes,
  factorEnv,
  baseUrl: liveUrl,
})

export const factorApp = new FactorApp({
  liveUrl,
  port: +factorEnv.var('APP_PORT', { fallback: 3434 }),
  rootComponent: AppEntry,
  factorRouter,
  isLive: factorEnv.isProd,
  ui: { },
  uiPaths: [
    path.join(cwd, './src/**/*.{vue,js,ts,html}'),
    path.join(cwd, './src/*.{vue,js,ts,html}'),
  ],
  factorEnv,
  srcFolder: path.join(cwd, './src'),
  hooks: [
    {
      hook: 'beforeAppMounted',
      callback: async (entry) => {
        // eslint-disable-next-line ts/no-use-before-define
        await factorMonitor.installBrowserMonitoring(entry)
      },
    },
    {
      hook: 'viteConfig',
      callback: async (configs) => {
        return [
          ...configs,
          {
            // The watched package must be excluded from optimization,
            // so that it can appear in the dependency graph and trigger hot reload.
            optimizeDeps: {
              exclude: ['@pagelines/core', '@pagelines/www'],
            },
          },
        ]
      },
    },
  ],
})

export const factorDb = new FactorDb({
  connectionUrl: factorEnv.var('POSTGRES_URL'),
  factorEnv,
})

const factorNotify = new FactorNotify({ factorEnv })

export const factorServer = new FactorServer({
  serverName: 'PageLinesServer',
  port: +factorEnv.var('SERVER_PORT', { fallback: 7777 }),
  liveUrl: 'https://server.pagelines.com',
  isLive: factorEnv.isProd,
  factorEnv,
})

export const factorEmail = new FactorEmail({
  factorEnv,
  smtpHost: factorEnv.var('SMTP_HOST'),
  smtpPassword: factorEnv.var('SMTP_PASSWORD'),
  smtpUser: factorEnv.var('SMTP_USER'),
  appUrl: factorApp.appUrl,
})

export const factorUser = new FactorUser({
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
        await factorRouter.goto('home')
      },
    },
  ],
})

const factorMonitor = new FactorMonitor({
  factorEnv,
  factorUser,
  factorApp,
  factorEmail,
  slackWebhookUrl: factorEnv.var('SLACK_WEBHOOK_URL'),
  sentryPublicDsn: factorEnv.var('SENTRY_PUBLIC_DSN'),
  mailchimpApiKey: factorEnv.var('MAILCHIMP_API_KEY'),
  mailchimpListId: '',
  mailchimpServer: '',
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
  bucket: 'factor-media',
  unsplashAccessKey: '',
  cdnUrl: 'https://media.pagelines.com',
})

const pluginServices = {
  factorEnv,
  factorApp,
  factorServer,
  factorDb,
  factorRouter,
  factorUser,
  factorEmail,
  factorMonitor,
  factorCache,
}

const factorContact = new FactorContact({ ...pluginServices })

const factorStripe = new FactorStripe(
  getStripeConfig({
    factorEnv,
    factorApp,
    factorServer,
    factorRouter,
    factorUser,
    factorDb,
    isLive: true,
    hooks: [],
    useCustomerManager: true,
    customerPortalUrl:
      'https://checkout.pagelines.com/p/login/fZe8x25Lk1qialy000',
  }),
)

const factorTeam = new FactorTeam({ ...pluginServices })
const fictionUi = new FictionUi(pluginServices)

const pageLinesAdmin = new PageLinesAdmin({
  ...pluginServices,
})

const pageLinesData = new PageLinesData({
  ...pluginServices,
  openAIApiKey: factorEnv.var('OPENAI_API_KEY'),
  pineconeApiKey: factorEnv.var('PINECONE_API_KEY'),
  pineconeEnvironment: factorEnv.var('PINECONE_ENVIRONMENT'),
  pineconeIndex: factorEnv.var('PINECONE_INDEX'),
})

const pageLinesTag = new PageLinesTag({
  ...pluginServices,
  scriptLiveUrl: 'https://tag.pagelines.com',
  scriptPort: 2222,
})

const pageLinesAgent = new PageLinesAgent({
  ...pluginServices,
  pageLinesTag,
  pageLinesData,
  factorStripe,
  liveBaseUrl: 'https://embed.pagelines.com/agent',
})

const pageLinesEmbed = new PageLinesEmbed({
  ...pluginServices,
  port: 12_321,
})

const factorUi = new FactorUi({
  factorEnv,
  factorApp,
  factorRouter,
  Logo: FictionLogo,
})

async function initializeBackingServices() {
  await factorDb.init()
  factorEmail.init()
}

factorEnv.addHook({
  hook: 'runCommand',
  callback: async (command: string, opts: CliOptions) => {
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
    else {
      await initializeBackingServices()

      if (command === 'dev') {
        await Promise.all([
          factorServer.createServer(),
          factorApp.ssrServerCreate(),
          pageLinesTag.dev({
            organizationIds: ['example'],
            disableWatch: false,
          }),
        ])
      }
      else if (command === 'build' || command === 'render') {
        const { serve } = opts

        await factorServer.createServer()

        await factorApp.buildApp({ serve, render: true })
      }
      else if (command === 'app') {
        const { build } = opts
        if (build)
          await factorApp.buildApp()
        // await factorApp.ssrServerCreate({ isProd: true })

        await factorApp.serveStaticApp()
      }
      else if (command === 'tag') {
        await pageLinesTag.tagStaticServer()
      }
      else if (command === 'server') {
        await factorServer.createServer({ factorUser })
      }
    }
  },
})

export const service = {
  factorApp,
  factorRouter,
  factorEnv,
  factorUser,
  fictionUi,
  factorUi,
  factorStripe,
  factorCache,
  factorNotify,
  factorMonitor,
  factorTeam,
  factorMedia,
  factorDb,
  factorServer,
  factorEmail,
  factorAws,
  pageLinesAdmin,
  pageLinesData,
  pageLinesAgent,
  pageLinesEmbed,
  pageLinesTag,
  factorContact,
}

export type ServiceContainer = typeof service

export function setup(): ServiceConfig {
  return { service }
}
