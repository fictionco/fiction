import { describe, expect, it } from 'vitest'
import { Card } from '../card'
import { Site } from '../site'
import type { Theme } from '../theme'
import type { SiteTestUtils } from './siteTestUtils'
import { createSiteTestUtils } from './siteTestUtils'
import { setup } from './test-theme'

let testUtils: SiteTestUtils
let orgId: string
let userId: string
let site: Site
let siteId: string
let testTheme: Theme

const fields = new Card({
  regionId: 'main',
  templateId: 'wrap',
  title: 'Example',
  cards: [{ templateId: 'hero' }],
}).toConfig()

const caller = 'test'
describe('upsert action', async () => {
  testUtils = await createSiteTestUtils()
  testTheme = setup(testUtils)
  const r = await testUtils.init()
  userId = r?.user?.userId ?? ''
  orgId = r?.user?.orgs?.[0]?.orgId ?? ''

  describe('upsert action', () => {
    it('create site', async () => {
      const m = testUtils.fictionSites.queries.ManageSite
      const r = await m.serve({
        _action: 'create',
        userId,
        orgId,
        fields: { themeId: testTheme.themeId },
      }, { server: true })

      const siteConfig = r.data
      expect(siteConfig?.siteId).toBeTruthy()

      site = new Site({ ...siteConfig, fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' })
      siteId = site.siteId
    })

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
})
