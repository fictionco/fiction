import path from 'node:path'
import { FactorUi } from '@factor/ui'
import type {
  CliOptions,
  ServiceConfig,
} from '@factor/api'
import {
  FactorApp,
  FactorDb,
  FactorEmail,
  FactorEnv,
  FactorRouter,
  FactorServer,
  FactorUser,
  safeDirname,
} from '@factor/api'
import { FactorMonitor } from '@factor/plugin-monitor'
import { FactorNotify } from '@factor/plugin-notify'
import { FactorContact } from '@factor/plugin-contact'

import { FactorDevRestart } from '@factor/api/plugin-env/restart'
import type { CompiledServiceConfig } from '../.factor/config'
import { version } from '../package.json'
import { routes } from './routes'
import App from './App.vue'

const cwd = safeDirname(import.meta.url, '..')
const repoRoot = safeDirname(import.meta.url, '../../..')
export const appName = 'Supereon'
export const appEmail = 'hello@supereon.ai'
export const liveUrl = 'https://www.supereon.ai'

export const factorEnv = new FactorEnv<CompiledServiceConfig>({
  envFiles: [path.join(repoRoot, './.env')],
  cwd,
  mainFilePath: path.join(cwd, './src/index.ts'),
  appName,
  appEmail,
  id: 'www',
  version,
})

export const factorRouter = new FactorRouter<CompiledServiceConfig>({
  routes,
  factorEnv,
  baseUrl: 'https://www.supereon.ai',
})

export const factorApp = new FactorApp({
  factorEnv,
  liveUrl,
  port: +(factorEnv.var('APP_PORT') || 3000),
  rootComponent: App,
  factorRouter,
  srcFolder: path.join(cwd, './src'),
  uiPaths: [
    path.join(cwd, './src/**/*.{vue,js,ts,html}'),
    path.join(cwd, './src/*.{vue,js,ts,html}'),
  ],
})

export const factorDb = new FactorDb({
  connectionUrl: factorEnv.var('POSTGRES_URL'),
  factorEnv,
})

export const factorServer = new FactorServer({
  serverName: 'SupereonServer',
  port: +factorEnv.var('SERVER_PORT', { fallback: 3333 }),
  liveUrl: 'https://server.fiction.com',
  factorEnv,
})

export const factorEmail = new FactorEmail({
  factorEnv,
  smtpHost: factorEnv.var('SMTP_HOST'),
  smtpPassword: factorEnv.var('SMTP_PASSWORD'),
  smtpUser: factorEnv.var('SMTP_USER'),
})

const factorNotify = new FactorNotify({ factorEnv })

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
    {
      hook: 'createUser',
      callback: async () => {},
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

const pluginServices = {
  factorEnv,
  factorApp,
  factorServer,
  factorDb,
  factorRouter,
  factorUser,
  factorEmail,
  factorMonitor,
}

const factorContact = new FactorContact({ ...pluginServices })

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
          watch: [safeDirname(import.meta.url, '..')],
        },
      })
    }
    else {
      await initializeBackingServices()
      await factorServer.createServer()

      if (command === 'dev') {
        await factorApp.ssrServerCreate()
      }
      else if (command === 'build' || command === 'render') {
        const { serve } = opts

        await factorApp.buildApp({ serve, render: true })
      }
      else if (command === 'app') {
        const { build } = opts
        if (build)
          await factorApp.buildApp()
        await factorApp.ssrServerCreate({ isProd: true })
      }
    }
  },
})

export const service = {
  factorEnv,
  factorApp,
  factorRouter,
  factorDb,
  factorServer,
  factorEmail,
  factorUser,
  factorNotify,
  factorContact,
  factorMonitor,
  factorUi: new FactorUi({ factorEnv, apps: [factorApp] }),
}

export type ServiceContainer = typeof service

export function setup(): ServiceConfig {
  return {
    factorEnv,
    createService: () => service,
    createMount: args => factorApp.mountApp(args),
  }
}
