import type {
  EndpointResponse,
  FactorDb,
  FactorEnv,
} from '@factor/api'
import {
  FactorObject,
  notify,
} from '@factor/api'
import { InputOption } from '@kaption/core/utils/inputOption'
import OptionOAuth from './plugin-integrations/OptionOAuth.vue'
import type {
  KaptionIntegrations,
  OAuthHandlerDecodedState,
} from './plugin-integrations'
import type { IntegrationRow } from './plugin-integrations/tables'
import type { ProviderKeys } from './providers'

interface AuthConfig {
  authorizationUrl: string
  tokenUrl: string
  authType: 'oauth2' | 'basic' | 'apiKey'
  scope?: string
  clientId?: string
  clientSecret?: string
}

export class AuthHandler extends FactorObject<AuthConfig> {
  clientId = this.settings.clientId
  clientSecret = this.settings.clientSecret
  authorizationUrl = new URL(this.settings.authorizationUrl)
  tokenUrl = new URL(this.settings.tokenUrl)
  authType = this.settings.authType
  scope = this.settings.scope || ''
  authorizeOrigin = this.authorizationUrl.origin
  authorizePath = `${this.authorizationUrl.pathname}${this.authorizationUrl.search}`
  tokenOrigin = this.tokenUrl.origin
  tokenPath = `${this.tokenUrl.pathname}${this.tokenUrl.search}`
  constructor(settings: AuthConfig) {
    super('authHandler', settings)
  }

  getAuthUrl(args: { redirectUri: string, scope: string, state: string }) {
    const search = new URLSearchParams(this.authorizationUrl.search)

    search.set('redirect_uri', args.redirectUri)
    search.set('scope', args.scope)
    search.set('state', args.state)
    search.set('client_id', this.clientId ?? '')

    this.authorizationUrl.search = search.toString()

    return this.authorizationUrl.toString()
  }

  getTokenUrl(args: { redirectUri: string, code: string }) {
    const search = new URLSearchParams(this.tokenUrl.search)

    search.set('redirect_uri', args.redirectUri)
    search.set('code', args.code)
    search.set('client_id', this.clientId ?? '')
    search.set('client_secret', this.clientSecret ?? '')

    this.tokenUrl.search = search.toString()

    return this.tokenUrl.toString()
  }
}

interface RestRequestConfig {
  baseUrl: string
  headers: Record<string, string>
}

export class RestRequestHandler extends FactorObject<RestRequestConfig> {
  baseUrl = this.settings.baseUrl
  headers = this.settings.headers
  constructor(settings: RestRequestConfig) {
    super('restRequest', settings)
  }
}

export type IntegrationMode =
  | 'table'
  | 'notification'
  | 'contact'
  | 'event'
  | 'schedule'
  | 'payment'

export interface IntegrationClientDetail {
  factorDb: FactorDb
  factorEnv: FactorEnv
  kaptionIntegrations: KaptionIntegrations
  projectId: string
  organizationId: string
  context: string
  connectionState?: Partial<IntegrationRow>
  fields?: Record<string, string>
}

export type ConnectionState = Partial<IntegrationRow> & {
  [key: string]: unknown
}

export abstract class KaptionConnection extends FactorObject<IntegrationClientDetail> {
  abstract key: ProviderKeys
  abstract name: string
  abstract description: string
  logo?: string
  icon?: string

  abstract auth: AuthHandler
  abstract supports: IntegrationMode[]

  factorDb = this.settings.factorDb
  factorEnv = this.settings.factorEnv
  kaptionIntegrations = this.settings.kaptionIntegrations

  clientId?: string
  clientSecret?: string

  tbl = 'kaption_connect'

  projectId = this.settings.projectId
  organizationId = this.settings.organizationId
  context = this.settings.context
  fields = this.settings.fields || {}

  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}

  connectionState = this.utils.vue.ref<ConnectionState>(
    this.settings.connectionState || {},
  )

  constructor(name: string, settings: IntegrationClientDetail) {
    super(name, settings)
  }

  connectStatus = this.utils.vue.computed<'active' | 'inactive'>(() => {
    return this.connectionState.value ? 'active' : 'inactive'
  })

  async storedConnectionState(): Promise<Partial<IntegrationRow> | undefined> {
    const db = this.factorDb.client()
    const r = await db
      .select('*')
      .from(this.tbl)
      .where({
        projectId: this.projectId,
        provider: this.key,
        context: this.context,
      })
      .first()

    const out: ConnectionState | undefined = r

    return out
  }

  async oAuthDisconnect() {
    return await this.kaptionIntegrations.requests.Manage.projectRequest({
      _action: 'oAuthDisconnect',
      provider: this.key,
      context: this.context,
    })
  }

  async oAuthConnect(args: {
    onFinished: (
      r:
        | EndpointResponse<Error, 'error'>
        | EndpointResponse<IntegrationRow, 'success'>,
    ) => void
  }): Promise<void> {
    const { onFinished } = args
    const projectId = this.projectId
    const organizationId = this.organizationId
    const context = this.context

    if (!projectId || !organizationId)
      throw new Error('no projectId active')
    if (!context)
      throw new Error('no context')

    const stateObj: OAuthHandlerDecodedState = {
      projectId,
      organizationId,
      context,
      fields: this.fields,
    }

    const state = this.utils.base64({
      str: JSON.stringify(stateObj),
      action: 'encode',
    })

    const url = this.kaptionIntegrations.getOAuthUrl({
      action: 'init',
      provider: this.key,
      query: { state },
    })

    this.kaptionIntegrations.modal.open({ url })

    this.kaptionIntegrations.modal.onSuccess((r) => {
      notify.success('connection succeeded!')
      this.connectionState.value = r.data || {}
      return onFinished(r)
    })
    this.kaptionIntegrations.modal.onFailure((r) => {
      notify.error('connection failed')
      return onFinished(r)
    })
  }

  refineIntegration() {}

  opts = this.utils.vue.computed<InputOption<keyof IntegrationRow | string>[]>(
    () => {
      return []
    },
  )

  hasRequiredDetails = this.utils.vue.computed(() => {
    return false
  })

  requestChangeStatus = async (status: 'active' | 'disabled') => {
    const r = await this.kaptionIntegrations.requests.Manage.projectRequest({
      _action: 'update',
      provider: this.key,
      context: this.context,
      connectionState: { status },
    })

    if (r.status === 'success' && r.data)
      this.connectionState.value = r.data

    return r
  }

  requestDelete = async () => {
    const r = await this.kaptionIntegrations.requests.Manage.projectRequest({
      _action: 'delete',
      provider: this.key,
      context: this.context,
    })

    if (r.status === 'success')
      this.connectionState.value = {}

    return r
  }

  requestActivate = async () => {
    const r = await this.kaptionIntegrations.requests.Manage.projectRequest({
      _action: 'setupIntegration',
      provider: this.key,
      context: this.context,
      connectionState: this.connectionState.value,
    })

    if (r.status === 'success' && r.data)
      this.connectionState.value = r.data

    return r
  }

  getOAuthOption(): InputOption<keyof IntegrationRow> {
    return new InputOption({
      label: 'Connect Service',
      description: `Give Kaption permission to work with ${this.utils.toLabel(
        this.key,
      )}`,
      optionKey: 'oAuthPayload',
      input: OptionOAuth,
      category: 'handling',
      props: this.utils.vue.computed(() => {
        return {
          connection: this,
        }
      }),
    })
  }

  abstract activate(): Promise<Partial<IntegrationRow>>

  standardFields(_: Partial<IntegrationRow>): Partial<IntegrationRow> {
    return _
  }
}
