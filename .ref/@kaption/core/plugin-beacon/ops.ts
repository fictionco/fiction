import type { EndpointResponse, HookType } from '@factor/api'
import nodeCron from 'node-cron'
import type { FactorAdmin, ProjectContext } from '@factor/api/plugin-admin'
import type { KaptionPluginSettings } from '../utils'
import { KaptionPlugin } from '../utils'
import type { KaptionCache } from '../plugin-cache'
import type { SessionEvent } from './tables'
import { getEventOpsTables } from './opsTables'

export interface EventOpsHookDictionary {
  hour: { args: [UsageData] }
  day: { args: [UsageData] }
  month: { args: [UsageData] }
  total: { args: [UsageData] }
  quarterHour: { args: [UsageData] }
  eventBatch: {
    args: [{ event: string, events: SessionEvent[], context: ProjectContext }]
  }
}

export type EventOpsSettings = {
  hooks?: HookType<EventOpsHookDictionary>[]
  factorAdmin: FactorAdmin
  kaptionCache: KaptionCache
  cron?: { day: string, hour: string, month: string, quarterHour: string }
} & KaptionPluginSettings

export interface UsageData {
  quarterHour?: Record<string, number>
  hour?: Record<string, number>
  day?: Record<string, number>
  month?: Record<string, number>
  total?: Record<string, number>
  projectId?: string
  organizationId?: string
  customerId?: string
  customerIdTest?: string
  period?: UsagePeriod
}

interface UsageRecord {
  projectId: string
  organizationId: string
  period: UsagePeriod
  [key: string]: unknown
}

type UsagePeriod = 'day' | 'month' | 'hour' | 'quarterHour'

export class KaptionEventOps extends KaptionPlugin<EventOpsSettings> {
  kaptionCache = this.settings.kaptionCache
  factorAdmin = this.settings.factorAdmin
  hooks = this.settings.hooks || []
  tbl = 'kaption_usage'
  cron = this.settings.cron || {
    day: '0 0 * * *',
    hour: '15 * * * *',
    month: '0 1 1 * *',
    quarterHour: '*/15 * * * *',
  }

  periods = ['quarterHour', 'hour', 'day', 'month'] as const
  constructor(settings: EventOpsSettings) {
    super('eventOps', settings)

    this.factorDb.addTables(getEventOpsTables())
  }

  setup() {}

  addHook(hook: HookType<EventOpsHookDictionary>) {
    this.hooks.push(hook)
  }

  /**
   * high speed (cached) project context by id
   */
  cachedProjectContext = async (args: {
    _action: 'get' | 'bust'
    projectId: string
  }): Promise<ProjectContext | undefined> => {
    const { _action, projectId } = args
    if (!this.factorDb)
      throw new Error('Missing factorDb')
    if (!this.kaptionCache)
      throw new Error('Missing kaptionCache')
    try {
      const projectCacheKey = this.kaptionCache.redisKey(
        'project',
        projectId,
        'context',
      )
      const cache = this.kaptionCache.getCache()

      if (!cache)
        throw new Error('missing cache')

      if (_action === 'get') {
        const cachedProject = await cache?.get(projectCacheKey)

        if (cachedProject)
          return JSON.parse(cachedProject) as ProjectContext
      }
      else if (_action === 'bust') {
        await cache?.del(projectCacheKey)
      }

      const projectResponse
        = await this.factorAdmin.queries.FindOneProject.serve(
          { projectId },
          { server: true },
        )

      const project = projectResponse?.data

      if (!project)
        return

      const organizationResponse
        = await this.factorAdmin.queries.FindOneOrganization.serve(
          { organizationId: project.organizationId },
          { server: true },
        )

      const organization = organizationResponse.data

      if (!organization)
        return

      const context = { project, organization }

      // cache for 24 hour
      await cache.set(
        projectCacheKey,
        JSON.stringify(context),
        'EX',
        60 * 60 * 24,
      )

      return context
    }
    catch (error: unknown) {
      this.log.error('projectCache', { error, data: { projectId } })
    }
  }

  async getProject(projectId: string) {
    if (!this.factorAdmin)
      throw new Error('no admin')

    return this.cachedProjectContext({
      projectId,
      _action: 'get',
    })
  }

  async getUsage(args: {
    organizationId: string
    projectId: string
    key: string
  }): Promise<{ [K in UsagePeriod]: number }> {
    const { projectId, organizationId, key } = args
    const usage = await this.currentUsage({
      organizationId,
      projectId,
      _action: 'get',
    })

    const out: Record<string, number> = {}

    this.periods.forEach((period) => {
      out[period] = usage[period]?.[key] || 0
    })

    return out as { [K in UsagePeriod]: number }
  }

  async usageAtKey(args: {
    key: string
    _action: 'get' | 'set'
    usage?: UsageData
  }) {
    const cache = this.kaptionCache.getCache()
    if (!cache)
      throw new Error('no cache')

    const { key, _action } = args

    if (_action === 'get') {
      const v = await cache.get(key)

      const usage = v ? (JSON.parse(v) as UsageData) : undefined

      return usage
    }
    else if (_action === 'set') {
      const { usage } = args

      await cache.set(key, JSON.stringify(usage))
    }
  }

  async getUsageContext(
    projectId: string,
  ): Promise<ProjectContext & { usage: UsageData }> {
    const cxt = await this.getProject(projectId)

    if (!cxt)
      throw new Error(`no project context for ${projectId}`)

    const cacheKey = this.kaptionCache.redisKey(
      'org',
      cxt.organization.organizationId,
      'usage',
    )

    const usage = await this.usageAtKey({ key: cacheKey, _action: 'get' })

    return {
      ...cxt,
      usage: usage || {
        projectId: cxt.project.projectId,
        organizationId: cxt.organization.organizationId,
      },
    }
  }

  prepFields(args: {
    period: UsagePeriod
    usage?: UsageData
  }): UsageData | undefined {
    const { usage, period } = args
    if (!this.factorDb)
      throw this.stop('no db')
    if (!usage)
      return
    if (!usage.projectId || !usage.organizationId)
      throw this.stop('no projectId or organizationId')

    const db = this.factorDb.client()

    const cols = this.factorDb.getColumns(this.tbl)

    const periodUsage = usage[period] || {}

    const out: UsageRecord = {
      projectId: usage.projectId,
      organizationId: usage.organizationId,
      period,
    }
    cols?.forEach(({ key, prepare }) => {
      const value = periodUsage[key]
      const v = prepare ? prepare({ value, key, db }) : value
      if (v !== undefined)
        out[key] = v
    })

    return out as UsageData
  }

  async saveUsage(period: UsagePeriod, usage: UsageData) {
    if (!this.factorDb)
      throw this.stop('no db')
    const db = this.factorDb.client()
    const preppedUsage = this.prepFields({ period, usage })

    await db.insert(preppedUsage).into(this.tbl)
  }

  async runPeriod(period: 'hour' | 'day' | 'month' | 'quarterHour') {
    const cache = this.kaptionCache.getCache()
    const keys = await cache?.keys(`org:*:usage`)
    if (!keys)
      return

    this.log.info(`running ${period} job on ${keys.length} keys`)

    const promises = keys.map(async (key) => {
      let usage = await this.usageAtKey({ key, _action: 'get' })

      if (!usage)
        return

      usage = await this.utils.runHooks({
        hook: period,
        list: this.hooks,
        args: [usage],
      })

      await this.saveUsage(period, usage)

      delete usage[period]

      await this.usageAtKey({ key, _action: 'set', usage })
    })

    await Promise.all(promises)
  }

  runJobs() {
    // daily
    nodeCron.schedule(this.cron.day, async () => {
      await this.runPeriod('day')
    })
    // hourly
    nodeCron.schedule(this.cron.hour, async () => {
      await this.runPeriod('hour')
    })
    // monthly
    nodeCron.schedule(this.cron.month, async () => {
      await this.runPeriod('month')
    })
    // quarterHour
    nodeCron.schedule(this.cron.quarterHour, async () => {
      await this.runPeriod('quarterHour')
    })
  }

  async currentUsage(
    args: {
      organizationId: string
      projectId: string
    } & ({ _action: 'get' } | { _action: 'set', usage: UsageData }),
  ): Promise<UsageData> {
    const { organizationId, projectId, _action } = args

    const cacheKey = this.kaptionCache.redisKey('org', organizationId, 'usage')

    let returnUsage: UsageData | undefined
    if (_action === 'set') {
      returnUsage = { organizationId, projectId, ...args.usage }
      await this.usageAtKey({
        key: cacheKey,
        _action: 'set',
        usage: returnUsage,
      })
    }
    else {
      returnUsage = await this.usageAtKey({
        key: cacheKey,
        _action: 'get',
      })
    }

    return { organizationId, projectId, ...returnUsage }
  }

  async trackUsage(args: {
    projectId: string
    organizationId: string
    customerId?: string
    customerIdTest?: string
    key: string
    amount: number
    limit?: { [K in UsagePeriod]?: number }
  }): Promise<EndpointResponse<{ [K in UsagePeriod]: number }>> {
    const { projectId, organizationId, key, amount, limit = {} } = args
    const usage = await this.currentUsage({
      organizationId,
      projectId,
      _action: 'get',
    })
    let status: 'success' | 'error' = 'success'
    const data: Record<string, number> = {}
    let message = ''
    this.periods.forEach((period) => {
      const periodLimit = limit[period]
      const existing = usage[period] || {}
      const existingAmount = usage[period]?.[key] || 0
      const newAmount = existingAmount + amount

      if (periodLimit && newAmount > periodLimit) {
        status = 'error'
        message = `limit of ${periodLimit} exceeded for ${period} (adding ${amount} to ${existingAmount})`
      }
      else {
        usage[period] = {
          ...existing,
          [key]: newAmount,
        }

        data[period] = newAmount
      }
    })

    await this.currentUsage({
      organizationId,
      projectId,
      _action: 'set',
      usage,
    })

    return { status, message, data: data as { [K in UsagePeriod]: number } }
  }

  async processEvents(allEvents: SessionEvent[]) {
    const eventsByProject = this.utils.groupBy<Record<string, SessionEvent[]>>(
      allEvents,
      'projectId',
    )
    const promises = Object.entries(eventsByProject).map(
      async ([projectId, projectEvents]) => {
        const context = await this.getProject(projectId)
        const organizationId = context?.project.organizationId
        if (!organizationId) {
          this.log.error(`no organization for projectId: ${projectId}`, {
            data: allEvents,
          })
          return
        }

        const groupedEvents = this.utils.groupBy<
          Record<string, SessionEvent[]>
        >(projectEvents, 'event')

        const promises = Object.entries(groupedEvents).map(
          async ([event, events]) => {
            await this.utils.runHooks({
              hook: 'eventBatch',
              list: this.hooks,
              args: [{ event, events, context }],
            })

            await this.trackUsage({
              projectId,
              organizationId,
              key: event,
              amount: events.length,
            })
          },
        )

        await this.trackUsage({
          projectId,
          organizationId,
          key: 'total',
          amount: projectEvents.length,
        })

        await Promise.all(promises)
      },
    )

    await Promise.all(promises)
  }
}
