import type { InitializedTestUtils } from '@fiction/core/test-utils'
import type { TableCardConfig } from '../tables'
import type { SiteTestUtils } from './testUtils'
import { objectId } from '@fiction/core'
import { beforeEach, describe, expect, it } from 'vitest'
import { Card } from '../card'
import { Site } from '../site'
import { setup } from './test-theme'
import { createSiteTestUtils } from './testUtils'

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

  const site = await Site.create({
    ...siteConfig,
    fictionSites: testUtils.fictionSites,
    siteRouter: testUtils.fictionRouterSites,
    themeId: 'test',
    siteId,
  })

  return site
}

describe('managePage query', async () => {
  const testUtils = await createSiteTestUtils()
  const r = await testUtils.init()
  const userId = r?.user?.userId ?? ''
  const orgId = r?.user?.orgs?.[0]?.orgId ?? ''
  const site = await getDbSite(testUtils, r)
  const siteId = site.siteId

  const createPageFields = (title: string) => new Card({
    regionId: 'main',
    templateId: 'wrap',
    title,
    cards: [{ templateId: 'hero' }],
  }).toConfig()

  const caller = 'test'

  describe('special slug handling for _home', async () => {
    const caller = 'test'
    it('should rename existing _home to old-home if a new _home is created', async () => {
      const pg = site.pages.value.find(p => p.slug.value === '_home')
      const fields = createPageFields('Home Page')
      await testUtils.fictionSites.queries.ManagePage.run(
        { _action: 'upsert', siteId, fields: [{ ...fields, cardId: pg?.cardId, siteId, slug: '_home' }], orgId, userId, caller, scope: 'publish' },
        { server: true },
      )

      // Verify that old-home doesn't exist
      const response1 = await testUtils.fictionSites.queries.ManagePage.serve(
        { _action: 'retrieve', siteId, where: [{ slug: 'old-home' }], orgId, userId, caller, scope: 'publish' },
        { server: true },
      )

      expect(response1.status).toBe('error')
      expect(response1.data?.length).toBe(0)

      // Attempt to create another page with the same slug '_home'
      await testUtils.fictionSites.queries.ManagePage.run(
        { _action: 'upsert', siteId, fields: [{ ...fields, cardId: objectId(), siteId, slug: '_home' }], orgId, userId, caller, scope: 'publish' },
        { server: true },
      )

      // Verify that the first page's slug has been renamed to 'old-home'
      const response2 = await testUtils.fictionSites.queries.ManagePage.serve(
        { _action: 'retrieve', siteId, where: [{ slug: 'old-home' }], orgId, userId, caller, scope: 'publish' },
        { server: true },
      )

      expect(response2.status).toBe('success')
      expect(response2.data?.[0]?.slug).toMatchInlineSnapshot(`"old-home"`)

      // Assuming the renaming and iteration logic is correctly implemented
      // After creating two _home pages and having the first renamed to 'old-home'
      // Create a third page with slug '_home'
      await testUtils.fictionSites.queries.ManagePage.run(
        { _action: 'upsert', siteId, fields: [{ ...fields, cardId: objectId(), siteId, slug: '_home' }], orgId, userId, caller, scope: 'publish' },
        { server: true },
      )

      // Verify the second _home page's slug has been renamed to 'old-home-1'
      const response3 = await testUtils.fictionSites.queries.ManagePage.run(
        { _action: 'retrieve', siteId, where: [{ slug: 'old-home-1' }], orgId, userId, caller, scope: 'publish' },
        { server: true },
      )

      expect(response3.status).toBe('success')
      expect(response3.data?.[0]?.slug).toBe('old-home-1')
    })

    it('should handle creation of a page with a slug starting with underscore other than _home', async () => {
      const fields = createPageFields('About Page')
      // Create a page with slug '_about'
      const response = await testUtils.fictionSites.queries.ManagePage.run(
        { _action: 'upsert', siteId, fields: [{ ...fields, siteId: site.siteId, slug: '_about' }], orgId, userId, caller, scope: 'publish' },
        { server: true },
      )

      expect(response.status).toBe('success')
      // The slug should be directly transformed to 'old-about' without needing iteration
      expect(response.data?.[0]?.slug).toBe('_about')
    })
  })

  describe('draft handling', () => {
    let pageId: string

    beforeEach(async () => {
      const fields = createPageFields('Test Page')
      const response = await testUtils.fictionSites.queries.ManagePage.run(
        { _action: 'upsert', siteId, fields: [fields], orgId, userId, caller, scope: 'publish' },
        { server: true },
      )
      if (!response.data?.[0]?.cardId)
        throw new Error('cardId not found')

      pageId = response.data?.[0]?.cardId
    })

    it('should save a draft for an existing page', async () => {
      const draftFields = createPageFields('Draft Test Page')
      draftFields.cardId = pageId
      draftFields.userConfig = { draftKey: 'draftValue' }

      const response = await testUtils.fictionSites.queries.ManagePage.run(
        { _action: 'saveDraft', siteId, fields: [draftFields], orgId, userId, caller, scope: 'draft' },
        { server: true },
      )

      const pg = response.data?.[0] as TableCardConfig

      expect(response.status).toBe('success')
      expect(pg).toBeDefined()
      expect(pg?.title).toBe('Draft Test Page')
      expect(pg?.userConfig?.draftKey).toBe('draftValue')
    })

    it('should retrieve a page with merged draft data when scope is draft', async () => {
      // First, save a draft
      const draftFields = createPageFields('Draft Test Page')
      draftFields.cardId = pageId
      draftFields.userConfig = { draftKey: 'draftValue' }

      await testUtils.fictionSites.queries.ManagePage.run(
        { _action: 'saveDraft', siteId, fields: [draftFields], orgId, userId, caller, scope: 'draft' },
        { server: true },
      )

      // Now retrieve the page with draft scope
      const response = await testUtils.fictionSites.queries.ManagePage.run(
        { _action: 'retrieve', siteId, where: [{ cardId: pageId }], orgId, userId, caller, scope: 'draft' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.[0]?.title).toBe('Draft Test Page')
      expect(response.data?.[0]?.userConfig?.draftKey).toBe('draftValue')
    })

    it('should not merge draft data when scope is publish', async () => {
      // First, save a draft
      const draftFields = createPageFields('Draft Test Page')
      draftFields.cardId = pageId
      draftFields.userConfig = { draftKey: 'draftValue' }

      await testUtils.fictionSites.queries.ManagePage.run(
        { _action: 'saveDraft', siteId, fields: [draftFields], orgId, userId, caller, scope: 'draft' },
        { server: true },
      )

      // Now retrieve the page with publish scope
      const response = await testUtils.fictionSites.queries.ManagePage.run(
        { _action: 'retrieve', siteId, where: [{ cardId: pageId }], orgId, userId, caller, scope: 'publish' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.[0]?.title).toBe('Test Page')
      expect(response.data?.[0]?.userConfig?.draftKey).toBeUndefined()
    })
  })

  describe('page retrieval and updates', () => {
    it('should retrieve a page by slug', async () => {
      const fields = createPageFields('Slug Test Page')
      fields.slug = 'test-slug'

      await testUtils.fictionSites.queries.ManagePage.run(
        { _action: 'upsert', siteId, fields: [fields], orgId, userId, caller, scope: 'publish' },
        { server: true },
      )

      const response = await testUtils.fictionSites.queries.ManagePage.run(
        { _action: 'retrieve', siteId, where: [{ slug: 'test-slug' }], orgId, userId, caller, scope: 'publish' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.[0]?.title).toBe('Slug Test Page')
    })

    it('should update an existing page', async () => {
      const fields = createPageFields('Update Test Page')
      const createResponse = await testUtils.fictionSites.queries.ManagePage.run(
        { _action: 'upsert', siteId, fields: [fields], orgId, userId, caller, scope: 'publish' },
        { server: true },
      )

      const pageId = createResponse.data?.[0]?.cardId

      if (!pageId)
        throw new Error('pageId not found')

      const updateFields = { cardId: pageId, title: 'Updated Test Page' }
      const updateResponse = await testUtils.fictionSites.queries.ManagePage.run(
        { _action: 'update', siteId, where: [{ cardId: pageId }], fields: updateFields, orgId, userId, caller, scope: 'publish' },
        { server: true },
      )

      expect(updateResponse.status).toBe('success')
      expect(updateResponse.data?.[0]?.title).toBe('Updated Test Page')
    })
  })

  describe('page listing and deletion', () => {
    it('should list pages with pagination', async () => {
      // Create multiple pages
      for (let i = 0; i < 5; i++) {
        const fields = createPageFields(`List Test Page ${i}`)
        await testUtils.fictionSites.queries.ManagePage.run(
          { _action: 'upsert', siteId, fields: [fields], orgId, userId, caller, scope: 'publish' },
          { server: true },
        )
      }

      const response = await testUtils.fictionSites.queries.ManagePage.run(
        { _action: 'list', siteId, limit: 3, offset: 0, orgId, userId, caller, scope: 'publish' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.length).toBe(3)
      expect(response.indexMeta?.count).toBeGreaterThanOrEqual(5)
    })

    it('should delete a page', async () => {
      const fields = createPageFields('Delete Test Page')
      const createResponse = await testUtils.fictionSites.queries.ManagePage.run(
        { _action: 'upsert', siteId, fields: [fields], orgId, userId, caller, scope: 'publish' },
        { server: true },
      )

      const pageId = createResponse.data?.[0]?.cardId

      if (!pageId)
        throw new Error('pageId not found')

      const deleteResponse = await testUtils.fictionSites.queries.ManagePage.run(
        { _action: 'delete', siteId, where: [{ cardId: pageId }], orgId, userId, caller, scope: 'publish' },
        { server: true },
      )

      expect(deleteResponse.status).toBe('success')
      expect(deleteResponse.data?.[0]?.cardId).toBe(pageId)

      // Verify the page is deleted
      const retrieveResponse = await testUtils.fictionSites.queries.ManagePage.run(
        { _action: 'retrieve', siteId, where: [{ cardId: pageId }], orgId, userId, caller, scope: 'publish' },
        { server: true },
      )

      expect(retrieveResponse.status).toBe('error')
      expect(retrieveResponse.data?.length).toBe(0)
    })
  })
})

describe('upsert action', async () => {
  const testUtils = await createSiteTestUtils()
  const testTheme = await setup(testUtils)
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

  const caller = 'pageUpsertTest'

  const fields = new Card({
    regionId: 'main',
    templateId: 'wrap',
    title: 'Example',
    cards: [{ templateId: 'hero' }],
  }).toConfig()

  if (!siteId)
    throw new Error('siteId not found')

  const site = await Site.create({ ...siteConfig, fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' })

  it('should upsert a region', async () => {
    const response = await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'upsert', siteId, fields: [{ ...fields, siteId: site.siteId, slug: 'r' }], orgId, userId, caller, scope: 'publish' },
      { server: true },
    )

    expect(response.status).toBe('success')
    expect(response.data?.[0]?.slug).toBe('r')
  })

  it('should not change viewId if cardId is the same', async () => {
    const response = await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'upsert', siteId, fields: [{ ...fields, siteId: site.siteId, slug: 'r' }], orgId, userId, caller, scope: 'publish' },
      { server: true },
    )

    expect(response.status).toBe('success')
    expect(response.data?.[0]?.slug).toBe('r')
  })

  it('should update region', async () => {
    const userConfig = { ...fields.userConfig, foo: 'bar' }
    const response = await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'upsert', siteId, fields: [{ ...fields, userConfig, siteId: site.siteId, slug: 'r' }], orgId, userId, caller, scope: 'publish' },
      { server: true },
    )

    expect(response.status).toBe('success')
    expect(response.data?.[0]?.userConfig).toEqual({ foo: 'bar' })
  })

  it('should iterate viewId if cardId is different', async () => {
    const response = await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'upsert', siteId, fields: [{ ...fields, cardId: 'another', siteId: site.siteId, slug: 'r' }], orgId, userId, caller, scope: 'publish' },
      { server: true },
    )

    expect(response.status).toBe('success')
    expect(response.data?.[0]?.slug).toBe('r-1')
  })

  it('should get a region successfully', async () => {
    await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'upsert', siteId, fields: [{ ...fields, siteId: site.siteId, cardId: 'xxx', slug: 'yyy' }], orgId, userId, caller, scope: 'publish' },
      { server: true },
    )

    const r = await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'retrieve', siteId, where: [{ cardId: 'xxx' }], orgId, userId, caller, scope: 'publish' },
      { server: true },
    )

    expect(r.status).toBe('success')
    expect(r.data?.[0]?.slug).toBe('yyy')
  })

  it('should delete a region successfully', async () => {
    await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'upsert', siteId, fields: [{ ...fields, siteId: site.siteId, cardId: 'xxx', slug: 'yyy' }], orgId, userId, caller, scope: 'publish' },
      { server: true },
    )

    const deleteResponse = await testUtils.fictionSites.queries.ManagePage.run(
      { _action: 'delete', siteId, where: [{ cardId: 'xxx' }], orgId, userId, caller, scope: 'publish' },
      { server: true },
    )

    expect(deleteResponse.status).toBe('success')
  })
})
