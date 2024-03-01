import path from 'node:path'
import { FactorUi } from '@factor/ui'
import { version as factorVersion } from '../package.json'
import type { FactorObject, FactorPlugin } from '../plugin'
import type { vue } from '../utils'
import { randomBetween, safeDirname } from '../utils'
import type { EnvVar } from '../plugin-env'
import { runServicesSetup } from '../plugin-env'
import type { User } from '../plugin-user'
import {
  FactorApp,
  FactorDb,
  FactorEmail,
  FactorEnv,
  FactorRouter,
  FactorServer,
  FactorUser,
} from '..'
import ElRoot from '../plugin-app/ElRoot.vue'
import { getTestEmail } from './util'

export interface TestUtilServices {
  factorEnv: FactorEnv
  factorApp: FactorApp
  factorRouter: FactorRouter
  factorServer: FactorServer
  factorDb: FactorDb
  factorUser: FactorUser
  factorEmail: FactorEmail
}

export interface InitializedTestUtils {
  user: User
  orgId: string
  token: string
  email: string
  password: string
}

export type TestService = Awaited<ReturnType<typeof createTestUtilServices>>

export type TestUtils = {
  init: (
    services?: Record<string, FactorPlugin>,
  ) => Promise<InitializedTestUtils>
  initialized?: InitializedTestUtils
  close: () => Promise<void>
} & TestService

export interface TestUtilSettings {
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

/**
 * Runs services 'setup' functions
 * Creates a new user
 */
export async function initializeTestUtils(service: TestUtilServices & { [key: string]: FactorPlugin | FactorObject }): Promise<InitializedTestUtils> {
  await runServicesSetup(service, { context: 'test' })

  const { factorUser, factorServer, factorDb, factorEmail } = service

  const promises = [
    factorDb.init(),
    factorEmail.init(),
    factorServer.createServer({ factorUser }),

  ]

  await Promise.all(promises)

  const email = getTestEmail()
  const password = 'test'

  const r = await factorUser.queries.ManageUser.serve(
    {
      fields: { email, password, emailVerified: true },
      _action: 'create',
    },
    { server: true, caller: 'initializeTestUtilsCreate' },
  )

  const user = r.data
  const token = r.token

  if (!token)
    throw new Error('token not returned (DB Connected?')
  if (!user)
    throw new Error('no user created')

  factorUser.setCurrentUser({ user, token, reason: 'testUtils' })

  factorUser.setUserInitialized()

  const orgId = user.orgs?.[0].orgId

  if (!orgId)
    throw new Error('no org created')

  return { user, orgId, token, email, password }
}

export interface TestBaseCompiled {
  commands: string
  vars: string
  routes: string
  menus: string
  [key: string]: any
}

export function createTestUtilServices(opts?: TestUtilSettings) {
  const {
    serverPort = randomBetween(10_000, 20_000),
    appPort = randomBetween(1000, 10_000),
    cwd = safeDirname(import.meta.url),
    mainFilePath,
    envFiles = [],
    env = {},
    rootComponent = ElRoot,
    uiPaths = [],
    version = factorVersion,
    checkEnvVars = [],
  } = opts || {}

  const defaultEnv = {
    REDIS_URL: 'redis://localhost:6379',
    CLICKHOUSE_URL: 'http://default:@localhost:8123',
    POSTGRES_URL: 'http://test:test@localhost:5432/test',
  }

  const root = safeDirname(import.meta.url)

  const factorEnv = new FactorEnv({
    envFiles,
    env: { ...defaultEnv, ...env },
    cwd,
    mainFilePath: mainFilePath || path.join(root, './main.ts'),
    appName: 'Test App',
    appEmail: 'arpowers@gmail.com',
    appUrl: 'https://www.test.com',
    id: 'test',
    version,
  })

  // check env vars
  checkEnvVars.forEach((key) => {
    if (!factorEnv.var(key))
      throw new Error(`env var not set: ${key}`)
  })

  const factorServer = new FactorServer({ port: serverPort, liveUrl: 'https://server.test.com', factorEnv })
  const factorRouter = new FactorRouter({ routerId: 'testRouter', factorEnv, create: true })
  const factorDb = new FactorDb({ factorEnv, factorServer, connectionUrl: factorEnv.var('POSTGRES_URL') })
  const factorEmail = new FactorEmail({ factorEnv })

  const base = { factorEnv, factorRouter, factorServer, factorDb, factorEmail }

  const factorApp = new FactorApp({
    ...base,
    port: appPort,
    rootComponent,
    uiPaths,
    isTest: true,
  })

  const factorUser = new FactorUser({
    ...base,
    googleClientId: factorEnv.var('GOOGLE_CLIENT_ID'),
    googleClientSecret: factorEnv.var('GOOGLE_CLIENT_SECRET'),
    tokenSecret: 'test',
  })

  const factorUi = new FactorUi({ factorEnv, apps: [factorApp] })

  const services = {
    ...base,
    factorApp,
    factorUser,
    factorUi,
  }

  return services
}

export async function createTestUtils(opts?: TestUtilSettings) {
  const service = createTestUtilServices(opts)

  const all = {
    init: () => initializeTestUtils(service),
    close: async () => {
      service.factorServer.close()
      await service.factorDb.close()
    },
    ...service,
  }

  return all
}
