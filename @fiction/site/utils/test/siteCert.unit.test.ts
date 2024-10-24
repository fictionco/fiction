/**
 * @vitest-environment happy-dom
 */
import { type EndpointMeta, shortId } from '@fiction/core'
import { describe, expect, it } from 'vitest'
import { requestManageSite } from '../../load.js'
import { t } from '../../tables.js'
import { createSiteTestUtils } from '../../test/testUtils.js'
import { updateSiteCerts } from '../cert.js'
import { saveSite } from '../site.js'

describe('updateSiteCerts', async () => {
  const testUtils = await createSiteTestUtils()
  const { user } = await testUtils.init()
  const meta = { bearer: user } as EndpointMeta
  const common = {
    fictionSites: testUtils.fictionSites,
    siteRouter: testUtils.fictionRouterSites,
    themeId: 'test',
    siteMode: 'standard',
  } as const
  const { fictionSites, fictionDb } = testUtils
  const result = await requestManageSite(
    {
      _action: 'create',
      fields: { title: 'test', themeId: 'test' },
      caller: 'saveSiteInit',
      ...common,
    },
  )
  if (!result.site || !result.response?.data)
    throw new Error('problem creating site')

  const site = result.site

  it('adds new certs when new custom domains are added', async () => {
    const newDomain = { hostname: `test-${shortId()}.test.com` }
    const siteId = site.siteId
    const updatedDomains = await updateSiteCerts({ siteId, customDomains: [newDomain], fictionSites, fictionDb }, {})

    expect(updatedDomains).toHaveLength(1)
    expect(updatedDomains[0].hostname).toBe(newDomain.hostname)
  })

  it('removes certs when custom domains are removed', async () => {
    const existingDomain = { hostname: `existing-${shortId()}.test.com` }
    await testUtils.fictionDb.client()(t.domains).insert({
      siteId: site.siteId,
      hostname: existingDomain.hostname,
    })
    const siteId = site.siteId
    const updatedDomains = await updateSiteCerts({ siteId, customDomains: [], fictionSites, fictionDb }, {})

    const domainExists = await testUtils.fictionDb.client()(t.domains).where({ hostname: existingDomain.hostname }).first()

    expect(updatedDomains).toHaveLength(0)
    expect(domainExists).toBeUndefined()
  })

  it('saves site with domains', async () => {
    const hostname = `test-q-${shortId()}.test.com`
    const newDomain = { hostname, isPrimary: true }
    const badDomain = { hostname: 'bad' }
    await site.update({ customDomains: [newDomain, badDomain] }, { caller: 'certTests' })

    const updatedSite = await saveSite({
      site,
      successMessage: 'test',
      isPublishingDomains: true,
    })

    expect(updatedSite?.customDomains).toHaveLength(1)
    expect(updatedSite?.customDomains[0].hostname).toBe(newDomain.hostname)
    expect(updatedSite?.customDomains[0].isPrimary).toBe(true)

    const deployedCert1 = await testUtils.fictionSites.queries.ManageCert.serve({ _action: 'retrieve', hostname: newDomain.hostname }, { ...meta, caller: 'updateSiteCerts' })

    expect(deployedCert1.status).toBe('success')
    expect(deployedCert1.data?.hostname).toBe(hostname)

    await site.update({ customDomains: [] }, { caller: 'certTests' })

    const updatedSite2 = await saveSite({
      site,
      successMessage: 'test',
      isPublishingDomains: true,
    })

    expect(updatedSite2?.customDomains).toHaveLength(0)

    const deployedCert2 = await testUtils.fictionSites.queries.ManageCert.serve({ _action: 'retrieve', hostname: newDomain.hostname }, { ...meta, caller: 'updateSiteCerts' })

    expect(deployedCert2).toMatchInlineSnapshot(`
      {
        "data": undefined,
        "status": "success",
      }
    `)
    expect(deployedCert2.status).toBe('success')
    expect(deployedCert2.data).toBeUndefined()
  })
})
