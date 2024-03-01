import path from 'node:path'
import type {
  FactorPlugin,
} from '@factor/api'
import {
  FactorAws,
  FactorServer,
  objectId,
  randomBetween,
  safeDirname,
} from '@factor/api'
import App from '@kaption/app/src/App.vue'
import type { CompiledServiceConfig } from '@kaption/app/.factor/config'
import type {
  InitializedTestUtils,
  RawTestUtils,
  TestUtilSettings,
} from '@factor/api/testUtils'
import {
  createTestUtilServices,
  initializeTestUtils,
} from '@factor/api/testUtils'
import { KaptionClient } from '@kaption/client'
import type { Project } from '@factor/api/plugin-admin'
import { FactorAdmin } from '@factor/api/plugin-admin'
import { KaptionCache } from '../plugin-cache'
import { KaptionClickHouse } from '../plugin-clickhouse'
import { KaptionDashboard } from '../plugin-dashboards'
import type { KaptionPluginSettings } from '../utils'
import { KaptionFilter } from '../plugin-dashboards/plugin-filters'
import { KaptionBeacon } from '../plugin-beacon'
import { KaptionEventOps } from '../plugin-beacon/ops'
import type { TagSettings } from '../plugin-tag'
import { KaptionTag } from '../plugin-tag'
import { KaptionCoreUi } from '../ui'
import { KaptionTeam } from '../plugin-team'
import ElDummy from './ElDummy.vue'

const appRoot = safeDirname(import.meta.url, '../../app')
// const coreRoot = safeDirname(import.meta.url, "..")
const repoRoot = safeDirname(import.meta.url, '../../..')
// const envFilePath = path.join(coreRoot, "/.env")

type KaptionInitializedTestUtils = InitializedTestUtils & {
  kaptionClient: KaptionClient
  project: Project
}

export type KaptionTestUtils = RawTestUtils &
  KaptionPluginSettings & {
    factorAdmin: FactorAdmin
    kaptionTeam: KaptionTeam
    kaptionBeacon: KaptionBeacon
    kaptionEventOps: KaptionEventOps
    kaptionCache: KaptionCache
    kaptionClickHouse: KaptionClickHouse
    kaptionTag: KaptionTag
    anonymousId: string
    init: (s?: {
      [key: string]: FactorPlugin
    }) => Promise<KaptionInitializedTestUtils>
    initialized?: KaptionInitializedTestUtils
    close: () => void
    [key: string]: any
  }

// export type KaptionDataTestUtils = RawTestUtils &
//   KaptionPluginSettings & {
//     factorAdmin: FactorAdmin
//     kaptionBeacon: KaptionBeacon
//     kaptionTag: KaptionTag
//     close: () => void
//     init: () => Promise<KaptionInitializedTestUtils>
//     initialized?: KaptionInitializedTestUtils
//   }

type KaptionTestUtilSettings = {
  apiPort?: number
  widgetPort?: number
  beaconPort?: number
  sessionPort?: number
  scriptPort?: number
  testAppPort?: number
  initialize?: boolean

  envFiles?: string[]
  testId?: string
  tagSettings?: TagSettings & { [key: string]: unknown }
  headless?: boolean
  uiSpeed?: number
} & TestUtilSettings

// type DataTestUtilSettings = {
//   envFiles?: string[]
//   cwd?: string
//   apiPort?: number
//   beaconPort?: number
//   sessionPort?: number
//   scriptPort?: number
//   testAppPort?: number
//   initialize?: boolean
//   testId?: string
//   tagSettings?: TagSettings & { [key: string]: unknown }
//   headless?: boolean
//   uiSpeed?: number
// } & TestUtilSettings

export async function createKaptionTestUtils<S extends CompiledServiceConfig>(opts: KaptionTestUtilSettings = {}): Promise<KaptionTestUtils> {
  const {
    apiPort = randomBetween(20_000, 30_000),
    widgetPort = randomBetween(3000, 7000),
    beaconPort = randomBetween(3000, 7000),
    sessionPort = randomBetween(3000, 7000),
    scriptPort = randomBetween(7000, 12_000),
    testAppPort = randomBetween(12_000, 19_000),
    initialize = false,
    cwd = appRoot,
    envFiles = [],
    testId,
    // tagSettings = {},
    headless = false,
    uiSpeed = 1000,
  } = opts || {}

  const baseUtil = await createTestUtilServices<S>({
    ...opts,
    cwd,
    envFiles: [path.join(repoRoot, './.env'), ...envFiles],
    rootComponent: App,
    uiPaths: [
      path.join(appRoot, './src/**/*.vue'),
      path.join(appRoot, './src/*.vue'),
    ],
  })

  const apiServer = new FactorServer({
    factorEnv: baseUtil.factorEnv,
    serverName: 'testApiServer',
    port: apiPort,
  })

  const kaptionClickHouse = new KaptionClickHouse({
    factorEnv: baseUtil.factorEnv,
    apiServer,
    factorUser: baseUtil.factorUser,
    connectionUrl: baseUtil.factorEnv.var('CLICKHOUSE_URL'),
  })

  const factorAws = new FactorAws({
    factorEnv: baseUtil.factorEnv,
    awsAccessKey: baseUtil.factorEnv.var('AWS_ACCESS_KEY'),
    awsAccessKeySecret: baseUtil.factorEnv.var('AWS_ACCESS_KEY_SECRET'),
  })

  const kaptionCache = new KaptionCache({
    factorEnv: baseUtil.factorEnv,
    apiServer,
    factorAws,
    factorDb: baseUtil.factorDb,
    factorUser: baseUtil.factorUser,
    redisConnectionUrl: baseUtil.factorEnv.var('REDIS_URL'),
  })

  const factorAdmin = new FactorAdmin({
    ...baseUtil,
    factorAws,
    elAdminPage: ElDummy,
    elAdminWrap: ElDummy,
  })

  const kaptionTeam = new KaptionTeam({
    ...baseUtil,
    factorAdmin,
    kaptionCache,
    kaptionClickHouse,
    factorAws,
  })

  const kaptionCoreUi = new KaptionCoreUi({
    factorEnv: baseUtil.factorEnv,
    factorApp: baseUtil.factorApp,
    factorRouter: baseUtil.factorRouter,
    factorUser: baseUtil.factorUser,
    factorAdmin,
  })

  const kaptionFilter = new KaptionFilter({
    factorEnv: baseUtil.factorEnv,
    factorAdmin,
    factorRouter: baseUtil.factorRouter,
  })

  const kaptionDashboard = new KaptionDashboard({
    ...baseUtil,
    factorAdmin,
    widgetPort,
    kaptionFilter,
  })

  const pluginServices = {
    ...baseUtil,
    apiServer,
    kaptionClickHouse,
    kaptionCache,
    factorAws,
    factorAdmin,
    kaptionTeam,
    kaptionDashboard,
    kaptionFilter,
    kaptionCoreUi,
  }

  const kaptionEventOps = new KaptionEventOps(pluginServices)

  const kaptionBeacon = new KaptionBeacon({
    ...pluginServices,
    kaptionEventOps,
    beaconPort,
    sessionPort,
    eventsPubSubId: testId ? `events-${testId}` : undefined,
    sessionExpireAfterMs: 5000,
    checkExpiredIntervalMs: 100,
    bufferIntervalMs: 100,
  })

  const kaptionTag = new KaptionTag({
    scriptPort,
    testAppPort,
    mode: 'development',
    factorDb: baseUtil.factorDb,
    factorEnv: baseUtil.factorEnv,
    kaptionBeacon,
    kaptionCache,
    intervalSeconds: 0.1,
    statSeconds: 2,
    isTest: true,
    testHeadless: headless,
    testUiSpeed: uiSpeed,
  })

  const kaptionServices = {
    apiServer,
    kaptionClickHouse,
    kaptionCache,
    kaptionBeacon,
    kaptionEventOps,
    kaptionTag,
    factorAws,
    factorAdmin,
    kaptionTeam,
    kaptionDashboard,
    kaptionFilter,
    kaptionCoreUi,
  }

  const init = async (
    services: Record<string, FactorPlugin> = {},
  ): Promise<KaptionInitializedTestUtils> => {
    const s = { ...baseUtil, ...kaptionServices, ...services }

    const promises = [
      kaptionClickHouse.init(),
      kaptionCache.init(),
      apiServer.createServer({ factorUser: baseUtil.factorUser }),
    ]

    await Promise.all(promises)

    const created = await initializeTestUtils(s)

    const project = factorAdmin.activeProject.value

    if (!project)
      throw new Error('no project')

    const projectId = project.projectId

    const out: KaptionInitializedTestUtils = {
      ...created,
      kaptionClient: new KaptionClient({ projectId }),
      project,
    }

    return out
  }

  let initialized: KaptionTestUtils['initialized']

  if (initialize)
    initialized = await init()

  const utils = {
    ...baseUtil,
    init,
    initialized,
    anonymousId: objectId(),
    ...kaptionServices,
    close: async () => {
      await apiServer.close()
      await kaptionBeacon.close()
      await kaptionTag.close()
    },
  }

  return utils
}
