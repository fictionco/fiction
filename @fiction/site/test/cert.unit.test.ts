/**
 * @vitest-environment happy-dom
 */
import { beforeAll, describe, expect, it } from 'vitest'
import { snap } from '@fiction/core/test-utils'
import type { SiteTestUtils } from './testUtils'
import { createSiteTestUtils } from './testUtils'

let testUtils: SiteTestUtils
describe('manageCertificates', () => {
  const hostname = 'example.com'
  const maskedKeys = ['id', 'dnsValidationInstructions', 'dnsValidationTarget', 'issued', 'nodes']
  beforeAll(async () => {
    testUtils = await createSiteTestUtils()
    await testUtils.init()
  })

  it('should set certificates', async () => {
    const r1 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'create', hostname: 'www.fiction.com', appId: 'fiction-website' })
    expect(r1.status).toBe('success')
    expect(snap(r1.data, { maskedKeys })).toMatchInlineSnapshot(`undefined`)

    const r2 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'create', hostname: 'test-site.fiction.com', appId: 'fiction-sites' })
    expect(r2.status).toBe('success')
    expect(snap(r2.data, { maskedKeys })).toMatchInlineSnapshot(`
      {
        "acmeAlpnConfigured": "true",
        "acmeDnsConfigured": false,
        "certificateAuthority": "lets_encrypt",
        "check": "true",
        "clientStatus": "Ready",
        "configured": "true",
        "createdAt": "[dateTime:]",
        "dnsProvider": "cloudflare",
        "dnsValidationHostname": "_acme-challenge.test-site.fiction.com",
        "dnsValidationInstructions": "**MASKED**",
        "dnsValidationTarget": "**MASKED**",
        "hostname": "test-site.fiction.com",
        "id": "**MASKED**",
        "issued": {
          "nodes": "**MASKED**",
        },
        "source": "fly",
      }
    `)
  })

  it('should get certificate', async () => {
    const r1 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'retrieve', hostname })
    expect(r1.status).toBe('success')
    expect(r1.data).toMatchInlineSnapshot(`undefined`)

    if (r1.data) {
      const r2 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'delete', hostname })

      expect(r2.status).toBe('success')
      expect(r2.data).toMatchInlineSnapshot(`undefined`)
    }
  })

  it('should create certificate', async () => {
    if (!testUtils)
      throw new Error('testUtils not defined')

    const r1 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'create', hostname })
    expect(r1.status).toBe('success')
    expect(snap(r1.data, { maskedKeys })).toMatchInlineSnapshot(`
      {
        "acmeAlpnConfigured": false,
        "acmeDnsConfigured": false,
        "certificateAuthority": "lets_encrypt",
        "certificateRequestedAt": null,
        "configured": false,
        "dnsProvider": "icann",
        "dnsValidationHostname": "_acme-challenge.example.com",
        "dnsValidationInstructions": "**MASKED**",
        "dnsValidationTarget": "**MASKED**",
        "hostname": "example.com",
        "id": "**MASKED**",
        "source": "fly",
      }
    `)
  })

  it('should check certificate', async () => {
    const r1 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'check', hostname })

    expect(r1.status).toBe('success')
    expect(snap(r1.data, { maskedKeys })).toMatchInlineSnapshot(`
      {
        "acmeAlpnConfigured": false,
        "acmeDnsConfigured": false,
        "certificateAuthority": "lets_encrypt",
        "check": false,
        "clientStatus": "Awaiting configuration",
        "configured": false,
        "createdAt": "[dateTime:]",
        "dnsProvider": "icann",
        "dnsValidationHostname": "_acme-challenge.example.com",
        "dnsValidationInstructions": "**MASKED**",
        "dnsValidationTarget": "**MASKED**",
        "hostname": "example.com",
        "id": "**MASKED**",
        "issued": {
          "nodes": "**MASKED**",
        },
        "source": "fly",
      }
    `)
  })

  it('should delete certificate', async () => {
    const r1 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'delete', hostname })

    expect(r1.status).toBe('success')
    expect(snap(r1.data, { maskedKeys })).toMatchInlineSnapshot(`
      {
        "hostname": "example.com",
        "id": "**MASKED**",
      }
    `)
  })
})
