/**
 * @vitest-environment happy-dom
 */
import { shortId } from '@fiction/core'
import { afterAll, describe, expect, it } from 'vitest'
import { requestManageSite } from '../../load.js'
import { t } from '../../tables.js'
import { createSiteTestUtils } from '../../test/testUtils.js'
import { updateCustomDomains } from '../cert.js'
import { saveSite } from '../site.js'

describe('updateCustomDomains', async () => {
  const testUtils = await createSiteTestUtils()
  const { user } = await testUtils.init()
  afterAll(() => testUtils.close())
  const { fictionSites, fictionDb } = testUtils

  // Setup test site
  const result = await requestManageSite({
    _action: 'create',
    fields: { title: 'test', themeId: 'test' },
    caller: 'saveSiteInit',
    fictionSites: testUtils.fictionSites,
    siteRouter: testUtils.fictionRouterSites,
    siteMode: 'standard',
  })

  if (!result.site || !result.response?.data)
    throw new Error('problem creating site')

  const site = result.site

  it('adds new domain mapping when custom domain added', async () => {
    const newDomain = { hostname: `test-${shortId()}.test.com` }
    const siteId = site.siteId
    const updatedDomains = await updateCustomDomains({ siteId, customDomains: [newDomain], fictionSites, fictionDb }, {})

    expect(updatedDomains).toHaveLength(1)
    expect(updatedDomains[0].hostname).toBe(newDomain.hostname)
  })

  it('removes domain mapping when custom domain removed', async () => {
    const existingDomain = { hostname: `existing-${shortId()}.test.com` }
    await testUtils.fictionDb.client()(t.domains).insert({
      siteId: site.siteId,
      hostname: existingDomain.hostname,
    })

    const updatedDomains = await updateCustomDomains({
      siteId: site.siteId,
      customDomains: [],
      fictionSites,
      fictionDb,
    }, {})

    const domainExists = await testUtils.fictionDb.client()(t.domains)
      .where({ hostname: existingDomain.hostname })
      .first()

    expect(updatedDomains).toHaveLength(0)
    expect(domainExists).toBeUndefined()
  })

  it('saves site with valid domains and filters invalid ones', async () => {
    const hostname = `test-${shortId()}.test.com`
    const newDomain = { hostname, isPrimary: true }
    const badDomain = { hostname: 'bad' }

    await site.update({
      customDomains: [newDomain, badDomain],
    }, { caller: 'certTests' })

    const updatedSite = await saveSite({
      site,
      successMessage: 'test',
      isPublishingDomains: true,
    })

    // Verify domain records
    expect(updatedSite?.customDomains).toHaveLength(1)
    expect(updatedSite?.customDomains[0].hostname).toBe(newDomain.hostname)
    expect(updatedSite?.customDomains[0].isPrimary).toBe(true)

    // Verify domain mapping exists in DB
    const domainRecord = await testUtils.fictionDb.client()(t.domains)
      .where({ hostname: newDomain.hostname })
      .first()

    expect(domainRecord).toBeTruthy()
    expect(domainRecord.hostname).toBe(hostname)

    // Test domain removal
    await site.update({ customDomains: [] }, { caller: 'certTests' })

    const updatedSite2 = await saveSite({
      site,
      successMessage: 'test',
      isPublishingDomains: true,
    })

    expect(updatedSite2?.customDomains).toHaveLength(0)

    // Verify domain mapping removed from DB
    const removedDomain = await testUtils.fictionDb.client()(t.domains)
      .where({ hostname: newDomain.hostname })
      .first()

    expect(removedDomain).toBeUndefined()
  })
})
