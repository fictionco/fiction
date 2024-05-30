import { describe, expect, it, vi } from 'vitest'
import { vue, waitFor } from '@fiction/core'
import { createSiteTestUtils } from '../../test/testUtils'
import { Card } from '../../card'
import { activePageId, getPageById, getViewMap } from '../page'
import { Site } from '../../site'

describe('getViewMap', async () => {
  it('should map card slugs to cardIds correctly', () => {
    const pages = [
      new Card({ cardId: 'id1', slug: '_home', title: 'Default Page', regionId: 'main', templateId: 'engine' }),
      new Card({ cardId: 'id2', slug: 'example', title: 'Example Page', regionId: 'main', templateId: 'engine' }),
      new Card({ cardId: 'id3', slug: '_404', title: 'Foo Page', regionId: 'main', templateId: 'engine' }),
    ]

    const map = getViewMap({ pages })
    expect(map).toEqual({
      _: 'id1',
      _home: 'id1',
      example: 'id2',
      _404: 'id3',
    })
  })

  it('should handle cases where slug is set to special', async () => {
    const pages = [
      new Card({ cardId: 'id1', slug: '_home', title: 'Default Page', regionId: 'main', templateId: 'engine', isHome: true }),
      new Card({ cardId: 'id2', slug: 'example', title: 'Example Page', regionId: 'main', templateId: 'engine' }),
      new Card({ cardId: 'id3', slug: '_404', title: 'Foo Page', regionId: 'main', templateId: 'engine' }),
    ]

    const map = getViewMap({ pages })
    expect(map).toEqual({
      _: 'id1',
      _home: 'id1',
      example: 'id2',
      _404: 'id3',
    })
  })

  it('should set home and 404 to undefined if missing', async () => {
    const pages = [
      new Card({ cardId: 'id1', slug: 'def', title: 'Default Page', regionId: 'main', templateId: 'engine' }),
      new Card({ cardId: 'id2', slug: 'example', title: 'Example Page', regionId: 'main', templateId: 'engine' }),
    ]

    const map = getViewMap({ pages })
    expect(map).toEqual({
      _: undefined,
      _home: undefined,
      def: 'id1',
      example: 'id2',
      _404: undefined,
    })
  })
})

describe('activePageId', async () => {
  const testUtils = await createSiteTestUtils()

  const siteRouter = testUtils.fictionRouterSites
  const viewMapRef = vue.ref<Record<string, string>>({
    example: 'id2',
    foo: 'bar',
    _404: 'id3',
    _home: 'id1',
  })

  // Create a spy on the router's push method if needed
  const pushSpy = vi.spyOn(siteRouter, 'push')

  const computedPageId = activePageId({ siteRouter, viewMapRef })

  it('get: should return the correct page ID for a given viewId', async () => {
    // Mocking the current value of the siteRouter
    await siteRouter.push('/example', { caller: 'test' })

    expect(computedPageId.value).toEqual('id2')
  })

  it('get: should return the _404 page ID if the viewId does not exist in the viewMap', async () => {
    // Mocking the current value of the siteRouter to a non-existing viewId
    await siteRouter.push('/non-existing-view', { caller: 'test' })

    await waitFor(15)

    // The getter should return the _404 page ID
    expect(computedPageId.value).toEqual('id3')
  })

  it('get: should return the _home page ID if the viewId is not provided', async () => {
    // Mocking the current value of the siteRouter without viewId
    await siteRouter.push('/', { caller: 'test' })

    await waitFor(15)

    // The getter should return the _home page ID
    expect(computedPageId.value).toEqual('id1')
  })

  it('set: should set the correct route for a given cardId', async () => {
    computedPageId.value = 'bar'

    await waitFor(15)

    expect(siteRouter.current.value.path).toEqual('/foo')
  })

  it('set: should set home (/) for _home cardId', async () => {
    computedPageId.value = 'id1'

    await waitFor(15)
    // Check if the push method was called with the correct argument
    expect(siteRouter.current.value.path).toEqual('/')
  })

  it('should handle non-existing cardId by pushing the _404 route', async () => {
    pushSpy.mockClear()

    computedPageId.value = 'nonExistingCardId'

    await waitFor(15)

    // Check if the push method was called with the _404 argument
    expect(pushSpy).toHaveBeenCalledWith('/not-found', expect.any(Object))
    expect(siteRouter.current.value.path).toEqual('/not-found')
  })

  it('reactivity: should handle modified viewMap', async () => {
    viewMapRef.value = {
      ...viewMapRef.value,
      alpha: 'bravoCardId',
      charlie: 'deltaCardId',
    }

    computedPageId.value = 'bravoCardId'

    await waitFor(30)

    expect(siteRouter.current.value.path).toEqual('/alpha')

    await siteRouter.push('/charlie', { caller: 'reactivity:test' })

    await waitFor(30)

    expect(computedPageId.value).toEqual('deltaCardId')
  })
})

describe('getActivePage', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' }

  // Mock Cards
  const pages = [
    new Card({ cardId: 'id1', title: 'First Page', slug: 'first-page' }),
    new Card({ cardId: 'id2', title: 'Second Page', slug: 'second-page' }),
  ].map(_ => _.toConfig())

  const site = new Site({ pages, ...common })

  it('should return the correct Card for a valid pageId', () => {
    const pageId = 'id1'
    const activeCard = getPageById({ pageId, site })

    expect(activeCard).toBeDefined()
    expect(activeCard.cardId).toBe('id1')
    expect(activeCard.title.value).toBe('First Page')
  })

  it('should return a 404 Card for a non-existing pageId', () => {
    const pageId = 'non-existing-page'
    const activeCard = getPageById({ pageId, site })

    expect(activeCard).toBeDefined()
    expect(activeCard.cardId).toBe('_special404')
    expect(activeCard.title.value).toBe('404')
    // More assertions can be added here to check the structure of the 404 Card
  })
})
