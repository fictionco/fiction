import path from 'node:path'
import { FictionUi } from '@fiction/ui'
import { version as fictionVersion } from '../package.json'
import type { FictionObject, FictionPlugin } from '../plugin'
import type { vue } from '../utils'
import { randomBetween, safeDirname } from '../utils/utils'
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

export type InitializedTestUtils = {
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

const randomName = () => `${['Captain', 'Mister', 'Doctor', 'Professor', 'Mad', 'Sir'][Math.floor(Math.random() * 6)]} ${['Waffles', 'Pancakes', 'Spaghetti', 'Snickers', 'Twinkles', 'Moonbeam'][Math.floor(Math.random() * 6)]}`
export async function createTestUser(fictionUser: FictionUser) {
  const email = getTestEmail()
  const password = 'test'
  const fullName = randomName()

  const r = await fictionUser.queries.ManageUser.serve(
    {
      fields: { email, password, emailVerified: true, fullName },
      _action: 'create',
    },
    { server: true, caller: 'initializeTestUtilsCreate', returnAuthority: ['verify'] },
  )

  return { user: r.data, token: r.token, email, password }
}

export async function initializeTestUser(args: { fictionUser: FictionUser }): Promise<InitializedTestUtils> {
  const { fictionUser } = args

  const { user, token, email, password } = await createTestUser(fictionUser)

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

  return await initializeTestUser({ fictionUser })
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
    meta: { version, app: { name: 'Test Fiction App', email: 'admin@fiction.com', url: 'https://testing.fiction.com', domain: 'fiction.com' } },
  })

  // check env vars
  checkEnvVars.forEach((key) => {
    if (!fictionEnv.var(key))
      throw new Error(`env var not set: ${key}`)
  })

  // ENV VARS NEEDED
  const smtpHost = fictionEnv.var('SMTP_HOST')
  const smtpPassword = fictionEnv.var('SMTP_PASSWORD')
  const smtpUser = fictionEnv.var('SMTP_USER')
  const connectionUrl = fictionEnv.var('POSTGRES_URL')
  const googleClientId = fictionEnv.var('GOOGLE_CLIENT_ID')
  const googleClientSecret = fictionEnv.var('GOOGLE_CLIENT_SECRET')

  const fictionServer = new FictionServer({ port: serverPort, liveUrl: 'https://server.test.com', fictionEnv })
  const fictionRouter = new FictionRouter({ routerId: 'testRouter', fictionEnv, create: true })
  const fictionDb = new FictionDb({ fictionEnv, fictionServer, connectionUrl })
  const fictionEmail = new FictionEmail({ fictionEnv, smtpHost, smtpPassword, smtpUser })

  const base = { fictionEnv, fictionRouter, fictionServer, fictionDb, fictionEmail }

  const fictionApp = new FictionApp({ ...base, port: appPort, rootComponent, isTest: true })

  const fictionUser = new FictionUser({ ...base, googleClientId, googleClientSecret, tokenSecret: 'test' })

  const fictionUi = new FictionUi({ fictionEnv, apps: [fictionApp] })

  const services = { ...base, fictionApp, fictionUser, fictionUi }

  return services
}

export function createTestUtils(opts?: TestUtilSettings) {
  const service = createTestUtilServices(opts)

  const all = {
    init: () => initializeTestUtils(service),
    initUser: () => initializeTestUser(service),
    close: async () => {
      service.fictionServer.close()
      await service.fictionDb.close()
      await service.fictionApp.close()
    },
    runApp: async (args: { isProd?: boolean, context?: 'node' | 'app' } = {}) => {
      const { fictionUser, fictionServer, fictionDb, fictionApp } = service
      const { isProd = false } = args
      await fictionDb.init()
      const srv = await fictionServer.initServer({ useLocal: true, fictionUser })

      const port = fictionApp.port.value = fictionServer.port.value

      await fictionApp.ssrServerSetup({ expressApp: srv?.expressApp, isProd })


      await srv?.run()

      fictionApp.logReady({ serveMode: 'comboSSR' })

      return { port }
    },
    ...service,
  }

  return all
}
