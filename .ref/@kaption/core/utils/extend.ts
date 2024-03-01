import type {
  FactorApp,
  FactorAws,
  FactorDb,
  FactorEmail,
  FactorEnv,
  FactorRouter,
  FactorServer,
  FactorUser,
} from '@factor/api'
import {
  FactorPlugin,
  Query,
} from '@factor/api'
import type { KaptionClickHouse } from '@kaption/core/plugin-clickhouse'
import type { FactorStripe } from '@factor/plugin-stripe'
import type { FactorAdmin } from '@factor/api/plugin-admin'
import type { KaptionCache } from '../plugin-cache'

import type { KaptionDashboard } from '../plugin-dashboards'
import type { KaptionFilter } from '../plugin-dashboards/plugin-filters'

export enum DbTable {
  Project = 'kaption_project',
  Org = 'kaption_organization',
  Usage = 'kaption_usage',
  Session = 'kaption_session',
  Member = 'kaption_organization_user',
  User = 'factor_user',
  Event = 'kaption_custom_event',
}

export interface KaptionPluginSettings {
  factorEnv: FactorEnv
  factorApp?: FactorApp
  factorRouter?: FactorRouter
  factorUser?: FactorUser
  factorDb: FactorDb
  factorServer: FactorServer
  factorEmail: FactorEmail
  kaptionCache?: KaptionCache
  kaptionClickHouse?: KaptionClickHouse
  factorAws: FactorAws
  factorStripe?: FactorStripe
  factorAdmin?: FactorAdmin
  kaptionDashboard?: KaptionDashboard
  kaptionFilter?: KaptionFilter
  mode?: 'development' | 'production'
  isTest?: boolean
}

export abstract class KaptionPlugin<
  T extends Record<string, unknown> = {},
> extends FactorPlugin<T & KaptionPluginSettings> {
  t = DbTable
  factorEnv = this.settings.factorEnv
  factorApp = this.settings.factorApp
  factorRouter = this.settings.factorRouter
  factorDb = this.settings.factorDb
  factorServer = this.settings.factorServer
  factorUser = this.settings.factorUser
  factorEmail = this.settings.factorEmail
  factorStripe = this.settings.factorStripe
  kaptionCache = this.settings.kaptionCache
  kaptionClickHouse = this.settings.kaptionClickHouse
  factorAws = this.settings.factorAws
  factorAdmin = this.settings.factorAdmin
  kaptionDashboard = this.settings.kaptionDashboard

  constructor(name: string, settings: T & KaptionPluginSettings) {
    super(name, settings)
  }
}

export interface KaptionDataPluginSettings {
  factorEnv: FactorEnv
  factorDb: FactorDb
  kaptionCache: KaptionCache
  kaptionClickHouse: KaptionClickHouse
  factorAws: FactorAws
}

export abstract class KaptionDataPlugin<
  T extends Record<string, unknown> = {},
> extends FactorPlugin<T & KaptionDataPluginSettings> {
  factorEnv = this.settings.factorEnv
  factorDb = this.settings.factorDb
  apiServer = this.settings.apiServer
  kaptionCache = this.settings.kaptionCache
  kaptionClickHouse = this.settings.kaptionClickHouse
  factorAws = this.settings.factorAws
  constructor(name: string, settings: T & KaptionDataPluginSettings) {
    super(name, settings)
  }
}

export type KaptionQueryOptions = {
  cacheQuery?: boolean
  cacheKey?: string
} & Partial<KaptionPluginSettings>

export abstract class KaptionQuery<
  T extends KaptionQueryOptions = KaptionQueryOptions,
> extends Query<T> {
  t = DbTable
  readonly cacheQuery = this.settings.cacheQuery
  readonly cacheKey = this.settings.cacheKey
  factorApp = this.settings.factorApp
  factorRouter = this.settings.factorRouter
  factorDb = this.settings.factorDb
  factorServer = this.settings.factorServer
  factorEmail = this.settings.factorEmail
  factorUser = this.settings.factorUser
  factorStripe = this.settings.factorStripe
  kaptionCache = this.settings.kaptionCache
  kaptionClickHouse = this.settings.kaptionClickHouse
  factorAws = this.settings.factorAws
  factorAdmin = this.settings.factorAdmin
  kaptionDashboard = this.settings.kaptionDashboard

  constructor(settings: T) {
    super(settings)
  }
}
