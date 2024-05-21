import { standardTable } from '../tbl'
import type { EndpointResponse } from '../types'
import type { EndpointMeta } from '../utils'
import { UserQuery } from './endpointOrg'
import type { OnboardStoredSettings, Organization } from '.'

type OnboardParams = {
  _action: 'update'
  settings: OnboardStoredSettings
  orgId?: string
  userId?: string
  mode: 'org' | 'user'
}
export class QueryManageOnboard extends UserQuery {
  async run(params: OnboardParams, meta: EndpointMeta): Promise<EndpointResponse<OnboardStoredSettings>> {
    const { settings, orgId, userId, mode } = params
    const db = this.fictionDb?.client()
    if (!db)
      throw new Error('db missing')
    if (!settings)
      throw new Error('settings missing')

    const columnKey = 'onboard'
    const newSettings = JSON.stringify(settings)

    const tbl = mode === 'org' ? standardTable.org : standardTable.user
    const where = mode === 'org' ? { orgId } : { userId }

    const setter = db.raw(
      `jsonb_merge_patch(${columnKey}::jsonb, ?::jsonb)`,
      [newSettings],
    )

    if (!orgId && !userId)
      throw new Error('orgId or userId required')

    const r = await db
      .table(tbl)
      .update({ onboard: setter })
      .where(where)
      .returning<Organization[]>('*')

    const item = r[0]

    const user = await this.returnUser(meta)

    return { status: 'success', data: item?.onboard, user }
  }
}
