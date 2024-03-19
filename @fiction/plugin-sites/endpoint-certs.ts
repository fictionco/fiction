import type { EndpointMeta, EndpointResponse } from '@fiction/core'

import type { SitesQuerySettings } from './endpoint'
import { SitesQuery } from './endpoint'

type CertificateIssue = {
  type: string
  expiresAt: string
}

type CertificateDetails = {
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
}

interface ManageCertParams {
  _action?: 'create' | 'retrieve' | 'delete' | 'check'
  hostname?: string
  siteId?: string
  appId?: string
}
export class ManageCert extends SitesQuery {
  graphqlEndpoint = 'https://api.fly.io/graphql'
  fictionSites = this.settings.fictionSites
  flyIoApiToken = this.fictionSites.settings.flyIoApiToken
  flyIoAppId = this.fictionSites.settings.flyIoAppId

  constructor(settings: SitesQuerySettings) {
    super(settings)

    if (!this.settings.fictionEnv.isApp.value) {
      if (!this.flyIoApiToken)
        throw new Error('Fly.io API token is required for managing certificates.')

      if (!this.flyIoAppId)
        throw new Error('Fly.io App ID is required for managing certificates.')
    }
  }

  async getClient() {
    const { GraphQLClient } = await import('graphql-request')
    return new GraphQLClient(this.graphqlEndpoint, {
      headers: {
        Authorization: `Bearer ${this.fictionSites.settings.flyIoApiToken}`,
      },
    })
  }

  private async graphqlRequest(query: string, args: ManageCertParams): Promise<CertificateDetails> {
    const v = { appId: this.settings.flyIoAppId, ...args }
    const client = await this.getClient()
    const response = await client.request<{ [key: string]: { certificate: CertificateDetails } }>(query, v)

    // Extract the first property (key) from the response
    const firstKey = Object.keys(response)[0]
    const certificateContainer = response[firstKey]

    // Ensure the 'certificate' property exists and return it
    if (certificateContainer && certificateContainer.certificate)
      return certificateContainer.certificate

    else
      throw new Error('Certificate not found in response')
  }

  public async run(args: ManageCertParams, _meta: EndpointMeta): Promise<EndpointResponse<CertificateDetails >> {
    const { _action, hostname } = args

    let query = ''

    if (!_action)
      throw new Error('Action is required for managing certificates.')

    if (!hostname)
      throw new Error('Hostname is required for getting a certificate.')

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
        throw new Error('Invalid action.')
    }

    let certificate: CertificateDetails
    try {
      certificate = await this.graphqlRequest(query, args)
    }
    catch (error) {
      const e = error as Error & { code: string }

      // The certificate doesn't exist, return successful query but undefined data
      if (e.message.includes('NOT_FOUND')) {
        return { status: 'success', data: undefined }
      }
      // The certificate already exists, return successful query with the existing certificate
      else if (e.message.includes('UNPROCESSABLE')) {
        const r = await this.run({ _action: 'check', hostname }, _meta)

        return { status: 'success', data: r.data }
      }
      else {
        this.log.error(`Error in GraphQL Request`, { error })
        return { status: 'error', message: 'API error', error }
      }
    }

    return { status: 'success', data: certificate }
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
