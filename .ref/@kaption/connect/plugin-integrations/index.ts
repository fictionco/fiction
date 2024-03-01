import type { EndpointResponse } from '@factor/api'
import { Endpoint, base64 } from '@factor/api'
import type { KaptionCache } from '@kaption/core/plugin-cache'
import type {
  KaptionEndpointMap,
  KaptionPluginSettings,
} from '@kaption/core/utils'
import {
  KaptionEndpoint,
  KaptionPlugin,
} from '@kaption/core/utils'
import type express from 'express'
import fs from 'fs-extra'
import type { ProviderKeys } from '../providers'
import { getProvider } from '../providers'
import { QueryIntegrationList, QueryManageIntegrations } from './endpoint'
import { AuthorizationModal } from './modal'
import type { IntegrationRow } from './tables'
import { tbl } from './tables'

/**
 * payload returned from provider
 */
export interface OAuthAccessTokenPayload {
  access_token: string
  refresh_token: string
  token_type: string
  id_token: string
  expires_in: number
  expires_at: string // ISO date
  scope: string
  error: string
  error_description: string
}
/**
 * payload after normalized by DB
 */
export interface OAuthPayload {
  status: 'pending' | 'active' | 'error' | 'disabled'
  statusDescription: string
  accessToken: string
  refreshToken: string
  tokenType: string
  idToken: string
  expiresIn: number
  expiresAt: string // ISO date
  scope: string
  error: string
  errorDescription: string
}

interface OAuthHandlerParams {
  provider?: ProviderKeys
  action?: 'init' | 'callback'
}

interface OAuthHandlerQuery {
  state: string
  [key: string]: string
}

export interface OAuthHandlerDecodedState {
  projectId: string
  organizationId: string
  context: string
  fields?: Record<string, string>
}

type KaptionIntegrationSettingds = {
  kaptionCache: KaptionCache
} & KaptionPluginSettings
export class KaptionIntegrations extends KaptionPlugin<KaptionIntegrationSettingds> {
  kaptionCache = this.settings.kaptionCache
  root = this.utils.safeDirname(import.meta.url)
  queries = this.createQueries()
  requests = this.createRequests<KaptionEndpointMap<typeof this.queries>>({
    queries: this.queries,
    endpointHandler: (opts) => {
      return new KaptionEndpoint({
        ...opts,
        factorAdmin: this.settings.factorAdmin,
      })
    },
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  stateId = this.utils.shortId()

  modal = new AuthorizationModal()
  callbackTemplate = this.factorEnv.isApp.value
    ? ''
    : fs.readFileSync(`${this.root}/callback.html`, 'utf8')

  tbl = 'kaption_connect'

  activeIntegrationsState = this.utils.vue.shallowRef<
    EndpointResponse<IntegrationRow[] | undefined>
  >({
    status: 'loading',
    data: undefined,
  },
  )

  activeIntegrations = this.utils.vue.computed<IntegrationRow[] | undefined>(
    () => {
      return this.activeIntegrationsState?.value.data
    },
  )

  constructor(settings: KaptionIntegrationSettingds) {
    super('integrations', settings)

    this.factorApp?.addUiPaths([`${this.root}/**/*.vue`, `${this.root}/*.ts`])

    this.factorDb.addTables([tbl])

    const oAuthEndpoint = new Endpoint({
      requestHandler: (...r) => this.authEndpointHandler(...r),
      key: 'oAuthEndpoint',
      basePath: '/oauth/:provider/:action',
      serverUrl: this.factorServer.serverUrl.value,
      factorUser: this.factorUser,
      useNaked: true,
    })

    this.factorServer.addEndpoints([oAuthEndpoint])
    this.factorEnv.serverOnlyModules.push(
      { id: 'google-spreadsheet' },
      { id: 'googleapis' },
      { id: 'google-auth-library' },
      { id: 'ngrok' },
      { id: '@slack/bolt' },
    )
  }

  async loadIntegrations(context: string) {
    const req = this.requests.List

    if (!req)
      throw new Error('integrations lib unavailable')

    if (!context)
      throw new Error('no formId')

    const requestPromise = req.projectRequest({
      context,
    })

    this.activeIntegrationsState.value = {
      status: 'loading',
      data: undefined,
      loading: requestPromise,
    }

    const r = await requestPromise

    const loaded = {
      ...r,
      data: r.data,
    }

    this.activeIntegrationsState.value = loaded
  }

  getOAuthUrl(args: {
    provider: string
    action: 'init' | 'callback'
    query?: { state: string }
  }) {
    const { provider, action, query = {} } = args

    const baseUrl = this.factorServer.serverUrl.value
    const url = new URL(`${baseUrl}/oauth/${provider}/${action}`)

    if (query)
      url.search = new URLSearchParams(query).toString()

    return url.toString()
  }

  protected createQueries() {
    const deps = {
      factorEnv: this.factorEnv,
      factorDb: this.factorDb,
      factorUser: this.factorUser,
      kaptionCache: this.kaptionCache,
      kaptionIntegrations: this,
    }
    return {
      List: new QueryIntegrationList(deps),
      Manage: new QueryManageIntegrations(deps),
    } as const
  }

  getCallbackHtml(data: EndpointResponse) {
    return this.callbackTemplate.replace('__DATA__', JSON.stringify(data))
  }

  prepFields(args: {
    fields?: Partial<IntegrationRow>
  }): Partial<IntegrationRow> {
    const { fields } = args
    if (!fields)
      return {}
    if (!this.factorDb)
      throw this.stop('no db')

    const cols = this.factorDb.getColumns(this.tbl)

    const out: Record<string, unknown> = {}

    cols?.forEach((col) => {
      const k = col.key as keyof IntegrationRow
      const value = fields[k]
      if (col.isSetting && value !== undefined) {
        out[k] = col.prepare
          ? col.prepare({ value, key: col.key, db: this.factorDb.client() })
          : value
      }
    })

    return out as Partial<IntegrationRow>
  }

  /**
   * Testable oauth handler written to handle actions in oauth flow
   */
  async oAuthHandler(args: {
    mode: 'init' | 'callback'
    params: OAuthHandlerParams
    query: OAuthHandlerQuery
  }): Promise<string> {
    const { mode, params, query } = args
    /**
     * Use the state query param to track the account information
     * can't pass this in the regular query because oauth provider will strip or error
     */
    const state = query.state as string

    const { provider } = params

    if (!provider || !mode || !state) {
      throw this.stop({
        message: 'Invalid OAuth request',
        data: { provider, mode, state },
      })
    }

    const stateJsonString = base64({
      str: state,
      action: 'decode',
    })

    const { projectId, organizationId, context, fields } = JSON.parse(
      stateJsonString,
    ) as OAuthHandlerDecodedState

    const addedFields = this.prepFields({ fields })

    const integration = getProvider({
      provider,
      projectId,
      organizationId,
      context,
      factorDb: this.factorDb,
      factorEnv: this.factorEnv,
      kaptionIntegrations: this,
    })

    const scope = integration.auth.scope
    const redirectUri = this.getOAuthUrl({
      provider,
      action: 'callback',
    })

    if (mode === 'init') {
      const authorizationUri = integration.auth.getAuthUrl({
        redirectUri,
        scope,
        state,
      })

      this.log.info('Redirecting to OAuth provider', {
        data: { authorizationUri, redirectUri, scope, state },
      })

      return authorizationUri
    }
    else if (mode === 'callback') {
      let responseData: EndpointResponse

      try {
        const tokenUrl = integration.auth.getTokenUrl({
          code: query.code as string,
          redirectUri,
        })
        const result = await fetch(tokenUrl, { method: 'POST' })

        const oAuthPayload
          = (await result.json()) as Partial<OAuthAccessTokenPayload>

        if (oAuthPayload.error) {
          throw this.stop({
            message:
              oAuthPayload.error_description
              || `auth callback error: (${oAuthPayload.error})`,
            code: oAuthPayload.error,
            data: { oAuthPayload, tokenUrl },
          })
        }

        const db = this.factorDb.client()

        const camelOAuthPayload = this.utils.camelKeys({
          status: 'active',
          ...oAuthPayload,
        }) as OAuthAccessTokenPayload

        const allFields: Partial<IntegrationRow> = integration.standardFields({
          projectId,
          organizationId,
          context,
          provider,
          oAuthPayload: camelOAuthPayload,
          ...addedFields,
        })

        const prepped: Omit<Partial<IntegrationRow>, 'oAuthPayload'> & {
          oAuthPayload: string
        } = {
          ...allFields,
          oAuthPayload: JSON.stringify(allFields.oAuthPayload),
        }

        this.log.info('storing token data', { data: prepped })

        const r = await db
          .insert(prepped)
          .into(this.tbl)
          .onConflict(['project_id', 'provider', 'context'])
          .merge()
          .returning<IntegrationRow[]>('*')

        responseData = { status: 'success', data: r?.[0] }
      }
      catch (error) {
        this.log.error('access token error', { error })

        responseData = { status: 'error', data: error }
      }

      return this.getCallbackHtml(responseData)
    }
    else {
      throw this.stop('invalid mode')
    }
  }

  async authEndpointHandler(
    request: express.Request,
    response: express.Response,
  ): Promise<void> {
    const query = request.query as OAuthHandlerQuery
    const params = request.params as {
      provider?: ProviderKeys
      action?: 'init' | 'callback'
    }

    /**
     * Use the state query param to track the account information
     * can't pass this in the regular query because oauth provider will strip or error
     */
    const state = query.state as string

    const { provider, action } = params

    if (!provider || !action || !state) {
      this.log.error('Invalid OAuth request', { provider, action, state })
      response.status(400).send('Invalid request')
      return
    }

    try {
      if (action === 'init') {
        const authorizationUri = await this.oAuthHandler({
          mode: 'init',
          params,
          query,
        })

        // Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
        response.redirect(authorizationUri)
      }
      else if (action === 'callback') {
        const callbackHtml = await this.oAuthHandler({
          mode: 'callback',
          params,
          query,
        })

        response
          .status(200)
          .contentType('text/html')
          .set(
            'Content-Security-Policy',
            'default-src *; style-src \'self\' \'unsafe-inline\'; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'',
          )
          .send(callbackHtml)
          .end()
      }
      else {
        throw this.stop('invalid action')
      }
    }
    catch (error) {
      const e = error as Error
      this.log.error('auth endpoint error', { error })
      response.status(400).send({ status: 'error', message: e.message }).end()
    }
  }
}
