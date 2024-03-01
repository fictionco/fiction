import type {
  EndpointMeta,
  EndpointResponse,
  FactorDb,
  FactorEnv,
  FactorUser,
} from '@factor/api'
import {
  Query,
} from '@factor/api'
import type { KaptionCache } from '@kaption/core'
import type { ProviderKeys } from '../providers'
import { getProvider } from '../providers'
import type { IntegrationRow } from './tables'
import type { KaptionIntegrations } from '.'

interface IntegrationQuerySettings {
  factorEnv: FactorEnv
  factorUser?: FactorUser
  factorDb: FactorDb
  kaptionCache: KaptionCache
  kaptionIntegrations: KaptionIntegrations
}

export abstract class QueryIntegrations extends Query<IntegrationQuerySettings> {
  factorEnv = this.settings.factorEnv
  factorUser = this.settings.factorUser
  factorDb = this.settings.factorDb
  kaptionCache = this.settings.kaptionCache
  kaptionIntegrations = this.settings.kaptionIntegrations

  tbl = 'kaption_connect'
  constructor(settings: IntegrationQuerySettings) {
    super(settings)
  }
}

interface IntegrationListParams {
  projectId: string
  context: string
}

function removeEmpty(obj: Record<string | number, unknown>) {
  Object.entries(obj).forEach(
    ([key, val]) =>
      (val
      && typeof val === 'object'
      && removeEmpty(val as Record<string | number, unknown>))
      || (val === null && delete obj[key]),
  )
  return obj
}
export class QueryIntegrationList extends QueryIntegrations {
  async run(
    params: IntegrationListParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<IntegrationRow[]>> {
    const { projectId, context } = params
    if (!meta.bearer)
      throw this.stop('login required')
    if (!projectId)
      throw this.stop('projectId required')

    const db = this.factorDb.client()
    const message = ''

    const connections = await db
      .select<IntegrationRow[]>('*')
      .from(this.tbl)
      .where({ projectId, context })
      .orderBy('updatedAt', 'desc')

    const data = connections.map((item) => {
      return removeEmpty(item) as IntegrationRow
    })

    return {
      status: 'success',
      data,
      message,
    }
  }
}

interface ManageParams {
  projectId: string
  organizationId: string
  context: string
  provider: ProviderKeys
  _action: 'oAuthDisconnect' | 'setupIntegration' | 'update' | 'delete'
  connectionState?: Partial<IntegrationRow>
}

export class QueryManageIntegrations extends QueryIntegrations {
  async run(
    params: ManageParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<Partial<IntegrationRow> | undefined>> {
    const { projectId, organizationId, context, _action, provider } = params
    if (!meta.bearer)
      throw this.stop('login required')
    if (!projectId)
      throw this.stop('projectId required')

    const db = this.factorDb.client()

    let message: string | undefined
    let data: Partial<IntegrationRow> | undefined

    if (_action === 'delete') {
      const r = await db
        .delete()
        .from(this.tbl)
        .where({ projectId, context, provider })
        .limit(1)
        .returning<IntegrationRow[]>('*')

      data = r[0]
      message = 'integration deleted'
    }
    else if (_action === 'update') {
      const { connectionState } = params
      const saveFields = this.kaptionIntegrations.prepFields({
        fields: connectionState,
      })
      const r = await db
        .update(saveFields)
        .from(this.tbl)
        .where({ projectId, context, provider })
        .returning<IntegrationRow[]>('*')

      data = r[0]
      message = 'integration updated'
    }
    else if (_action === 'oAuthDisconnect') {
      const r = await db
        .update({ oAuthPayload: null })
        .from(this.tbl)
        .where({ projectId, context, provider })
        .returning<IntegrationRow[]>('*')

      data = r[0]
      message = 'successfully disconnected'
    }
    else if (_action === 'setupIntegration') {
      const { connectionState } = params
      const connection = getProvider({
        provider,
        projectId,
        organizationId,
        context,
        factorDb: this.factorDb,
        factorEnv: this.factorEnv,
        kaptionIntegrations: this.kaptionIntegrations,
        connectionState,
      })

      try {
        /**
         * Update connectionState with whatever is stored in the database
         * and merge (everything won't always be passed as a param)
         */
        const storedState = await connection.storedConnectionState()

        const fields = { ...storedState, ...connectionState }

        connection.connectionState.value = fields

        const activateResponse = await connection.activate()

        const saveFields = this.kaptionIntegrations.prepFields({
          fields: activateResponse,
        })

        saveFields.status = 'active'

        const r = await db
          .update(saveFields)
          .from(this.tbl)
          .where({ projectId, context, provider })
          .returning<IntegrationRow[]>('*')

        data = r[0]
        message = 'success!'
      }
      catch (error) {
        const err = error as Error
        return { status: 'error', message: err.message }
      }
    }
    else {
      return { status: 'error', message: 'invalid action' }
    }

    return { status: 'success', message, data, params }
  }
}
