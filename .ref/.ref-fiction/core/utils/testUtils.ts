import path from 'node:path'
import type {
  FactorPlugin,
  Organization,
} from '@factor/api'
import {
  FactorAws,
  objectId,
  randomBetween,
  safeDirname,
} from '@factor/api'
import App from '@fiction/studio/src/App.vue'
import type {
  InitializedTestUtils,
  RawTestUtils,
  TestUtilServices,
  TestUtilSettings,
} from '@factor/api/test-utils/init'
import {
  createTestUtilServices,
  initializeTestUtils,
} from '@factor/api/test-utils/init'
import { FactorCache } from '@factor/api/plugin-cache'
import { FactorTeam } from '@fiction/core/plugin-team'
import { FactorStripe } from '@factor/plugin-stripe'
import { FactorDashboard } from '../plugin-dashboards'
import { FictionInstance } from '../plugin-instance'
import { FictionJobs } from '../plugin-jobs'
import { FictionPayment } from '../plugin-payment'
import { FictionModel } from '../plugin-models'
import { FictionUsage } from '../plugin-usage'
import { FactorAdmin } from '../plugin-admin'
import { FictionPush } from '../plugin-push'

const appRoot = safeDirname(import.meta.url, '../../app')
const repoRoot = safeDirname(import.meta.url, '../../..')

type FictionInitializedTestUtils = InitializedTestUtils & {
  organization: Organization
}

type ReturnServices = TestUtilServices & {
  factorAdmin: FactorAdmin
  factorTeam: FactorTeam
  factorCache: FactorCache
  factorAws: FactorAws
  fictionInstance: FictionInstance
  factorDashboard: FactorDashboard
  fictionJobs: FictionJobs
  fictionModel: FictionModel
  fictionPayment: FictionPayment
  fictionUsage: FictionUsage
  fictionPush: FictionPush
}

export type FictionTestUtils = RawTestUtils &
  ReturnServices & {
    anonymousId: string
    init: (s?: {
      [key: string]: FactorPlugin
    }) => Promise<FictionInitializedTestUtils>
    initialized?: FictionInitializedTestUtils
    close: () => void
    [key: string]: any
  }

type FictionTestUtilSettings = {
  apiPort?: number
  socketPort?: number
  testAppPort?: number
  initialize?: boolean
  envFiles?: string[]
  testId?: string
  headless?: boolean
  uiSpeed?: number
} & TestUtilSettings

export async function createFictionTestUtils(opts: FictionTestUtilSettings = {}): Promise<FictionTestUtils> {
  const {
    socketPort = randomBetween(3000, 7000),
    initialize = false,
    cwd = appRoot,
    envFiles = [],
  } = opts || {}

  const baseUtil = await createTestUtilServices({
    ...opts,
    cwd,
    envFiles: [path.join(repoRoot, './.env'), ...envFiles],
    rootComponent: App,
    uiPaths: [
      path.join(appRoot, './src/**/*.vue'),
      path.join(appRoot, './src/*.vue'),
    ],
  })

  const factorAws = new FactorAws({
    factorEnv: baseUtil.factorEnv,
    awsAccessKey: baseUtil.factorEnv.var('AWS_ACCESS_KEY'),
    awsAccessKeySecret: baseUtil.factorEnv.var('AWS_ACCESS_KEY_SECRET'),
  })

  const factorCache = new FactorCache({
    factorEnv: baseUtil.factorEnv,
    factorServer: baseUtil.factorServer,
    factorAws,
    factorDb: baseUtil.factorDb,
    factorUser: baseUtil.factorUser,
    redisConnectionUrl: baseUtil.factorEnv.var('REDIS_URL'),
  })

  const factorAdmin = new FactorAdmin({
    ...baseUtil,
    factorAws,
  })

  const fictionJobs = new FictionJobs({
    ...baseUtil,
    factorCache,
  })

  const factorStripe = new FactorStripe({
    ...baseUtil,
    isLive: false,
    hooks: [],
    products: [],
    customerPortalUrl: '#',
  })

  const fictionPayment = new FictionPayment({
    ...baseUtil,
    factorStripe,
  })

  const fictionUsage = new FictionUsage({
    ...baseUtil,
    fictionPayment,
  })

  const backing = {
    ...baseUtil,
    factorCache,
    factorAws,
    fictionJobs,
    fictionPayment,
    factorAdmin,
    fictionUsage,
  }

  const fictionPush = new FictionPush({ ...backing })

  const fictionInstance = new FictionInstance({
    ...backing,
    fictionJobs,
    fictionPayment,
    socketPort,
    socketUrlLive: '#',
    isTest: true,
    fictionPush,
  })

  const factorTeam = new FactorTeam({ ...backing })

  const factorDashboard = new FactorDashboard({ ...backing })

  const fictionModel = new FictionModel({
    ...backing,
    fictionJobs,
    factorDashboard,
    fictionInstance,
    modelBucket: 'fiction-testing',
  })

  const services: ReturnServices = {
    ...backing,
    fictionPush,
    factorAdmin,
    factorTeam,
    factorDashboard,
    fictionModel,
    fictionInstance,
  }

  const init = async (
    initServices: Record<string, FactorPlugin> = {},
  ): Promise<FictionInitializedTestUtils> => {
    const s = { ...baseUtil, ...services, ...initServices }

    const promises = [factorCache.init()]

    await Promise.all(promises)

    const created = await initializeTestUtils(s)

    const organization = baseUtil.factorUser.activeOrganization.value

    if (!organization)
      throw new Error('no organization')

    const out: FictionInitializedTestUtils = {
      ...created,
      organization,
    }

    return out
  }

  let initialized: FictionTestUtils['initialized']

  if (initialize)
    initialized = await init()

  const anonymousId = objectId()

  const utils = {
    ...baseUtil,
    init,
    initialized,
    anonymousId,
    ...services,
    close: async () => {},
  }

  return utils
}
