import type { InitializedTestUtils } from '@fiction/core/test-utils'
import type { TableSiteConfig } from '../tables'
import type { SiteTestUtils } from './testUtils'
import { objectId } from '@fiction/core'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createSiteTestUtils } from './testUtils'

describe('manageSite query', () => {
  let testUtils: SiteTestUtils
  let r: InitializedTestUtils
  let userId: string
  let orgId: string

  beforeEach(async () => {
    testUtils = await createSiteTestUtils()
    r = await testUtils.init()
    userId = r?.user?.userId ?? ''
    orgId = r?.user?.orgs?.[0]?.orgId ?? ''
  })

  afterEach(async () => {
    await testUtils.close()
  })

  const createSiteFields = (title: string) => ({
    title,
    themeId: 'test',
    subDomain: `test-${objectId({ prefix: 'sub' })}`,
  })

  describe('site creation', () => {
    it('should create a new site', async () => {
      const fields = createSiteFields('Test Site')
      const response = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'create', fields, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.title).toBe('Test Site')
      expect(response.data?.siteId).toBeTruthy()
      expect(response.data?.orgId).toBe(orgId)
    })

    it('should create a site with default pages', async () => {
      const fields = createSiteFields('Site with Pages')
      const response = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'create', fields, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.pages).toBeTruthy()
      expect(response.data?.pages?.length).toBeGreaterThan(0)
    })
  })

  describe('site retrieval', () => {
    let siteId: string

    beforeEach(async () => {
      const fields = createSiteFields('Retrieval Test Site')
      const response = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'create', fields, orgId, userId, caller: 'test' },
        { server: true },
      )
      siteId = response.data?.siteId as string
    })

    it('should retrieve a site by siteId', async () => {
      const response = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.siteId).toBe(siteId)
      expect(response.data?.title).toBe('Retrieval Test Site')
    })

    it('should return an error for non-existent site', async () => {
      const nonExistentSiteId = objectId({ prefix: 'sit' })
      const response = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'retrieve', where: { siteId: nonExistentSiteId }, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(response.status).toBe('error')
      expect(response.message).toContain('Site not found')
    })
  })

  describe('site update', () => {
    let siteId: string

    beforeEach(async () => {
      const fields = createSiteFields('Update Test Site')
      const response = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'create', fields, orgId, userId, caller: 'test' },
        { server: true },
      )
      siteId = response.data?.siteId as string
    })

    it('should update an existing site', async () => {
      const updateFields = { title: 'Updated Site Title' }
      const response = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'update', where: { siteId }, fields: updateFields, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.title).toBe('Updated Site Title')
    })

    it('should update site pages', async () => {
      const newPage = {
        templateId: 'wrap',
        title: 'New Page',
        slug: 'new-page',
      }
      const updateFields = { pages: [newPage] }
      const response = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'update', where: { siteId }, fields: updateFields, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.pages).toContainEqual(expect.objectContaining(newPage))
    })
  })

  describe('site draft handling', () => {
    let siteId: string
    let cardId: string
    let cardId2: string

    beforeEach(async () => {
      const fields = createSiteFields('Draft Test Site')
      const response = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'create', fields, orgId, userId, caller: 'test' },
        { server: true },
      )
      siteId = response.data?.siteId as string

      cardId = objectId({ prefix: 'card' })
      cardId2 = objectId({ prefix: 'card' })

      // Add a published page to the site
      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'upsert',
          siteId,
          fields: [
            { cardId, templateId: 'wrap', title: 'Published Page', slug: 'published-page' },
            { cardId: cardId2, templateId: 'wrap', title: 'Published Page 2', slug: 'published-page-2' },
          ],
          orgId,
          userId,
          caller: 'test',
          scope: 'publish',
        },
        { server: true },
      )
    })

    it('should save a draft for an existing site', async () => {
      const draftFields: Partial<TableSiteConfig> = { title: 'Draft Site Title', userConfig: { draftKey: 'draftValue' } }
      const response = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'saveDraft', where: { siteId }, fields: draftFields, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.title).toBe('Draft Site Title')
      expect(response.data?.userConfig?.draftKey).toBe('draftValue')
    })

    it('should retrieve a site with merged draft data when scope is draft', async () => {
      const draftFields = { title: 'Draft Site Title', userConfig: { draftKey: 'draftValue' } }
      await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'saveDraft', where: { siteId }, fields: draftFields, orgId, userId, caller: 'test' },
        { server: true },
      )

      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test', scope: 'draft' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.title).toBe('Draft Site Title')
      expect(response.data?.userConfig?.draftKey).toBe('draftValue')
    })

    it('should save and retrieve draft pages', async () => {
      const draftPage = { cardId, templateId: 'wrap', title: 'Draft Page', slug: 'draft-page' }
      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'saveDraft',
          siteId,
          fields: [draftPage],
          orgId,
          userId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      const response = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test', scope: 'draft' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.pages).toContainEqual(expect.objectContaining(draftPage))
    })

    it('should not return draft pages when retrieving with publish scope', async () => {
      const draftPage = { cardId, templateId: 'wrap', title: 'Draft Page', slug: 'draft-page' }
      await testUtils.fictionSites.queries.ManagePage.run(
        {
          _action: 'saveDraft',
          siteId,
          fields: [draftPage],
          orgId,
          userId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      const response = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test', scope: 'publish' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.pages).not.toContainEqual(expect.objectContaining(draftPage))
      expect(response.data?.pages).toContainEqual(expect.objectContaining({ title: 'Published Page', slug: 'published-page' }))
    })

    it('should merge site and page drafts when retrieving with draft scope', async () => {
      const siteDraft = { title: 'Draft Site Title' }
      const pageDraft = { cardId, templateId: 'wrap', title: 'Draft Page', slug: 'draft-page' }

      await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'saveDraft', where: { siteId }, fields: siteDraft, orgId, userId, caller: 'test' },
        { server: true },
      )

      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'saveDraft',
          siteId,
          fields: [pageDraft],
          orgId,
          userId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      const response = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test', scope: 'draft' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.title).toBe('Draft Site Title')
      // expect(response.data?.pages).toContainEqual(expect.objectContaining(pageDraft))
      expect(response.data?.pages.find(p => p.title === 'Draft Page')).toBeTruthy()
    })

    it('should maintain separate drafts for multiple pages', async () => {
      const draftPage1 = { cardId, templateId: 'wrap', title: 'Draft Page 1', slug: 'draft-page-1' }
      const draftPage2 = { cardId: cardId2, templateId: 'wrap', title: 'Draft Page 2', slug: 'draft-page-2' }

      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'saveDraft',
          siteId,
          fields: [draftPage1, draftPage2],
          orgId,
          userId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test', scope: 'draft' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.pages.find(p => p.title === 'Draft Page 1')).toBeTruthy()
      expect(response.data?.pages.find(p => p.title === 'Draft Page 2')).toBeTruthy()
    })

    it('should update existing page draft when saving a new draft', async () => {
      const initialDraft = { cardId, templateId: 'wrap', title: 'Initial Draft', slug: 'draft-page' }
      const updatedDraft = { cardId, templateId: 'wrap', title: 'Updated Draft', slug: 'draft-page' }

      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'saveDraft',
          siteId,
          fields: [initialDraft],
          orgId,
          userId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'saveDraft',
          siteId,
          fields: [updatedDraft],
          orgId,
          userId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      const response = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test', scope: 'draft' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.pages).toContainEqual(expect.objectContaining(updatedDraft))
      expect(response.data?.pages).not.toContainEqual(expect.objectContaining(initialDraft))
    })
  })

  describe('site draft reversion', () => {
    let siteId: string
    let cardId: string

    beforeEach(async () => {
      const fields = createSiteFields('Draft Reversion Test Site')
      const response = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'create', fields, orgId, userId, caller: 'test' },
        { server: true },
      )
      siteId = response.data?.siteId as string
      cardId = objectId({ prefix: 'card' })

      // Add a published page to the site
      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'upsert',
          siteId,
          fields: [{ cardId, templateId: 'wrap', title: 'Published Page', slug: 'published-page' }],
          orgId,
          userId,
          caller: 'test',
          scope: 'publish',
        },
        { server: true },
      )
    })

    it('should revert site and page drafts', async () => {
      // Create drafts for site and page
      const siteDraft = { title: 'Draft Site Title' }
      const pageDraft = { cardId, templateId: 'wrap', title: 'Draft Page Title', slug: 'published-page' }

      await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'saveDraft', where: { siteId }, fields: siteDraft, orgId, userId, caller: 'test' },
        { server: true },
      )

      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'saveDraft',
          siteId,
          fields: [pageDraft],
          orgId,
          userId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      // Revert drafts
      const revertResponse = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'revertDraft', where: { siteId }, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(revertResponse.status).toBe('success')
      expect(revertResponse.message).toMatchInlineSnapshot(`"Site reverted successfully"`)
      expect(revertResponse.message).toBeTruthy()

      // Verify site draft is reverted
      const siteResponse = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test', scope: 'draft' },
        { server: true },
      )

      expect(siteResponse.data?.title).not.toBe('Draft Site Title')

      // Verify page draft is reverted
      const pageResponse = await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'retrieve',
          where: [{ cardId }],
          siteId,
          orgId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      expect(pageResponse.data?.[0]?.title).toBe('Published Page')
    })

    it('should handle revert when no drafts exist', async () => {
      const revertResponse = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'revertDraft', where: { siteId }, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(revertResponse.status).toBe('success')
      expect(revertResponse.message).toMatchInlineSnapshot(`"Site reverted successfully"`)
      expect(revertResponse.message).toBeTruthy()
    })

    it('should throw an error when reverting non-existent site', async () => {
      const nonExistentSiteId = objectId({ prefix: 'sit' })
      await expect(testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'revertDraft', where: { siteId: nonExistentSiteId }, orgId, userId, caller: 'test' },
        { server: true },
      )).rejects.toThrowErrorMatchingInlineSnapshot(`[EndpointError: Site not found]`)
    })
  })

  describe('draft clearing on publish', () => {
    let siteId: string
    let cardId: string

    beforeEach(async () => {
      const fields = createSiteFields('Draft Clearing Test Site')
      const response = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'create', fields, orgId, userId, caller: 'test' },
        { server: true },
      )
      siteId = response.data?.siteId as string
      cardId = objectId({ prefix: 'card' })

      // Add a published page to the site
      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'upsert',
          siteId,
          fields: [{ cardId, templateId: 'wrap', title: 'Published Page', slug: 'published-page' }],
          orgId,
          userId,
          caller: 'test',
          scope: 'publish',
        },
        { server: true },
      )
    })

    it('should clear site and page drafts when publishing', async () => {
      // Create drafts for site and page
      const siteDraft = { title: 'Draft Site Title' }
      const pageDraft = { cardId, templateId: 'wrap', title: 'Draft Page Title', slug: 'published-page' }

      await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'saveDraft', where: { siteId }, fields: siteDraft, orgId, userId, caller: 'test' },
        { server: true },
      )

      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'saveDraft',
          siteId,
          fields: [pageDraft],
          orgId,
          userId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      // Publish the site
      const publishResponse = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'update', where: { siteId }, fields: { title: 'Published Site Title' }, orgId, userId, caller: 'test', scope: 'publish' },
        { server: true },
      )

      expect(publishResponse.status).toBe('success')
      expect(publishResponse.data?.title).toBe('Published Site Title')

      // Verify site draft is cleared
      const siteResponse = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test', scope: 'draft' },
        { server: true },
      )

      expect(siteResponse.data?.title).toBe('Published Site Title')
      expect(siteResponse.data?.draft).toBeUndefined()

      // Verify page draft is cleared
      const pageResponse = await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'retrieve',
          where: [{ cardId }],
          siteId,
          orgId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      expect(pageResponse.data?.[0]?.title).toBe('Published Page')
      expect(pageResponse.data?.[0]?.draft).toBeUndefined()
    })

    it('should not clear drafts when updating in draft mode', async () => {
      // Create drafts for site and page
      const siteDraft = { title: 'Draft Site Title' }
      const pageDraft = { cardId, templateId: 'wrap', title: 'Draft Page Title', slug: 'published-page' }

      await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'saveDraft', where: { siteId }, fields: siteDraft, orgId, userId, caller: 'test' },
        { server: true },
      )

      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'saveDraft',
          siteId,
          fields: [pageDraft],
          orgId,
          userId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      // Update the site in draft mode
      const updateResponse = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'update', where: { siteId }, fields: { title: 'Updated Draft Title' }, orgId, userId, caller: 'test', scope: 'draft' },
        { server: true },
      )

      expect(updateResponse.status).toBe('success')

      // Verify site draft is not cleared
      const siteResponse = await testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test', scope: 'draft' },
        { server: true },
      )

      expect(siteResponse.data?.title).toBe('Updated Draft Title')
      expect(siteResponse.data?.draft).toBeFalsy()

      // Verify page draft is not cleared
      const pageResponse = await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'retrieve',
          where: [{ cardId }],
          siteId,
          orgId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      expect(pageResponse.data?.[0]?.title).toBe('Draft Page Title')
      expect(pageResponse.data?.[0]?.draft).toBeFalsy()
    })
  })

  describe('edge cases and error handling', () => {
    it('should have correct error message for invalid theme', async () => {
      const fields = { ...createSiteFields('Invalid Theme Site'), themeId: 'non-existent-theme' }
      await expect(testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'create', fields, orgId, userId, caller: 'test' },
        { server: true },
      )).rejects.toThrowErrorMatchingInlineSnapshot(`[EndpointError: theme not found - themeId: non-existent-theme - available: empty, minimal, test]`)
    })

    it('should have correct error message for non-existent site update', async () => {
      const nonExistentSiteId = objectId({ prefix: 'sit' })
      const updateFields = { title: 'Updated Non-existent Site' }
      await expect(testUtils.fictionSites.queries.ManageSite.run(
        { _action: 'update', where: { siteId: nonExistentSiteId }, fields: updateFields, orgId, userId, caller: 'test' },
        { server: true },
      )).rejects.toThrowErrorMatchingInlineSnapshot(`[EndpointError: site not found]`)
    })
  })
})
