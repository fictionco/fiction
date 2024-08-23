/**
 * @vitest-environment happy-dom
 */
import type { Mock } from 'vitest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { shortId, waitFor } from '@fiction/core'
import { Card } from '../../card.js'
import { Site } from '../../site'
import { createSiteTestUtils } from '../../test/testUtils'
import { activeSiteDisplayUrl } from '../site'
import type { FramePostMessageList } from '../frame'

describe('siteFrameTools', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test', siteId: `test-${shortId()}` }
  let site: Site
  let mockUtil: { sendMessage: Mock }

  beforeEach(async () => {
    site = await Site.create(common)
    mockUtil = {
      sendMessage: vi.fn(),
    }
    site.frame.setUtil(mockUtil as any)
  })

  it('should initialize frame tools correctly', () => {
    expect(site.frame.util).toBeDefined()
    expect(site.frame.relation.value).toBe('child')
  })

  it('should sync active card', () => {
    const cardId = 'test-card-id'
    site.frame.syncActiveCard({ cardId })
    expect(mockUtil.sendMessage).toHaveBeenCalledWith({
      message: { messageType: 'setActiveCard', data: { cardId } },
    })
  })

  it('should sync card', () => {
    const cardConfig = { cardId: 'test-card-id', templateId: 'test-template' }
    site.frame.syncCard({ caller: 'test', cardConfig })
    expect(mockUtil.sendMessage).toHaveBeenCalledWith({
      message: { messageType: 'setCard', data: { cardConfig, caller: 'test' } },
    })
  })

  it('should sync site', () => {
    site.frame.syncSite({ caller: 'test' })
    expect(mockUtil.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.objectContaining({
        messageType: 'setSite',
        data: expect.objectContaining({
          siteConfig: expect.objectContaining({ siteId: site.siteId }),
          caller: 'test',
        }),
      }),
    }))
  })

  it('should update frame URL', async () => {
    const newPath = '/new-path'
    site.frame.updateFrameUrl(newPath)
    await waitFor(30)
    expect(site.currentPath.value).toBe(newPath)
  })

  it('should process frame messages correctly', () => {
    const resetUiSpy = vi.spyOn(site.fictionSites.fictionEnv.events, 'emit')

    // Test resetUi message
    site.frame.processFrameMessage({ msg: { messageType: 'resetUi', data: undefined }, scope: 'parent' })
    expect(resetUiSpy, 'resetUi event should be emitted').toHaveBeenCalledWith('resetUi', { scope: 'iframe', cause: expect.any(String) })

    // Test setSite message
    const siteConfig = { title: 'New Title' }
    site.frame.processFrameMessage({ msg: { messageType: 'setSite', data: { siteConfig } }, scope: 'parent' })
    expect(site.title.value, 'site title should be updated').toBe('New Title')

    // Test setCard message
    const cardId = 'test-card-id'
    const cardConfig = { cardId, title: 'New Card Title' }
    const mockCard = new Card({ title: 'TestCard', cardId, site })
    vi.spyOn(mockCard, 'update')
    // Add the mock card to a page
    site.pages.value = [mockCard]
    site.frame.processFrameMessage({ msg: { messageType: 'setCard', data: { cardConfig } }, scope: 'parent' })
    expect(mockCard.update, 'card update should be called with correct config').toHaveBeenCalledWith(cardConfig)

    // Test setActiveCard message
    site.frame.processFrameMessage({ msg: { messageType: 'setActiveCard', data: { cardId: 'test-card-id' } }, scope: 'parent' })
    expect(site.editor.value.selectedCardId, 'selected card ID should be updated').toBe('test-card-id')

    // Test navigate message
    site.frame.processFrameMessage({ msg: { messageType: 'navigate', data: { urlOrPath: '/new-path', siteId: site.siteId } }, scope: 'parent' })
    expect(site.currentPath.value, 'current path should be updated').toBe('/new-path')
  })

  it('should handle frame ready message', () => {
    // Since there's no specific handler for frameReady, we'll just check if it doesn't throw an error
    expect(() => {
      site.frame.processFrameMessage({ msg: { messageType: 'frameReady', data: undefined }, scope: 'parent' })
    }).not.toThrow()
  })

  it('should warn on unrecognized message type', () => {
    const spy = vi.spyOn(site.frame.log, 'warn')

    // First, test with a recognized message type (shouldn't warn)
    site.frame.processFrameMessage({ msg: { messageType: 'setSite', data: { siteConfig: {} } }, scope: 'parent' })
    expect(spy).not.toHaveBeenCalled()

    // Now test with an unrecognized message type
    site.frame.processFrameMessage({
      msg: { messageType: 'unknownType', data: {} } as unknown as FramePostMessageList,
      scope: 'parent',
    })
    expect(spy).toHaveBeenCalledWith('Unrecognized message type', expect.anything())
  })

  it('should update framePath when currentPath changes (parent relation)', async () => {
    site.frame.relation.value = 'parent'

    site.currentPath.value = '/update-frame-path'
    expect(site.frame.relation.value).toMatchInlineSnapshot(`"parent"`)
    await waitFor(100)
    expect(site.frame.framePath.value).toBe('/update-frame-path')
  })

  it('should send navigate message when currentPath changes (child relation)', async () => {
    site.frame.relation.value = 'child'
    site.currentPath.value = '/send-nav-message-path'
    await waitFor(100)
    expect(mockUtil.sendMessage).toHaveBeenCalledWith({
      message: { messageType: 'navigate', data: { urlOrPath: '/send-nav-message-path', siteId: site.siteId } },
    })
  })
})

describe('previewUrl', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test', siteId: `test-${shortId()}` }
  it('should return the preview URL for the site', async () => {
    const site = await Site.create({ ...common, isProd: true, subDomain: 'sub' })

    expect(site.fictionSites.adminBaseRoute).toMatchInlineSnapshot(`"/admin"`)
    expect(site.frame.currentSiteFrameUrl.value).toBe(`${site.fictionSites.adminBaseRoute}/preview/site/${site.siteId}`)
  })
})

describe('activeSiteDisplayUrl', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test', siteId: `test-${shortId()}` }

  it('should return HTTPS URL for production site', async () => {
    testUtils.fictionAppSites.liveUrl.value = 'https://*.example.com'
    const site = await Site.create({ ...common, isProd: true, subDomain: 'sub' })

    expect(activeSiteDisplayUrl(site, { mode: 'display' }).value).toBe('https://sub.example.com')
  })

  it('should return HTTP URL with port for non-production site', async () => {
    testUtils.fictionAppSites.liveUrl.value = 'https://*.example.com'
    const port = testUtils.fictionAppSites.port.value
    const site = await Site.create({ ...common, isProd: false, subDomain: 'sub' })

    expect(activeSiteDisplayUrl(site, { mode: 'display' }).value).toBe(`http://sub.lan.com:${port}`)

    expect(activeSiteDisplayUrl(site, { mode: 'staging' }).value).toBe(`http://sub.lan.com:${port}`)
  })

  it('should return primary custom domain if available', async () => {
    testUtils.fictionAppSites.liveUrl.value = 'https://*.example.com'
    const site = await Site.create({ ...common, isProd: true, subDomain: 'sub', customDomains: [{ hostname: 'www.custom.com' }] })
    expect(activeSiteDisplayUrl(site, { mode: 'display' }).value).toBe('https://www.custom.com')

    expect(activeSiteDisplayUrl(site, { mode: 'staging' }).value).toBe('https://sub.example.com')
  })
})
