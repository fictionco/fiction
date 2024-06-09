import type { Knex } from 'knex'
import type {
  EndpointMeta,
  EndpointResponse,
  FactorDb,
  FactorUser,
  User,
} from '@factor/api'
import {
  Query,
  shortId,
} from '@factor/api'

import type { PortableWidget } from './widget'
import type { DashboardSettings } from '.'

export type CustomDashboardParams =
  | {
    _action: 'create'
    dashboardName: string
    dashboardId?: string
    layout?: PortableWidget[]
  }
  | {
    _action: 'update'
    dashboardId: string
    dashboardName?: string
    layout?: PortableWidget[]
  }
  | { _action: 'delete', dashboardId: string }
  | { _action: 'retrieve', dashboardId: string }

export type ManageDashboardReturn = EndpointResponse<DashboardSettings> & {
  user?: User
  organizationId?: string
}

interface QuerySettings { factorUser: FactorUser, factorDb: FactorDb }

export abstract class QueryDashboard extends Query<QuerySettings> {
  factorUser = this.settings.factorUser
  factorDb = this.settings.factorDb
  constructor(settings: QuerySettings) {
    super(settings)
  }
}

export class QueryManageCustomDashboard extends QueryDashboard {
  async run(
    params: { organizationId: string } & CustomDashboardParams,
    meta: EndpointMeta,
  ): Promise<ManageDashboardReturn> {
    const { _action, organizationId } = params

    if (!params._action)
      throw this.stop('_action required')
    if (!params.organizationId)
      throw this.stop('organizationId required')

    const db = this.factorDb.client()

    let dashboardId: string | undefined
    let dashboard: DashboardSettings | undefined
    let message: string | undefined
    let setter: Knex.Raw | undefined

    const field = 'dashboards'

    if (_action === 'create' || _action === 'update') {
      const { dashboardName, layout } = params
      dashboardId = params.dashboardId

      let creationFields = {}

      if (_action === 'create') {
        // Id should not have underscores as they will be camelCased by postgres plugin
        dashboardId = dashboardId || `dash${shortId()}`

        creationFields = { createdAt: +Date.now(), dashboardType: 'user' }

        if (!dashboardName)
          throw this.stop('dashboardName is required')
      }

      if (!dashboardId)
        throw this.stop('dashboardId is required')

      const customDashboard: Partial<DashboardSettings> = {
        dashboardId,
        dashboardName,
        updatedAt: +Date.now(),
        ...creationFields,
      }

      if (layout)
        customDashboard.layout = layout

      const mergeString = JSON.stringify({ [dashboardId]: customDashboard })

      setter = db.raw(
        `jsonb_merge_patch(${field}::jsonb, ?::jsonb)`,
        mergeString,
      )

      message = _action === 'create' ? 'dashboard created' : 'dashboard updated'
    }
    else if (_action === 'delete') {
      dashboardId = params.dashboardId
      if (!dashboardId)
        throw this.stop('dashboardId is required')
      setter = db.raw(`coalesce(${field}::jsonb, '{}'::jsonb) - ?`, dashboardId)
      message = 'dashboard cleared'
    }
    else if (_action === 'retrieve') {
      dashboardId = params.dashboardId
      if (!dashboardId)
        throw this.stop('dashboardId is required')

      const q = db
        .table(this.tbl.org)
        .select(db.raw(`${field}->? AS dashboard`, dashboardId))
        .where({ organizationId })
        .first<{ dashboard: DashboardSettings }>()

      const r = await q

      dashboard = r.dashboard
    }

    if (setter) {
      const r = await db
        .table(this.tbl.org)
        .update({
          dashboards: setter,
        })
        .where({ organizationId })
        .returning<{ dashboards: Record<string, DashboardSettings> }[]>(
          'dashboards',
        )

      if (dashboardId)
        dashboard = r[0].dashboards[dashboardId] || { dashboardId }
    }

    // refresh user
    let user: User | undefined

    if (_action !== 'retrieve' && meta.bearer?.userId) {
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

    return { status: 'success', data: dashboard, user, message }
  }
}
