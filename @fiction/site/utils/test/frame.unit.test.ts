/**
 * @vitest-environment happy-dom
 */
import type { Mock } from 'vitest'
import type { FramePostMessageList } from '../frame'
import { shortId, waitFor } from '@fiction/core'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Card } from '../../card.js'
import { Site } from '../../site'
import { createSiteTestUtils } from '../../test/testUtils'

describe('siteFrameTools', async () => {
  const testUtils = await createSiteTestUtils()
  const common = {
    fictionSites: testUtils.fictionSites,
    siteRouter: testUtils.fictionRouterSites,
    themeId: 'test',
    siteId: `test-${shortId()}`,
    siteMode: 'designer' as const,
  }
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
    expect(site.frame.relation.value).toBe('parent')
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

  it('should sync route with pageCardId', () => {
    const pageCardId = 'test-page-card-id'
    site.frame.syncRoute({ pageCardId, siteId: site.siteId })
    expect(mockUtil.sendMessage).toHaveBeenCalledWith({
      message: { messageType: 'navigate', data: { pageCardId, siteId: site.siteId } },
    })
  })

  it('should generate correct frameUrl for editor mode', () => {
    // Set up a home page
    const homePage = new Card({
      title: 'Home',
      cardId: 'home-card-id',
      site,
      slug: '_home',
      isHome: true,
    })
    site.pages.value = [homePage]

    // Editor mode should use cardId-based URL
    expect(site.frame.frameUrl.value).toContain('_pageCardId=home-card-id')
    expect(site.frame.frameUrl.value).toContain('_scope=draft')
  })

  it('should generate correct framePageUrl', () => {
    const pageCardId = 'test-page-card'
    const url = site.frame.framePageUrl({ pageCardId, siteMode: 'standard' })

    expect(url).toContain('_pageCardId=test-page-card')
    expect(url).toContain('_siteMode=standard')
    expect(url).toContain('_scope=draft')
  })

  it ('should process frame messages correctly', async () => {
    const resetUiSpy = vi.spyOn(site.fictionSites.fictionEnv.events, 'emit')

    // Test resetUi message
    await site.frame.processFrameMessage({
      msg: { messageType: 'resetUi', data: { scope: 'all', cause: 'test', trigger: 'test' } },

    })
    expect(resetUiSpy).toHaveBeenCalledWith('resetUi', {
      scope: 'iframe',
      cause: expect.stringContaining('test'),
      trigger: 'test',
    })

    // Test setSite message
    const siteConfig = { title: 'New Title' }
    await site.frame.processFrameMessage({
      msg: { messageType: 'setSite', data: { siteConfig } },
    })
    expect(site.title.value).toBe('New Title')

    // Test setCard message
    const cardId = 'test-card-id'
    const cardConfig = { cardId, title: 'New Card Title' }
    const mockCard = new Card({ title: 'TestCard', cardId, site, slug: 'test-page' })
    vi.spyOn(mockCard, 'update')

    // Add the mock card to available cards
    site.pages.value = [mockCard]

    await site.frame.processFrameMessage({
      msg: { messageType: 'setCard', data: { cardConfig } },
    })
    expect(mockCard.update).toHaveBeenCalledWith(cardConfig, expect.any(Object))

    // Test setActiveCard message
    await site.frame.processFrameMessage({
      msg: { messageType: 'setActiveCard', data: { cardId: 'test-card-id' } },
    })
    expect(site.editor.value.selectedCardId).toBe('test-card-id')

    // Test navigate message with pageCardId
    await site.frame.processFrameMessage({
      msg: {
        messageType: 'navigate',
        data: { pageCardId: 'test-page-card', siteId: site.siteId },
      },
    })
    await waitFor(100) // Wait for any reactive updates
    expect(site.activePageId.value, 'navigate from frame message').toBe('test-page-card')
  })

  it('should handle frame ready message', async () => {
    const syncSiteSpy = vi.spyOn(site.frame, 'syncSite')

    await site.frame.processFrameMessage({
      msg: { messageType: 'frameReady', data: undefined },
    })

    expect(syncSiteSpy).toHaveBeenCalledWith({ caller: 'frameReady' })
  })

  it('should warn on unrecognized message type', async () => {
    const spy = vi.spyOn(site.frame.log, 'warn')

    // Test with an unrecognized message type
    await site.frame.processFrameMessage({
      msg: { messageType: 'unknownType', data: {} } as unknown as FramePostMessageList,
    })
    expect(spy).toHaveBeenCalledWith('Unknown message type', expect.anything())
  })

  it('should watch activePageId changes and sync route', async () => {
    const spyOnSync = vi.spyOn(site.frame, 'syncRoute')

    // Trigger activePageId change
    site.activePageId.value = 'new-page-card-id'

    await waitFor(50)

    expect(spyOnSync).toHaveBeenCalledWith({
      pageCardId: 'new-page-card-id',
      siteId: site.siteId,
    })
  })

  it('should handle setEditPath message', async () => {
    await site.frame.processFrameMessage({
      msg: {
        messageType: 'setEditPath',
        data: { cardId: 'test-card', path: 'test.path', caller: 'test' },
      },
    })

    expect(site.editor.value.editPath).toBe('test.path')
  })

  it('should handle setToolId message', async () => {
    const activateToolSpy = vi.spyOn(site, 'editorActivateTool')

    await site.frame.processFrameMessage({
      msg: { messageType: 'setToolId', data: { toolId: 'cardEdit' } },
    })

    expect(activateToolSpy).toHaveBeenCalledWith({ toolId: 'cardEdit' })
  })

  it('should handle historyEntry message', async () => {
    const saveStateSpy = vi.spyOn(site.history, 'saveState')
    const historyEntry = {
      description: 'test change',
      type: 'site' as const,
      siteConfig: { title: 'Test Title' },
      timestamp: Date.now(),
    }

    await site.frame.processFrameMessage({
      msg: { messageType: 'historyEntry', data: { historyEntry } },
    })

    expect(saveStateSpy).toHaveBeenCalledWith(historyEntry)
  })

  it('should ignore navigate message with wrong siteId', async () => {
    const initialPageId = site.activePageId.value

    await site.frame.processFrameMessage({
      msg: {
        messageType: 'navigate',
        data: { pageCardId: 'test-page', siteId: 'wrong-site-id' },
      },
    })

    // Should not change activePageId
    expect(site.activePageId.value).toBe(initialPageId)
  })

  it('should queue when no util is available', () => {
    site.frame.util = undefined

    site.frame.send({ msg: { messageType: 'setActiveCard', data: { cardId: 'test' } } })

    expect(site.frame.messageQueue.length).toBe(1)
  })
})

describe('previewUrl', async () => {
  const testUtils = await createSiteTestUtils()
  const common = {
    fictionSites: testUtils.fictionSites,
    siteRouter: testUtils.fictionRouterSites,
    themeId: 'test',
    siteId: `test-${shortId()}`,
  }

  it('should return the preview URL for the site', async () => {
    const site = await Site.create({
      ...common,
      isProd: true,
      subDomain: 'sub',
    })

    expect(site.frame.previewPath.value).toBeDefined()
    expect(site.frame.frameUrl.value).toContain(site.frame.previewPath.value)
  })
})
