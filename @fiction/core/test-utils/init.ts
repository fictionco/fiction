import path from 'node:path'
import { FictionUi } from '@fiction/ui'
import { version as fictionVersion } from '../package.json'
import type { FictionObject, FictionPlugin } from '../plugin'
import type { vue } from '../utils'
import { randomBetween, safeDirname } from '../utils'
import type { EnvVar } from '../plugin-env'
import { runServicesSetup } from '../plugin-env'
import type { User } from '../plugin-user'
import {
  FictionApp,
  FictionDb,
  FictionEmail,
  FictionEnv,
  FictionRouter,
  FictionServer,
  FictionUser,
} from '..'
import ElRoot from '../plugin-app/ElRoot.vue'
import { getTestEmail } from './util'

export interface TestUtilServices {
  fictionEnv: FictionEnv
  fictionApp: FictionApp
  fictionRouter: FictionRouter
  fictionServer: FictionServer
  fictionDb: FictionDb
  fictionUser: FictionUser
  fictionEmail: FictionEmail
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
    services?: Record<string, FictionPlugin>,
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
export async function initializeTestUtils(service: TestUtilServices & { [key: string]: FictionPlugin | FictionObject }): Promise<InitializedTestUtils> {
  await runServicesSetup(service, { context: 'test' })

  const { fictionUser, fictionServer, fictionDb, fictionEmail } = service

  const promises = [
    fictionDb.init(),
    fictionEmail.init(),
    fictionServer.createServer({ fictionUser }),

  ]

  await Promise.all(promises)

  const email = getTestEmail()
  const password = 'test'

  const r = await fictionUser.queries.ManageUser.serve(
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

  fictionUser.setCurrentUser({ user, token, reason: 'testUtils' })

  fictionUser.setUserInitialized()

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
    appName: 'Test App',
    appEmail: 'arpowers@gmail.com',
    appUrl: 'https://www.test.com',
    id: 'test',
    version,
  })

  // check env vars
  checkEnvVars.forEach((key) => {
    if (!fictionEnv.var(key))
      throw new Error(`env var not set: ${key}`)
  })

  const fictionServer = new FictionServer({ port: serverPort, liveUrl: 'https://server.test.com', fictionEnv })
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

  const services = {
    ...base,
    fictionApp,
    fictionUser,
    fictionUi,
  }

  return services
}

export async function createTestUtils(opts?: TestUtilSettings) {
  const service = createTestUtilServices(opts)

  const all = {
    init: () => initializeTestUtils(service),
    close: async () => {
      service.fictionServer.close()
      await service.fictionDb.close()
    },
    ...service,
  }

  return all
}
