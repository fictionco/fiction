import type { SiteTestUtils } from './testUtils'
import { isCi } from '@fiction/core'
import { snap } from '@fiction/core/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import { createSiteTestUtils } from './testUtils'

let testUtils: SiteTestUtils
describe('manageCertificates', { retry: isCi() ? 3 : 0 }, () => {
  const hostname = 'example.com'
  const maskedKeys = ['id', 'dnsValidationInstructions', 'dnsValidationTarget', 'issued', 'nodes']
  beforeAll(async () => {
    testUtils = await createSiteTestUtils()
    await testUtils.init()
  })

  describe('error handling', () => {
    it('should handle missing action parameter', async () => {
      const r1 = await testUtils.fictionSites.requests.ManageCert.request({
        hostname: 'example.com',
        allowInTest: true,
      })
      expect(r1.status).toBe('error')
      expect(r1.reason).toContain('Action is required')
    })

    it('should handle missing hostname parameter', async () => {
      const r1 = await testUtils.fictionSites.requests.ManageCert.request({
        _action: 'create',
        allowInTest: true,
      })
      expect(r1.status).toBe('error')
      expect(r1.reason).toBe('[CERTS-RUN] Hostname is required for getting a certificate.')
    })

    it('should handle invalid action parameter', async () => {
      const r1 = await testUtils.fictionSites.requests.ManageCert.request({
        // @ts-expect-error testing invalid action
        _action: 'invalid',
        hostname: 'example.com',
        allowInTest: true,
      })
      expect(r1.status).toBe('error')
      expect(r1.reason).toBe('[CERTS-RUN] Invalid action.')
    })
  })

  describe('authentication', () => {
    it('should handle authentication failure', async () => {
      // Temporarily invalidate token
      const originalToken = testUtils.fictionSites.settings.flyApiToken
      testUtils.fictionSites.settings.flyApiToken = 'invalid-token'

      await expect(testUtils.fictionSites.queries.ManageCert.verifyAuthentication()).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: [CERTS-AUTH] API token verification failed]`)

      // Restore token
      testUtils.fictionSites.settings.flyApiToken = originalToken
    })
  })

  describe('allowInTest behavior', () => {
    it('should return test message when allowInTest is false', async () => {
      const r1 = await testUtils.fictionSites.requests.ManageCert.request({
        _action: 'create',
        hostname: 'example.com',
        allowInTest: false,
      })

      expect(r1.status).toBe('success')
      expect(r1.data).toEqual({
        hostname: 'example.com',
        test: 'cert api did not run due to allowInTest:false',
        _action: 'create',
      })
    })
  })

  describe('certificate lifecycle', () => {
    it('should handle already existing certificate', async () => {
      // Create certificate first
      await testUtils.fictionSites.requests.ManageCert.request({
        _action: 'create',
        hostname: 'duplicate.com',
        allowInTest: true,
      })

      // Try to create again
      const r1 = await testUtils.fictionSites.requests.ManageCert.request({
        _action: 'create',
        hostname: 'duplicate.com',
        allowInTest: true,
      })

      expect(r1.status).toBe('success')
      expect(r1.data?.clientStatus).toMatchInlineSnapshot(`"Awaiting configuration"`)

      // Clean up
      await testUtils.fictionSites.requests.ManageCert.request({
        _action: 'delete',
        hostname: 'duplicate.com',
        allowInTest: true,
      })
    })

    it('should verify certificate after creation', async () => {
      const r1 = await testUtils.fictionSites.requests.ManageCert.request({
        _action: 'create',
        hostname: 'verify-test.com',
        allowInTest: true,
      })

      expect(r1.status).toBe('success')
      expect(r1.data?.configured).toBeDefined()
      expect(r1.data?.clientStatus).toBeDefined()
    })

    it('should handle certificate not found during retrieval', async () => {
      const r1 = await testUtils.fictionSites.requests.ManageCert.request({
        _action: 'retrieve',
        hostname: 'nonexistent.com',
        allowInTest: true,
      })

      expect(r1.status).toBe('success')
      expect(r1.data).toBeUndefined()
    })
  })

  it('should set certificates', async () => {
    const r1 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'create', hostname: 'www.fiction.com', appId: 'fiction-website', allowInTest: true })
    expect(r1.status).toBe('success')
    expect(snap(r1.data, { maskedKeys })).toMatchInlineSnapshot(`undefined`)

    const r2 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'create', hostname: 'test-site.fiction.com', appId: 'fiction-sites', allowInTest: true })
    expect(r2.status).toBe('success')
    expect(snap(r2.data, { maskedKeys })).toMatchInlineSnapshot(`
      {
        "_action": "check",
        "acmeAlpnConfigured": "true",
        "acmeDnsConfigured": "false",
        "certificateAuthority": "lets_encrypt",
        "check": "true",
        "clientStatus": "Ready",
        "configured": "true",
        "createdAt": "[datetime:****-**-*****:**:***]",
        "dnsProvider": "cloudflare",
        "dnsValidationHostname": "_acme-challenge.test-site.fiction.com",
        "dnsValidationInstructions": "**MASKED**",
        "dnsValidationTarget": "**MASKED**",
        "hostname": "test-site.fiction.com",
        "id": "**MASKED**",
        "issued": {
          "nodes": [
            {
              "expiresAt": "[datetime:****-**-*****:**:***]",
              "type": "rsa",
            },
            {
              "expiresAt": "[datetime:****-**-*****:**:***]",
              "type": "ecdsa",
            },
            {
              "expiresAt": "[datetime:****-**-*****:**:***]",
              "type": "rsa",
            },
            {
              "expiresAt": "[datetime:****-**-*****:**:***]",
              "type": "ecdsa",
            },
          ],
        },
        "source": "fly",
      }
    `)
  })

  it('should get certificate', async () => {
    const r1 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'retrieve', hostname, allowInTest: true })
    expect(r1.status).toBe('success')
    expect(r1.data).toMatchInlineSnapshot(`undefined`)

    if (r1.data) {
      const r2 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'delete', hostname, allowInTest: true })

      expect(r2.status).toBe('success')
      expect(r2.data).toMatchInlineSnapshot(`undefined`)
    }
  })

  it('should create certificate', async () => {
    if (!testUtils)
      throw new Error('testUtils not defined')

    const r1 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'create', hostname, allowInTest: true })
    expect(r1.status).toBe('success')
    expect(snap(r1.data, { maskedKeys })).toMatchInlineSnapshot(`
      {
        "_action": "create",
        "acmeAlpnConfigured": "false",
        "acmeDnsConfigured": "false",
        "certificateAuthority": "lets_encrypt",
        "certificateRequestedAt": "null",
        "check": "false",
        "clientStatus": "Awaiting configuration",
        "configured": "false",
        "createdAt": "[datetime:****-**-*****:**:***]",
        "dnsProvider": "icann",
        "dnsValidationHostname": "_acme-challenge.example.com",
        "dnsValidationInstructions": "**MASKED**",
        "dnsValidationTarget": "**MASKED**",
        "hostname": "example.com",
        "id": "**MASKED**",
        "issued": {
          "nodes": [],
        },
        "source": "fly",
      }
    `)
  })

  it('should check certificate', async () => {
    const r1 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'check', hostname, allowInTest: true })

    expect(r1.status).toBe('success')
    expect(snap(r1.data, { maskedKeys })).toMatchInlineSnapshot(`
      {
        "_action": "check",
        "acmeAlpnConfigured": "false",
        "acmeDnsConfigured": "false",
        "certificateAuthority": "lets_encrypt",
        "check": "false",
        "clientStatus": "Awaiting configuration",
        "configured": "false",
        "createdAt": "[datetime:****-**-*****:**:***]",
        "dnsProvider": "icann",
        "dnsValidationHostname": "_acme-challenge.example.com",
        "dnsValidationInstructions": "**MASKED**",
        "dnsValidationTarget": "**MASKED**",
        "hostname": "example.com",
        "id": "**MASKED**",
        "issued": {
          "nodes": [],
        },
        "source": "fly",
      }
    `)
  })

  it('should delete certificate', async () => {
    const r1 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'delete', hostname, allowInTest: true })

    expect(r1.status).toBe('success')
    expect(snap(r1.data, { maskedKeys })).toMatchInlineSnapshot(`
      {
        "_action": "delete",
        "hostname": "example.com",
        "id": "**MASKED**",
      }
    `)
  })
})
