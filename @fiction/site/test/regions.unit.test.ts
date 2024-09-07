import { objectId } from '@fiction/core'
import { describe, expect, it } from 'vitest'
import type { InitializedTestUtils } from '@fiction/core/test-utils'
import { Card } from '../card'
import { Site } from '../site'
import { setup } from './test-theme'
import { createSiteTestUtils } from './testUtils'
import type { SiteTestUtils } from './testUtils'

let site: Site

const fields = new Card({
  regionId: 'main',
  templateId: 'wrap',
  title: 'Example',
  cards: [{ templateId: 'hero' }],
}).toConfig()

const caller = 'test'

async function getDbSite(testUtils: SiteTestUtils, r: InitializedTestUtils) {
  const m = testUtils.fictionSites.queries.ManageSite
  const userId = r?.user?.userId ?? ''
  const orgId = r?.user?.orgs?.[0]?.orgId ?? ''
  const r2 = await m.serve({
    _action: 'create',
    userId,
    orgId,
    fields: { themeId: 'test' },
    caller: 'regions.unit.test.ts',
  }, { server: true })

  const siteConfig = r2.data
  expect(siteConfig?.siteId).toBeTruthy()

  const siteId = siteConfig?.siteId

  if (!siteId)
    throw new Error('siteId not found')

  site = await Site.create({
    ...siteConfig,
    fictionSites: testUtils.fictionSites,
    siteRouter: testUtils.fictionRouterSites,
    themeId: 'test',
    siteId,
  })

  return site
}

describe('special slug handling for _home', async () => {
  const testUtils = await createSiteTestUtils()
  const r = await testUtils.init()
  const userId = r?.user?.userId ?? ''
  const orgId = r?.user?.orgs?.[0]?.orgId ?? ''
  const site = await getDbSite(testUtils, r)
  const siteId = site.siteId
  it('should rename existing _home to old-home if a new _home is created', async () => {
    const pg = site.pages.value.find(p => p.slug.value === '_home')
    await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'upsert', siteId, fields: { ...fields, cardId: pg?.cardId, siteId, slug: '_home' }, orgId, userId, caller },
      { server: true },
    )

    // Verify that the first page's slug has been renamed to 'old-home'
    const response1 = await testUtils.fictionSites.queries.ManagePage.serve(
      { _action: 'retrieve', siteId, fields: { siteId, slug: 'old-home' }, orgId, userId, caller },
      { server: true },
    )

    expect(response1.status).toBe('error')

    // Attempt to create another page with the same slug '_home'
    await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'upsert', siteId, fields: { ...fields, cardId: objectId(), siteId, slug: '_home' }, orgId, userId, caller },
      { server: true },
    )

    // Verify that the first page's slug has been renamed to 'old-home'
    const response2 = await testUtils.fictionSites.queries.ManagePage.serve(
      { _action: 'retrieve', siteId, fields: { siteId, slug: 'old-home' }, orgId, userId, caller },
      { server: true },
    )

    expect(response2.status).toBe('success')
    expect(response2.data?.slug).toMatchInlineSnapshot(`"old-home"`)

    // Assuming the renaming and iteration logic is correctly implemented
    // After creating two _home pages and having the first renamed to 'old-home'
    // Create a third page with slug '_home'
    await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'upsert', siteId, fields: { ...fields, cardId: objectId(), siteId, slug: '_home' }, orgId, userId, caller },
      { server: true },
    )

    // Verify the second _home page's slug has been renamed to 'old-home-1'
    const response3 = await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'retrieve', siteId, fields: { siteId, slug: 'old-home-1' }, orgId, userId, caller },
      { server: true },
    )

    expect(response3.status).toBe('success')
    expect(response3.data?.slug).toBe('old-home-1')
  })

  it('should handle creation of a page with a slug starting with underscore other than _home', async () => {
    // Create a page with slug '_about'
    const response = await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'upsert', siteId, fields: { ...fields, siteId: site.siteId, slug: '_about' }, orgId, userId, caller },
      { server: true },
    )

    expect(response.status).toBe('success')
    // The slug should be directly transformed to 'old-about' without needing iteration
    expect(response.data?.slug).toBe('_about')
  })
})

describe('upsert action', async () => {
  const testUtils = await createSiteTestUtils()
  const testTheme = setup(testUtils)
  const r = await testUtils.init()
  const userId = r?.user?.userId ?? ''
  const orgId = r?.user?.orgs?.[0]?.orgId ?? ''
  const m = testUtils.fictionSites.queries.ManageSite
  const r2 = await m.serve({
    _action: 'create',
    userId,
    orgId,
    fields: { themeId: testTheme.themeId },
    caller: 'regions.unit.test.ts',
  }, { server: true })

  const siteConfig = r2.data
  expect(siteConfig?.siteId).toBeTruthy()

  const siteId = siteConfig?.siteId

  if (!siteId)
    throw new Error('siteId not found')

  site = await Site.create({ ...siteConfig, fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' })

  it('should upsert a region', async () => {
    const response = await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'upsert', siteId, fields: { ...fields, siteId: site.siteId, slug: 'r' }, orgId, userId, caller },
      { server: true },
    )

    expect(response.status).toBe('success')
    expect(response.data?.slug).toBe('r')
  })

  it('should not change viewId if cardId is the same', async () => {
    const response = await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'upsert', siteId, fields: { ...fields, siteId: site.siteId, slug: 'r' }, orgId, userId, caller },
      { server: true },
    )

    expect(response.status).toBe('success')
    expect(response.data?.slug).toBe('r')
  })

  it('should update region', async () => {
    const userConfig = { ...fields.userConfig, foo: 'bar' }
    const response = await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'upsert', siteId, fields: { ...fields, userConfig, siteId: site.siteId, slug: 'r' }, orgId, userId, caller },
      { server: true },
    )

    expect(response.status).toBe('success')
    expect(response.data?.userConfig).toEqual({ foo: 'bar' })
  })

  it('should iterate viewId if cardId is different', async () => {
    const response = await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'upsert', siteId, fields: { ...fields, cardId: 'another', siteId: site.siteId, slug: 'r' }, orgId, userId, caller },
      { server: true },
    )

    expect(response.status).toBe('success')
    expect(response.data?.slug).toBe('r-1')
  })

  it('should get a region successfully', async () => {
    await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'upsert', siteId, fields: { ...fields, siteId: site.siteId, cardId: 'xxx', slug: 'yyy' }, orgId, userId, caller },
      { server: true },
    )

    const r = await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'retrieve', siteId, fields: { siteId: site.siteId, cardId: 'xxx' }, orgId, userId, caller },
      { server: true },
    )

    expect(r.status).toBe('success')
    expect(r.data?.slug).toBe('yyy')
  })

  it('should delete a region successfully', async () => {
    await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'upsert', siteId, fields: { ...fields, siteId: site.siteId, cardId: 'xxx', slug: 'yyy' }, orgId, userId, caller },
      { server: true },
    )

    const deleteResponse = await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'delete', siteId, fields: { siteId: site.siteId, cardId: 'xxx' }, orgId, userId, caller },
      { server: true },
    )

    expect(deleteResponse.status).toBe('success')
  })
})
