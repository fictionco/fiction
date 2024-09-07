import path from 'node:path'
import { faker } from '@faker-js/faker'
import { FictionUi } from '@fiction/ui'
import { FictionApp, FictionDb, FictionEmail, FictionEnv, FictionRouter, FictionServer, FictionUser, type RunVars } from '..'
import { version as fictionVersion } from '../package.json'
import ElRoot from '../plugin-app/ElRoot.vue'
import { runServicesSetup } from '../plugin-env'
import { log } from '../plugin-log'
import { randomBetween, safeDirname } from '../utils/utils'
import { crossVar, getEnvVars } from '../utils/vars'
import { getTestEmail, testEnvFile } from './util'
import type { EnvVar, ServiceList } from '../plugin-env'
import type { Organization, User } from '../plugin-user'
import type { vue } from '../utils'

const logger = log.contextLogger('testUtils')

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
  org: Organization
  orgId: string
  token: string
  email: string
  password: string
}

export type TestService = Awaited<ReturnType<typeof createTestUtilServices>>

export type TestUtils = {
  init: (services?: ServiceList) => Promise<InitializedTestUtils>
  initialized?: InitializedTestUtils
  close: () => Promise<void>
  initUser: () => Promise<InitializedTestUtils>
} & TestService

export interface TestUtilSettings {
  context?: 'app' | 'node'
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

export async function createTestUser(fictionUser: FictionUser, opts: { caller?: string } = {}) {
  const caller = `createTestUser-${opts.caller || 'unknown'}`
  logger.info(`creating user - ${caller}`)
  const email = getTestEmail()
  const password = 'test'
  const fullName = faker.person.fullName()
  const orgName = faker.company.name()

  const r = await fictionUser.queries.ManageUser.serve(
    { fields: { email, password, emailVerified: true, fullName, orgName }, _action: 'create' },
    { server: true, caller: `createTestUser-${caller}`, returnAuthority: ['verify'] },
  )
  const user = r.data

  if (!user)
    throw new Error('no user created')

  if (!r.token)
    throw new Error('no token returned')

  if (!user.verify?.code)
    throw new Error('no code returned')

  const org = user.orgs?.[0]
  const orgId = org?.orgId

  if (!orgId)
    throw new Error('no org created')

  return { user, token: r.token, email, password, code: user?.verify?.code, org, orgId }
}

export async function initializeTestUser(args: { fictionUser: FictionUser, context?: 'node' | 'app' }): Promise<InitializedTestUtils> {
  const { fictionUser, context } = args

  const testUserDetails = await createTestUser(fictionUser, { caller: 'initializeTestUser' })

  const { user, token } = testUserDetails

  if (!token)
    throw new Error('token not returned (DB Connected?)')
  if (!user)
    throw new Error('no user created')

  if (!context || context === 'app') {
    fictionUser.setCurrentUser({ user, token, reason: 'testUtils' })

    fictionUser.setUserInitialized()
  }

  return testUserDetails
}

/**
 * Runs services 'setup' functions
 * Creates a new user
 */
export async function initializeTestUtils(service: TestUtilServices & ServiceList): Promise<InitializedTestUtils> {
  await runServicesSetup(service, { context: 'test' })

  const { fictionUser, fictionServer, fictionDb, fictionEmail } = service

  const promises = [
    fictionDb.init(),
    fictionEmail.init(),
    fictionServer.createServer({ fictionUser }),
  ]

  await Promise.all(promises)

  return initializeTestUser({ fictionUser })
}

export interface TestBaseCompiled {
  commands: string
  vars: string
  routes: string
  menus: string
  [key: string]: any
}

export function getTestPortVar(args: {
  fictionEnv: FictionEnv
  key: string
  optVal?: number
  context?: 'app' | 'node'
}) {
  const { fictionEnv, key, optVal, context } = args

  let port = optVal

  if (context === 'app') {
    port = +fictionEnv.var(key)
  }
  else {
    port = port || randomBetween(2_000, 31_000)
    crossVar.set(key as keyof RunVars, String(port))
  }

  return port
}

export function createTestUtilServices(opts?: TestUtilSettings) {
  const {
    context,
    cwd = safeDirname(import.meta.url),
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

  const meta = { version, app: { name: 'Test Fiction App', email: 'admin@fiction.com', url: 'https://testing.fiction.com', domain: 'fiction.com' } }
  const mainFilePath = opts?.mainFilePath || path.join(root, './main.ts')

  const env = { ...defaultEnv, ...opts?.env }
  const envFiles = [testEnvFile, ...(opts?.envFiles || [])]

  const fictionEnv = new FictionEnv({ envFiles, env, cwd, mainFilePath, id: 'test', meta })

  const appPort = getTestPortVar({ fictionEnv, optVal: opts?.appPort, key: 'APP_PORT', context })
  const serverPort = getTestPortVar({ fictionEnv, optVal: opts?.serverPort, key: 'SERVER_PORT', context })

  // check env vars
  checkEnvVars.forEach((key) => {
    if (!fictionEnv.var(key))
      throw new Error(`env var not set: ${key}`)
  })

  // ENV VARS NEEDED

  const v = getEnvVars(fictionEnv, ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD', 'POSTGRES_URL', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'] as const)

  const { smtpHost, smtpUser, smtpPassword, googleClientId, googleClientSecret, postgresUrl } = v

  const fictionServer = new FictionServer({ port: serverPort, liveUrl: 'https://server.test.com', fictionEnv })
  const fictionRouter = new FictionRouter({ routerId: 'testRouter', fictionEnv, create: true })
  const fictionDb = new FictionDb({ fictionEnv, fictionServer, postgresUrl })
  const fictionEmail = new FictionEmail({ fictionEnv, smtpHost, smtpPassword, smtpUser })

  const base = { fictionEnv, fictionRouter, fictionServer, fictionDb, fictionEmail }

  const fictionApp = new FictionApp({ ...base, port: appPort, rootComponent, isTest: true })

  const fictionUser = new FictionUser({ ...base, googleClientId, googleClientSecret, tokenSecret: 'test', apolloApiKey: 'test' })

  const fictionUi = new FictionUi({ fictionEnv, apps: [fictionApp] })

  const services = { ...base, fictionApp, fictionUser, fictionUi }

  return services
}

export function createTestUtils(opts?: TestUtilSettings) {
  const service = createTestUtilServices(opts)

  const all = {
    init: async () => initializeTestUtils(service),
    initUser: async () => initializeTestUser(service),
    close: async () => {
      service.fictionServer.close()
      await service.fictionDb.close()
      await service.fictionApp.close()
    },
    runApp: async (args: { mode?: 'dev' | 'prod' | 'test', context?: 'node' | 'app' }) => {
      const { fictionUser, fictionServer, fictionDb, fictionApp } = service
      const { mode = 'test', context } = args

      logger.info(`Running app in ${mode} mode`, { data: args })

      if (context === 'node') {
        await fictionDb.init()
        const srv = await fictionServer.initServer({ useLocal: true, fictionUser })

        fictionApp.port.value = fictionServer.port.value

        await fictionApp.ssrServerSetup({ expressApp: srv?.expressApp, mode })

        await srv?.run()

        fictionApp.logReady({ serveMode: 'comboSSR' })
      }
    },
    ...service,
  }

  return all
}
