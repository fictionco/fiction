import type { TableSiteConfig } from '../tables'
import { objectId } from '@fiction/core'
import { afterAll, describe, expect, it } from 'vitest'
import { createSiteTestUtils } from './testUtils'

describe('site revision handling', async () => {
  const testUtils = await createSiteTestUtils()
  const init = await testUtils.init()
  afterAll(() => testUtils.close())
  const { org, user } = init

  const userId = user.userId
  const orgId = org.orgId
  if (!userId)
    throw new Error('no user created')
  if (!orgId)
    throw new Error('no org created')

  // Create a test site for revision tests
  const fields: Partial<TableSiteConfig> = {
    orgId,
    userId,
    title: 'Revision Test Site',
    themeId: 'test',
    userConfig: {
      site: {
        description: 'Initial site description',
      },
    },
  } as const

  const response = await testUtils.fictionSites.queries.ManageSite.serve(
    { _action: 'create', fields, orgId, userId, caller: 'test' },
    { server: true },
  )

  const site = response.data

  if (!site) {
    throw new Error('Failed to create test site')
  }

  describe('revision creation', () => {
    it('should create a revision when publishing site changes', async () => {
      const updateFields = {
        title: `Updated Site Title ${objectId({ prefix: 'tst' })}`,
        userConfig: {
          site: {
            description: 'Updated site description',
          },
        },
      }

      await testUtils.fictionSites.queries.ManageSite.serve(
        {
          _action: 'update',
          where: { siteId: site.siteId },
          fields: updateFields,
          orgId,
          userId,
          caller: 'test',
          scope: 'publish',
        },
        { server: true },
      )

      const revisions = await testUtils.fictionRevision.queries.ManageRevision.serve({
        _action: 'list',
        where: { itemId: site.siteId },
        orgId,
        userId,
        caller: 'test',
      }, { server: true })

      expect(revisions.status).toBe('success')
      expect(revisions.data).toHaveLength(1)

      const rev = revisions.data?.[0]
      const userConfig = (rev?.itemData as TableSiteConfig).userConfig
      expect({ userConfig }).toMatchObject({
        userConfig: expect.objectContaining({
          site: expect.objectContaining({
            description: 'Updated site description',
          }),
        }),
      })
    })

    it('should create draft revisions at intervals', async () => {
      const originalInterval = testUtils.fictionRevision.draftMinInterval
      testUtils.fictionRevision.draftMinInterval = 0

      const uniquePrefix = objectId({ prefix: 'draft' })
      const changes = [1, 2, 3].map(i => ({
        title: `Draft Change ${uniquePrefix}-${i}`,
        description: `Draft ${i}`,
      }))

      for (const change of changes) {
        await testUtils.fictionSites.queries.ManageSite.serve(
          { _action: 'saveDraft', where: { siteId: site.siteId }, fields: change, orgId, userId, caller: 'test' },
          { server: true },
        )
      }

      const revisions = await testUtils.fictionRevision.queries.ManageRevision.serve({
        _action: 'list',
        where: { itemId: site.siteId },
        orgId,
        userId,
        caller: 'test',
      }, { server: true })

      testUtils.fictionRevision.draftMinInterval = originalInterval

      expect(revisions.status).toBe('success')

      expect(revisions.data?.filter(r => (r.itemData as TableSiteConfig).title?.includes(uniquePrefix))).toHaveLength(3)
    })
  })

  describe('revision restoration', () => {
    it('should restore a site to a specific revision', async () => {
      const uniqueId = objectId({ prefix: 'rev' })
      const initialUpdate = {
        title: `Initial Version ${uniqueId}`,
        userConfig: {
          site: {
            description: 'Initial published description',
          },
        },
      }

      await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'update', where: { siteId: site.siteId }, fields: initialUpdate, orgId, userId, caller: 'test', scope: 'publish' },
        { server: true },
      )

      const revisions = await testUtils.fictionRevision.queries.ManageRevision.serve({
        _action: 'list',
        where: { itemId: site.siteId },
        orgId,
        userId,
        caller: 'test',
      }, { server: true })

      const revisionId = revisions.data?.find(r => (r.itemData as TableSiteConfig).title?.includes(uniqueId))?.revisionId

      if (!revisionId) {
        throw new Error('Revision not found')
      }

      const laterUpdate = {
        title: `Later Version ${uniqueId}`,
        userConfig: {
          site: {
            description: 'Later description',
          },
        },
      }

      await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'update', where: { siteId: site.siteId }, fields: laterUpdate, orgId, userId, caller: 'test', scope: 'publish' },
        { server: true },
      )

      const restoreResponse = await testUtils.fictionSites.queries.ManageSite.serve(
        {
          _action: 'restoreFromRevision',
          where: { siteId: site.siteId },
          revisionId,
          orgId,
          userId,
          caller: 'test',
        },
        { server: true },
      )

      expect(restoreResponse.status).toBe('success')
      expect(restoreResponse.data?.title).toBe(`Initial Version ${uniqueId}`)
    })

    it('should create a backup revision before restoring', async () => {
      const uniqueId = objectId({ prefix: 'bak' })
      await testUtils.fictionSites.queries.ManageSite.serve(
        {
          _action: 'update',
          where: { siteId: site.siteId },
          fields: { title: `Version 1 ${uniqueId}` },
          orgId,
          userId,
          caller: 'test',
          scope: 'publish',
        },
        { server: true },
      )

      const revisions = await testUtils.fictionRevision.queries.ManageRevision.serve({
        _action: 'list',
        where: { itemId: site.siteId },
        orgId,
        userId,
        caller: 'test',
      }, { server: true })

      const revisionId = revisions.data?.find(r => (r.itemData as TableSiteConfig).title?.includes(uniqueId))?.revisionId

      if (!revisionId) {
        throw new Error('Revision not found')
      }

      await testUtils.fictionSites.queries.ManageSite.serve(
        {
          _action: 'update',
          where: { siteId: site.siteId },
          fields: { title: `Version 2 ${uniqueId}` },
          orgId,
          userId,
          caller: 'test',
          scope: 'publish',
        },
        { server: true },
      )

      await testUtils.fictionSites.queries.ManageSite.serve(
        {
          _action: 'restoreFromRevision',
          where: { siteId: site.siteId },
          revisionId,
          orgId,
          userId,
          caller: 'test',
        },
        { server: true },
      )

      const finalRevisions = await testUtils.fictionRevision.queries.ManageRevision.serve({
        _action: 'list',
        where: { itemId: site.siteId },
        orgId,
        userId,
        caller: 'test',
      }, { server: true })

      const backups = finalRevisions.data?.filter(r => r.title?.includes('Pre-restore backup'))
      expect(backups?.length).greaterThan(1)
    })

    it('should prevent restore with invalid revision ID', async () => {
      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        {
          _action: 'restoreFromRevision',
          where: { siteId: site.siteId },
          revisionId: `invalid-${objectId({ prefix: 'rev' })}`,
          orgId,
          userId,
          caller: 'test',
        },
        { server: true },
      )

      expect(response.status).toBe('error')
      expect(response).toMatchInlineSnapshot(`
        {
          "message": "Revision not found",
          "status": "error",
        }
      `)
      expect(response.message).toContain('Revision not found')
    })
  })
})
