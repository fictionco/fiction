import type { EndpointMeta, EndpointResponse } from '@fiction/core'
import type express from 'express'
import type { SitesQuerySettings } from './endpoint.js'

import { Endpoint, isNode } from '@fiction/core'
import nodeFetch from 'node-fetch'
import { SitesQuery } from './endpoint.js'

type CertificateIssue = {
  type: string
  expiresAt: string
}

type CertificateDetails = Partial<{
  configured: boolean
  acmeDnsConfigured: boolean
  acmeAlpnConfigured: boolean
  certificateAuthority: string
  createdAt: string
  dnsProvider: string
  dnsValidationInstructions: string
  dnsValidationHostname: string
  dnsValidationTarget: string
  hostname: string
  id: string
  source: string
  clientStatus: string
  issued: {
    nodes: CertificateIssue[]
  }
  test: string
  _action: string
}>

interface ManageDomainParams {
  _action?: 'create' | 'retrieve' | 'delete' | 'check'
  hostname?: string
  siteId?: string
  appId?: string
  allowInTest?: boolean
}

export class ManageDomain extends SitesQuery {
  graphqlEndpoint = 'https://api.fly.io/graphql'
  fictionSites = this.settings.fictionSites
  flyApiToken = this.fictionSites.settings.flyApiToken
  flyAppId = this.fictionSites.settings.flyAppId
  requestId = Math.random().toString(36).substring(7)
  isAuthenticated = false

  constructor(settings: SitesQuerySettings) {
    super(settings)

    if (!this.settings.fictionEnv.isApp.value) {
      if (!this.flyApiToken || this.flyApiToken.trim() === '')
        throw new Error('[CERTS-INIT] Fly.io API token is required for managing certificates.')

      if (!this.flyAppId)
        throw new Error('[CERTS-INIT] Fly.io App ID is required for managing certificates.')
    }

    const checkoutEndpoint = new Endpoint({
      requestHandler: async (...r) => this.verifyHostname({ request: r[0], response: r[1] }),
      key: 'hostnameVerify',
      basePath: '/direct-domain-verify',
      serverUrl: this.settings.fictionServer.serverUrl.value,
      fictionUser: this.settings.fictionUser,
      fictionEnv: this.settings.fictionEnv,
      useNaked: true,
    })

    this.settings.fictionServer.addEndpoints([checkoutEndpoint])
  }

  async verifyHostname({ request, response }: { request: express.Request, response: express.Response }) {
    const domain = request.query.domain as string
    const systemDomains = ['fiction.com', 'fictionsites.com']

    try {
      const { isIP } = await import('node:net')

      // Check invalid or IP-based hosts
      if (!domain || isIP(domain)) {
        this.log.warn('Invalid host format', { data: { query: request.query } })
        response.status(403).send('invalid').end()
        return
      }

      // Allow system domains
      if (systemDomains.some(domain => domain.endsWith(domain))) {
        response.status(200).send('ok').end()
        return
      }

      // Verify external domains
      const { siteId } = await this.fictionSites.queries.ManageSite.getSiteSelector({ hostname: domain })

      response.status(siteId ? 200 : 403).send(siteId ? 'ok' : 'invalid').end()
    }
    catch (error) {
      this.log.error('Domain verification failed', { error })
      response.status(500).send('invalid').end()
    }
  }

  private readonly AUTH_CHECK_QUERY = `
    query {
      viewer {
        id
      }
    }
  `

  async verifyAuthentication(): Promise<boolean> {
    try {
      this.log.info('[CERTS-AUTH] Verifying API token', { data: {
        requestId: this.requestId,
        appId: this.flyAppId,
      } })

      const client = await this.getClient()
      await client.request(this.AUTH_CHECK_QUERY)

      this.isAuthenticated = true
      this.log.info('[CERTS-AUTH] API token verified successfully', { data: {
        requestId: this.requestId,
        appId: this.flyAppId,
      } })

      return true
    }
    catch (error) {
      this.isAuthenticated = false
      this.log.error('[CERTS-AUTH] API token verification failed', { data: {
        requestId: this.requestId,
        appId: this.flyAppId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      } })

      throw new Error('[CERTS-AUTH] API token verification failed')
    }
  }

  async getClient() {
    const { GraphQLClient } = await import('graphql-request')
    return new GraphQLClient(this.graphqlEndpoint, {
      fetch: isNode() ? nodeFetch : fetch as any,
      headers: {
        Authorization: `Bearer ${this.fictionSites.settings.flyApiToken}`,
      },
    })
  }

  private async graphqlRequest(query: string, args: ManageDomainParams): Promise<CertificateDetails> {
    if (!this.isAuthenticated && !this.settings.fictionEnv.isApp.value) {
      this.log.warn('[CERTS-REQUEST] Making request without verified authentication', { data: {
        requestId: this.requestId,
        action: args._action,
      } })
    }

    const v = { appId: this.settings.flyAppId, ...args }
    this.log.info(`[CERTS-${args._action?.toUpperCase()}] Starting request`, { data: {
      requestId: this.requestId,
      hostname: args.hostname,
      action: args._action,
      isAuthenticated: this.isAuthenticated,
    } })

    const client = await this.getClient()
    const response = await client.request<{ [key: string]: { certificate: CertificateDetails } }>(query, v)

    const firstKey = Object.keys(response)[0]
    const certificateContainer = response[firstKey]

    this.log.info(`[CERTS-${args._action?.toUpperCase()}] Request completed`, { data: {
      requestId: this.requestId,
      hostname: args.hostname,
      certificateId: certificateContainer?.certificate?.id,
    } })

    if (certificateContainer && certificateContainer.certificate)
      return certificateContainer.certificate
    else
      throw new Error(`[CERTS-${args._action?.toUpperCase()}] Certificate not found in response`)
  }

  private async verifyCertificateCreation(hostname: string): Promise<CertificateDetails | undefined> {
    try {
      this.log.info('[CERTS-VERIFY] Running post-creation verification', { data: {
        requestId: this.requestId,
        hostname,
      } })

      const verificationResult = await this.graphqlRequest(this.CHECK_CERTIFICATE_QUERY, {
        _action: 'check',
        hostname,
      })

      this.log.info('[CERTS-VERIFY] Verification completed', { data: {
        requestId: this.requestId,
        hostname,
        status: verificationResult.clientStatus,
        configured: verificationResult.configured,
      } })

      return verificationResult
    }
    catch (error) {
      this.log.error('[CERTS-VERIFY] Verification failed', { data: {
        requestId: this.requestId,
        hostname,
        error: error instanceof Error ? error.message : 'Unknown error',
      } })
      return undefined
    }
  }

  public async run(args: ManageDomainParams, _meta: EndpointMeta): Promise<EndpointResponse<CertificateDetails>> {
    const { _action, hostname, allowInTest } = args

    let query = ''

    if (this.fictionSites.settings.fictionEnv.isTest.value && !allowInTest) {
      return {
        status: 'success',
        data: {
          hostname,
          test: 'cert api did not run due to allowInTest:false',
          _action,
        },
      }
    }

    if (!_action)
      throw new Error('[CERTS-RUN] Action is required for managing certificates.')

    if (!hostname)
      throw new Error('[CERTS-RUN] Hostname is required for getting a certificate.')

    switch (_action) {
      case 'retrieve':
        query = this.GET_CERTIFICATES_QUERY
        break
      case 'create':
        query = this.ADD_CERTIFICATE_MUTATION
        break
      case 'delete':
        query = this.DELETE_CERTIFICATE_MUTATION
        break
      case 'check':
        query = this.CHECK_CERTIFICATE_QUERY
        break
      default:
        throw new Error('[CERTS-RUN] Invalid action.')
    }

    let certificate: CertificateDetails
    try {
      certificate = await this.graphqlRequest(query, args)

      if (_action === 'create') {
        const verifiedCert = await this.verifyCertificateCreation(hostname)
        if (verifiedCert) {
          certificate = { ...certificate, ...verifiedCert }
        }
      }
    }
    catch (error) {
      const e = error as Error & { code: string }

      if (e.message.includes('NOT_FOUND')) {
        this.log.info('[CERTS-ERROR] Certificate not found', { data: {
          requestId: this.requestId,
          hostname,
          action: _action,
        } })
        return { status: 'success', data: undefined }
      }
      else if (e.message.includes('UNPROCESSABLE')) {
        this.log.info('[CERTS-ERROR] Certificate already exists', { data: {
          requestId: this.requestId,
          hostname,
          action: _action,
        } })
        const r = await this.run({ _action: 'check', hostname, allowInTest }, _meta)
        return { status: 'success', data: r.data }
      }
      else {
        this.log.error('[CERTS-ERROR] GraphQL request failed', { data: {
          requestId: this.requestId,
          hostname,
          action: _action,
          error: e.message,
          code: e.code,
          stack: e.stack,
        } })
        return { status: 'error', message: 'API error', error }
      }
    }

    return { status: 'success', data: { ...certificate, _action } }
  }

  GET_CERTIFICATES_QUERY = `query($appId: String!, $hostname: String!) {
    app(name: $appId) {
      certificate(hostname: $hostname) {
        configured
        acmeDnsConfigured
        acmeAlpnConfigured
        certificateAuthority
        createdAt
        dnsProvider
        dnsValidationInstructions
        dnsValidationHostname
        dnsValidationTarget
        hostname
        id
        source
        clientStatus
        issued {
          nodes {
            type
            expiresAt
          }
        }
      }
    }
  }`

  ADD_CERTIFICATE_MUTATION = `
    mutation($appId: ID!, $hostname: String!) {
      addCertificate(appId: $appId, hostname: $hostname) {
        certificate {
          configured
          acmeDnsConfigured
          acmeAlpnConfigured
          certificateAuthority
          certificateRequestedAt
          dnsProvider
          dnsValidationInstructions
          dnsValidationHostname
          dnsValidationTarget
          hostname
          id
          source
        }
      }
    }`

  DELETE_CERTIFICATE_MUTATION = `mutation($appId: ID!, $hostname: String!) {
    deleteCertificate(appId: $appId, hostname: $hostname) {
      app {
        name
      }
      certificate {
        hostname
        id
      }
    }
  }`

  CHECK_CERTIFICATE_QUERY = `
    query($appId: String!, $hostname: String!) {
      app(name: $appId) {
        certificate(hostname: $hostname) {
          check
          configured
          acmeDnsConfigured
          acmeAlpnConfigured
          certificateAuthority
          createdAt
          dnsProvider
          dnsValidationInstructions
          dnsValidationHostname
          dnsValidationTarget
          hostname
          id
          source
          clientStatus
          issued {
            nodes {
              type
              expiresAt
            }
          }
        }
      }
    }`
}
