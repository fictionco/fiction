import path from 'node:path'
import type { FictionPluginSettings, ServiceConfig } from '@fiction/core'
import { FictionApp, FictionDb, FictionEmail, FictionEnv, FictionRouter, FictionServer, FictionUser } from '@fiction/core'
import { FictionUi } from '@fiction/ui'
import { FictionPlugin } from '@fiction/core/plugin'
import type { vue } from '@fiction/core/utils'
import { safeDirname } from '@fiction/core/utils'
import type { EnvVar } from '@fiction/core/plugin-env'
import { runServicesSetup } from '@fiction/core/plugin-env'
import ElRoot from '@fiction/core/plugin-app/ElRoot.vue'
import { version as fictionVersion } from './package.json'

export * from '@fiction/core'
export * from '@fiction/site'
export * from '@fiction/cards'
export * from '@fiction/ui'

export type SitesPluginSettings = {
  fictionEnv: FictionEnv
} & FictionPluginSettings

export class FictionPlatform extends FictionPlugin<SitesPluginSettings> {}

export type FictionPlatformServices = {
  fictionEnv: FictionEnv
  fictionApp: FictionApp
  fictionRouter: FictionRouter
  fictionServer: FictionServer
  fictionDb: FictionDb
  fictionUser: FictionUser
  fictionEmail: FictionEmail
}

export interface CreateSiteSettings {
  serverPort?: number
  appPort?: number
  cwd?: string
  mainFilePath?: string
  envFiles?: string[]
  env?: Record<string, string>
  checkEnvVars?: string[]
  rootComponent?: vue.Component
  uiPaths?: string[]
  envVars?: () => EnvVar<string>[]
  version?: string
  isGlobalSetup?: boolean
}

export async function initializeServices(args: { service: FictionPlatformServices, context: 'app' | 'node' }): Promise<void> {
  const { service, context } = args
  await runServicesSetup(service, { context })

  const { fictionUser, fictionServer, fictionDb, fictionEmail } = service

  const promises = [
    fictionDb.init(),
    fictionEmail.init(),
    fictionServer.createServer({ fictionUser }),

  ]

  await Promise.all(promises)
}

export function createFictionPlatformServices(opts?: CreateSiteSettings) {
  const {
    appPort = 3000,
    cwd = safeDirname(import.meta.url),
    mainFilePath,
    envFiles = [],
    env = {},
    rootComponent = ElRoot,
    uiPaths = [],
    version = fictionVersion,
    checkEnvVars = [],
  } = opts || {}

  const defaultEnv = {
    REDIS_URL: 'redis://localhost:6379',
    CLICKHOUSE_URL: 'http://default:@localhost:8123',
    POSTGRES_URL: 'http://test:test@localhost:5432/test',
  }

  const root = safeDirname(import.meta.url)

  const fictionEnv = new FictionEnv({
    envFiles,
    env: { ...defaultEnv, ...env },
    cwd,
    mainFilePath: mainFilePath || path.join(root, './main.ts'),
    id: 'test',
    meta: { version, app: { name: 'Test App', email: 'arpowers@gmail.com', url: 'https://www.test.com', domain: 'test.com' } },
  })

  // check env vars
  checkEnvVars.forEach((key) => {
    if (!fictionEnv.var(key))
      throw new Error(`env var not set: ${key}`)
  })

  const fictionServer = new FictionServer({ port: appPort, liveUrl: 'https://server.test.com', fictionEnv })
  const fictionRouter = new FictionRouter({ routerId: 'testRouter', fictionEnv, create: true })
  const fictionDb = new FictionDb({ fictionEnv, fictionServer, connectionUrl: fictionEnv.var('POSTGRES_URL') })
  const fictionEmail = new FictionEmail({ fictionEnv })

  const base = { fictionEnv, fictionRouter, fictionServer, fictionDb, fictionEmail }

  const fictionApp = new FictionApp({
    ...base,
    port: appPort,
    rootComponent,
    uiPaths,
    isTest: true,
  })

  const fictionUser = new FictionUser({
    ...base,
    googleClientId: fictionEnv.var('GOOGLE_CLIENT_ID'),
    googleClientSecret: fictionEnv.var('GOOGLE_CLIENT_SECRET'),
    tokenSecret: 'test',
  })

  const fictionUi = new FictionUi({ fictionEnv, apps: [fictionApp] })

  const services = { ...base, fictionApp, fictionUser, fictionUi }

  return services
}

export function createSite(opts?: CreateSiteSettings): ServiceConfig {
  const service = createFictionPlatformServices(opts)

  const all: ServiceConfig = {
    close: async () => {
      service.fictionServer.close()
      await service.fictionDb.close()
      await service.fictionApp.close()
    },
    fictionEnv: service.fictionEnv,
    runCommand: async ({ context }) => {
      await initializeServices({ service, context })
    },
    createService: async () => service,
    createMount: async (args) => {
      return await service.fictionApp.mountApp(args)
    },
  }

  return all
}
