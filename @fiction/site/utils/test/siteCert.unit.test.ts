import { describe, expect, it } from 'vitest'
import { shortId } from '@fiction/core'
import { tableNames } from '../../tables'
import { requestManageSite } from '../../load'
import { createSiteTestUtils } from '../../test/testUtils'
import { saveSite } from '../site'
import { updateSiteCerts } from '../cert'

describe('updateSiteCerts', async () => {
  const testUtils = await createSiteTestUtils()
  await testUtils.init()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test', siteMode: 'standard' } as const
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
    await testUtils.fictionDb.client()(tableNames.domains).insert({
      siteId: site.siteId,
      hostname: existingDomain.hostname,
    })
    const siteId = site.siteId
    const updatedDomains = await updateSiteCerts({ siteId, customDomains: [], fictionSites, fictionDb }, {})

    const domainExists = await testUtils.fictionDb.client()(tableNames.domains)
      .where({ hostname: existingDomain.hostname })
      .first()

    expect(updatedDomains).toHaveLength(0)
    expect(domainExists).toBeUndefined()
  })

  it('saves site with domains', async () => {
    const hostname = `test-q-${shortId()}.test.com`
    const newDomain = { hostname, isPrimary: true }
    const badDomain = { hostname: 'bad' }
    site.update({ customDomains: [newDomain, badDomain] })

    const updatedSite = await saveSite({
      site,
      successMessage: 'test',
      isPublishingDomains: true,
    })

    expect(updatedSite?.customDomains).toHaveLength(1)
    expect(updatedSite?.customDomains[0].hostname).toBe(newDomain.hostname)
    expect(updatedSite?.customDomains[0].isPrimary).toBe(true)

    const deployedCert1 = await testUtils.fictionSites.queries.ManageCert.serve({ _action: 'retrieve', hostname: newDomain.hostname }, { caller: 'updateSiteCerts' })

    expect(deployedCert1.status).toBe('success')
    expect(deployedCert1.data?.hostname).toBe(hostname)

    site.update({ customDomains: [] })

    const updatedSite2 = await saveSite({
      site,
      successMessage: 'test',
      isPublishingDomains: true,
    })

    expect(updatedSite2?.customDomains).toHaveLength(0)

    const deployedCert2 = await testUtils.fictionSites.queries.ManageCert.serve({ _action: 'retrieve', hostname: newDomain.hostname }, { caller: 'updateSiteCerts' })

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
