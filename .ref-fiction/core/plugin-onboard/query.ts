import type {
  EndpointMeta,
  EndpointResponse,
  FactorDb,
  FactorUser,
} from '@factor/api'
import {
  Query,
} from '@factor/api'
import type { FictionInstance } from '../plugin-instance'
import type { FictionJobs } from '../plugin-jobs'
import type { FictionModel } from '../plugin-models'

interface QueryOnboardSettings {
  factorUser?: FactorUser
  factorDb: FactorDb
  fictionInstance?: FictionInstance
  fictionModel: FictionModel
  fictionJobs?: FictionJobs
}

export abstract class QueryOnboard extends Query<QueryOnboardSettings> {
  fictionModel = this.settings.fictionModel
  factorUser = this.settings.factorUser
  factorDb = this.settings.factorDb
  fictionInstance = this.settings.fictionInstance
  fictionJobs = this.settings.fictionJobs
  constructor(settings: QueryOnboardSettings) {
    super(settings)
  }
}

export interface OrgCounts {
  countModels: number
  countCollections: number
  countRenders: number
  countStarts: number
  organizationId: string
}
export class QueryGetCounts extends QueryOnboard {
  async run(
    params: {
      organizationId: string
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<OrgCounts>> {
    const { organizationId } = params
    const db = this.factorDb?.client()

    const [resultModel, resultCollection, resultRenders, resultStarts]
      = await Promise.all([
        db
          .count<{ count: string }>('*')
          .from(this.tbl.model)
          .where({ organizationId, status: 'ready' })
          .first(),
        db
          .count<{ count: string }>('*')
          .from(this.tbl.collection)
          .where({ organizationId })
          .first(),
        db
          .count<{ count: string }>('*')
          .from(this.tbl.render)
          .where({ organizationId, status: 'ready' })
          .first(),
        db
          .count<{ count: string }>('*')
          .from(this.tbl.jobs)
          .where({ organizationId, jobType: 'start' })
          .first(),
      ])

    const countModels = +(resultModel?.count || 0)
    const countCollections = +(resultCollection?.count || 0)
    const countRenders = +(resultRenders?.count || 0)
    const countStarts = +(resultStarts?.count || 0)

    return {
      status: 'success',
      data: {
        countModels,
        countCollections,
        countRenders,
        countStarts,
        organizationId,
      },
    }
  }
}
