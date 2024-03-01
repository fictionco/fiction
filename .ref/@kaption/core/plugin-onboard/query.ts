import type { EndpointMeta, EndpointResponse } from '@factor/api'
import type { Knex } from 'knex'
import type { KaptionQueryOptions } from '../utils'
import { KaptionQuery } from '../utils'
import type { OnboardStoredSettings, ProjectWithOnboard } from './schema'

export type OnboardQueryOptions = {} & KaptionQueryOptions

abstract class OnboardQuery extends KaptionQuery<OnboardQueryOptions> {
  constructor(settings: OnboardQueryOptions) {
    super(settings)
  }
}

export class QueryManageOnboard extends OnboardQuery {
  async run(
    params: {
      _action: 'save'
      settings: OnboardStoredSettings
      projectId: string
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<OnboardStoredSettings>> {
    const { settings, projectId } = params
    const db = this.factorDb?.client()
    if (!db)
      throw new Error('db missing')
    if (!settings)
      throw new Error('settings missing')

    let setter: Knex.Raw | undefined

    const columnKey = 'onboard'
    const newSettings = JSON.stringify(settings)

    setter = db.raw(
      `jsonb_strip_nulls(COALESCE(${columnKey}::jsonb||'${newSettings}'::jsonb, ${columnKey}::jsonb, '${newSettings}'::jsonb))`,
    )

    const r = await db
      .table(this.t.Project)
      .update({
        onboard: setter,
      })
      .where({ projectId })
      .returning<ProjectWithOnboard[]>('*')

    const project = r[0]

    return { status: 'success', data: project?.onboard }
  }
}
