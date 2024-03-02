import type {
  DataFilter,
  EndpointMeta,
  EndpointResponse,
  FactorDb,
  FactorUser,
  IndexMeta,
} from '@factor/api'
import {
  Query,
} from '@factor/api'
import type { TableJobConfig } from '../tables'

interface UsageQuerySettings {
  factorUser?: FactorUser
  factorDb: FactorDb
}

export abstract class QueryJobs extends Query<UsageQuerySettings> {
  factorUser = this.settings.factorUser
  factorDb = this.settings.factorDb
  constructor(settings: UsageQuerySettings) {
    super(settings)
  }
}

interface ManageJobsParams {
  _action: 'create' | 'delete' | 'update'
  jobConfig: Partial<TableJobConfig>
}
export class QueryManageJobs extends QueryJobs {
  async run(
    params: ManageJobsParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TableJobConfig>> {
    const { _action, jobConfig } = params
    const { organizationId } = jobConfig

    if (!_action)
      throw this.stop('QueryManageJobs -_action required')
    if (!_action)
      throw this.stop('QueryManageJobs - organizationId required')

    const db = this.factorDb.client()

    let jobEntry: TableJobConfig | undefined
    let message: string | undefined

    if (_action === 'create') {
      const { organizationId, jobType, userId, isQueued, progressId }
        = jobConfig
      const nowIso = this.utils.dayjs().toISOString()
      const formattedData: Partial<TableJobConfig> = {
        jobId: this.utils.objectId(),
        title: `${jobType} job`,
        message: 'waiting to be processed',
        requestedAt: nowIso,
        progressId: jobConfig.jobType,
        status: 'requested',
        organizationId,
        userId,
        ...jobConfig,
      }

      const insertFields = this.utils.prepareFields({
        type: 'internal',
        fields: formattedData,
        meta,
        table: this.tbl.jobs,
        factorDb: this.factorDb,
      })

      if (jobType === 'render' && !insertFields.renderId) {
        throw this.stop({
          message: 'no renderId',
          data: { jobConfig, insertFields },
        })
      }
      else if (jobType === 'train' && !insertFields.modelId) {
        throw this.stop('no modelId')
      }
      else if (jobType === 'start' && !insertFields.instanceId) {
        throw this.stop('no instanceId')
      }

      const final = this.utils.snakeCaseKeys(insertFields)

      /**
       * Make sure not queuing same thing twice
       */
      if (isQueued) {
        const r = await db.select('*').from(this.tbl.jobs).where({
          organizationId,
          isQueued: true,
          status: 'requested',
          progressId,
        })

        if (r.length) {
          return {
            status: 'error',
            message: 'job already queued',
          }
        }
      }

      this.log.info('adding job fields', { data: final })
      ;[jobEntry] = await db
        .insert(final)
        .table(this.tbl.jobs)
        .returning<TableJobConfig[]>('*')
      message = 'job added'
    }
    else if (_action === 'update') {
      const { organizationId, jobId } = jobConfig
      if (!jobId)
        throw this.stop('jobId required')

      // don't persist percent
      delete jobConfig.percent

      const insertFields = this.utils.prepareFields({
        type: 'internal',
        fields: jobConfig,
        meta,
        table: this.tbl.jobs,
        factorDb: this.factorDb,
      })
      const q = db
        .update(this.utils.snakeCaseKeys(insertFields))
        .where({ organizationId, jobId })
        .table(this.tbl.jobs)
        .returning<TableJobConfig[]>('*')

      ;[jobEntry] = await q

      message = 'job updated'
    }
    else if (_action === 'delete') {
      const { jobId } = jobConfig
      ;[jobEntry] = await db
        .from(this.tbl.jobs)
        .where({ organizationId, jobId })
        .delete()
        .returning<TableJobConfig[]>('*')

      message = 'job deleted'
    }

    return {
      status: 'success',
      data: this.utils.camelKeys(jobEntry),
      message,
      params,
    }
  }
}

type ListJobsParams = {
  organizationId?: string
  _action?: 'list' | 'delete'
  selectedIds?: string[]
  filters: DataFilter[]
} & IndexMeta

export class QueryListJobs extends QueryJobs {
  async run(
    params: ListJobsParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TableJobConfig[]>> {
    const {
      organizationId,
      _action = 'list',
      limit = 20,
      offset = 0,
      selectedIds = [],
      filters = [],
      orderBy = 'requestedAt',
      order = 'desc',
    } = params

    if (!organizationId && !meta.server)
      throw this.stop('ListJobs: organizationId required')

    const db = this.factorDb.client()
    let message = ''

    if (_action === 'delete' && selectedIds.length) {
      const num = await db
        .delete()
        .table(this.tbl.jobs)
        .whereIn('job_id', selectedIds)

      message = `${num} deleted`
    }

    const eightHoursAgo = this.utils.dayjs().subtract(8, 'hour').toDate()

    let base = db
      .select('*')
      .from(this.tbl.jobs)
      .whereBetween('requested_at', [eightHoursAgo, new Date()])

    let countBase = db.count<{ count: string }>('*').from(this.tbl.jobs).first()

    if (organizationId) {
      base = base.where({ organizationId })
      countBase = countBase.where({ organizationId })
    }

    if (filters.length) {
      filters.forEach((filter) => {
        const { field, operator, value } = filter
        if (field && operator && value) {
          base = base.where(field, operator, value)
          countBase = countBase.where(field, operator, value)
        }
      })
    }

    const jobsList = await base
      .limit(limit)
      .offset(offset)
      .orderBy(orderBy, order)

    const jobsListCount = await countBase

    const count = +(jobsListCount?.count || 0)

    return {
      status: 'success',
      data: this.utils.camelKeys(jobsList),
      indexMeta: { count, limit, offset },
      message,
    }
  }
}
