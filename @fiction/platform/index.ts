import type { AppRoute, MetaAppDetails, ServiceConfig } from '@fiction/core/index.js'
import path from 'node:path'
import { FictionApp, FictionCache, FictionDb, FictionEmail, FictionEnv, FictionRouter, FictionServer, FictionUser, getEnvVars, safeDirname } from '@fiction/core/index.js'
import { FictionDevRestart } from '@fiction/core/plugin-env/restart'
import { FictionUi } from '@fiction/ui/index.js'

export * from '@fiction/core'
export * from '@fiction/ui'

export interface CreateSiteOptions {
  meta: MetaAppDetails
  version: string
  cwd?: string
  mainFilePath?: string
  routes?: AppRoute[]
  port?: number
}

export function createSite(options: CreateSiteOptions): ServiceConfig {
  const {
    meta,
    version,
    cwd = path.resolve(),
    mainFilePath = path.join(cwd, './src/index.ts'),
    routes = [],
    port = 3000,
  } = options

  const envFiles = [path.join(cwd, './.env')]

  const fictionEnv = new FictionEnv({ cwd, envFiles, envFilesProd: envFiles, mainFilePath, version, meta })

  const envVarNames = [
    'TOKEN_SECRET',
    'POSTGRES_URL',
    'SMTP_HOST',
    'SMTP_PASSWORD',
    'SMTP_USER',
    'REDIS_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
  ] as const

  const v = getEnvVars(fictionEnv, envVarNames)
  const {
    tokenSecret,
    postgresUrl,
    smtpHost,
    smtpPassword,
    smtpUser,
    redisUrl,
    googleClientId,
    googleClientSecret,
  } = v

  const comboPort = +fictionEnv.var('APP_PORT') || port

  const fictionRouter = new FictionRouter({
    routerId: 'mainRouter',
    fictionEnv,
    baseUrl: fictionEnv.meta?.url,
    routes: () => routes,
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

  const fictionCache = new FictionCache({ fictionEnv, redisUrl })
  const fictionServer = new FictionServer({ fictionEnv, serverName: 'FictionPlatform', port: comboPort, liveUrl: fictionEnv.meta?.url })
  const fictionDb = new FictionDb({ fictionEnv, fictionServer, postgresUrl })
  const fictionEmail = new FictionEmail({ fictionEnv, smtpHost, smtpPassword, smtpUser, sendingDomain: `mail.${meta.domain}` })

  const base = { fictionEnv, fictionApp, fictionServer, fictionDb, fictionEmail, fictionRouter }
  const fictionUser = new FictionUser({ ...base, googleClientId, googleClientSecret, tokenSecret })

  const fictionUi = new FictionUi({ fictionEnv, apps: [fictionApp] })

  const service = {
    fictionEnv,
    fictionApp,
    fictionServer,
    fictionDb,
    fictionCache,
    fictionEmail,
    fictionRouter,
    fictionUser,
    fictionUi,
  }

  async function initializeBackingServices(_args: { context: 'node' | 'app' }) {
    fictionCache.init()
    await Promise.all([
      fictionDb.init(),
      fictionEmail.init(),
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
            }

            const mode = command !== 'dev' ? 'prod' : 'dev'
            await fictionApp.ssrServerSetup({ expressApp: srv?.expressApp, mode })

            await srv?.run()

            fictionApp.logReady({ serveMode: 'comboSSR' })
          }
        }
        else if (command === 'build' || command === 'render') {
          const { serve } = options
          await fictionApp.buildApp({ serve, render: false })
        }
        else if (command === 'generate') {
          await fictionEnv.generate()
        }
      }
    },

    createMount: async (args) => {
      return fictionApp.mountApp(args)
    },
  }
}
