import type { EndpointMeta, EndpointResponse, PrivateUser } from '@factor/api'

import type { ItemStatus, Project } from '@factor/api/plugin-admin'
import type { KaptionQueryOptions } from '../utils'
import { KaptionQuery } from '../utils'
import type { KaptionTracking } from '.'

export type TrackingQueryOptions = {
  kaptionTracking: KaptionTracking
} & KaptionQueryOptions

abstract class TrackingQuery extends KaptionQuery<TrackingQueryOptions> {
  kaptionTracking = this.settings.kaptionTracking
  constructor(settings: TrackingQueryOptions) {
    super(settings)
  }
}

export class QueryCurrentTrackingStatus extends TrackingQuery {
  async run(
    params: {
      projectId: string
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<ItemStatus>> {
    const ch = this.kaptionClickHouse
    if (!ch)
      throw new Error('kaptionClickHouse missing')
    const { projectId } = params
    const inputs = { projectId, tableName: 'event' } as const

    let status: ItemStatus

    // check for any events in the last month
    const clickhouseTimeEndAt = this.utils
      .dayjs()
      .add(1, 'day')
      .utc()
      .format('YYYYMMDDHHmmss')
    const clickhouseTimeStartAt = this.utils
      .dayjs()
      .subtract(1, 'month')
      .utc()
      .format('YYYYMMDDHHmmss')

    const q = ch
      .clickhouseBaseQuery(inputs)
      .select('sessionId')
      .whereRaw(
        `toYYYYMMDDhhmmss(timestamp) BETWEEN ${clickhouseTimeStartAt} AND ${clickhouseTimeEndAt}`,
      )

    const { data: r } = await ch.clickHouseSelect<string[]>(q)

    if (r && r.length > 0)
      status = 'active'
    else
      status = 'pending'

    return { status: 'success', data: status }
  }
}

export class QueryManageTracking extends TrackingQuery {
  async run(
    params: { projectId?: string, _action: 'refresh' },
    meta: EndpointMeta,
  ): Promise<
    EndpointResponse<Project> & {
      user?: PrivateUser
      projectId?: string
    }
  > {
    if (!this.factorAdmin)
      throw new Error('no admin service')
    if (!this.factorUser)
      throw new Error('no user service')
    if (!params.projectId)
      throw this.stop('projectId required')
    if (!meta.bearer && !meta.server)
      throw this.stop('login required')

    const { projectId } = params

    const findProject = this.factorAdmin.queries.FindOneProject

    let { data: project } = await findProject.serve({ projectId }, meta)

    if (!project)
      throw this.stop(`projectId not found: ${projectId}`)

    const currentTrackingStatus = project?.trackingStatus || 'unknown'
    let newStatus: ItemStatus = 'unknown'

    let message = ''

    const getStatus = this.kaptionTracking.queries.CurrentTrackingStatus
    const r = await getStatus.serve({ projectId }, { server: true })

    if (r.status === 'success')
      newStatus = r.data ?? 'unknown'

    // refresh user
    let user: PrivateUser | undefined

    if (currentTrackingStatus !== newStatus) {
      if (r.data === 'active') {
        this.log.info(`tracking activated: ${projectId}`)

        message = 'tracking is active'
      }

      const r2 = await this.factorAdmin.queries.ManageProject.serve(
        {
          _action: 'updateAny',
          projectId,
          project: { trackingStatus: newStatus },
        },
        { ...meta, server: true },
      )

      if (r2.status === 'success')
        project = r2.data

      if (meta.bearer?.userId) {
        const { data: privateUser }
          = await this.factorUser.queries.ManageUser.serve(
            {
              _action: 'getPrivate',
              userId: meta.bearer.userId,
            },
            meta,
          )
        user = privateUser
      }
    }

    return { status: 'success', data: project, user, message }
  }
}
