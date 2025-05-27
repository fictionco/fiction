import { shortId, waitFor } from '@fiction/core'
import { describe, expect, it, vi } from 'vitest'
import { Card } from '../../card'
import { Site } from '../../site'
import { createSiteTestUtils } from '../../test/testUtils'
import { activePageIdByRoute, getPageById, getPageWordCount, getViewMap } from '../page'

describe('getPageWordCount', () => {
  it('should count words in page userConfig', async () => {
    const page = {
      userConfig: {
        title: 'Welcome to site',
        description: 'This is a test page',
        content: 'Main content goes here',
      },
    }

    const count = await getPageWordCount({ page })
    expect(count).toBe(12)
  })

  it('should count words in nested card userConfigs', async () => {
    const page = {
      userConfig: {
        title: 'Parent Page',
      },
      cards: [
        {
          userConfig: {
            title: 'First Card',
            description: 'Card description here',
          },
        },
        {
          userConfig: {
            title: 'Second Card',
            content: 'More content text',
          },
        },
      ],
    }

    const count = await getPageWordCount({ page })
    expect(count).toBe(12)
  })

  it('should count taxonomy terms as single units', async () => {
    const page = {
      userConfig: {
        title: 'Blog Post',
        tags: ['web-development', 'user-interface'],
        categories: ['Tech Blog'],
      },
    }

    const count = await getPageWordCount({ page })
    expect(count).toBe(6)
  })

  it('should handle empty or invalid content', async () => {
    const page = {
      userConfig: {
        title: '',
        description: null,
        tags: [],
      },
    }

    const count = await getPageWordCount({ page })
    expect(count).toBe(0)
  })
})

describe('getViewMap', () => {
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

  it('should handle cases where slug is set to special', () => {
    const pages = [
      new Card({ cardId: 'id1', slug: 'home', title: 'Default Page', regionId: 'main', templateId: 'engine', isHome: true }),
      new Card({ cardId: 'id2', slug: 'example', title: 'Example Page', regionId: 'main', templateId: 'engine' }),
      new Card({ cardId: 'id3', slug: '_404', title: 'Foo Page', regionId: 'main', templateId: 'engine' }),
    ]

    const map = getViewMap({ pages })
    expect(map).toEqual({
      _: 'id1',
      example: 'id2',
      _404: 'id3',
    })
  })

  it('should set home and 404 correctly if missing', () => {
    const pages = [
      new Card({ cardId: 'id1', slug: 'def', title: 'Default Page', regionId: 'main', templateId: 'engine' }),
      new Card({ cardId: 'id2', slug: 'example', title: 'Example Page', regionId: 'main', templateId: 'engine' }),
    ]

    const map = getViewMap({ pages })
    expect(map).toEqual({
      _: 'id1', // Default to the first page as home
      def: 'id1',
      example: 'id2',
      _404: '_special404',
    })
  })
})

describe('activePageId', async () => {
  const testUtils = await createSiteTestUtils()
  const siteRouter = testUtils.fictionRouterSites

  const pages = [
    {
      cardId: 'id1',
      slug: 'home',
      isHome: true,
      title: 'Default Page',
      regionId: 'main',
      templateId: 'engine',
    },
    {
      cardId: 'id2',
      slug: 'example',
      title: 'Example Page',
      regionId: 'main',
      templateId: 'engine',
    },
    {
      cardId: 'id3',
      slug: '_404',
      title: 'Foo Page',
      regionId: 'main',
      templateId: 'engine',
    },
    {
      cardId: 'bar',
      slug: 'foo',
      title: 'Bar Page',
      regionId: 'main',
      templateId: 'engine',
    },
  ]

  const site = await testUtils.createSite({ pages })
  const computedPageId = activePageIdByRoute({ site })

  it('get: should return the correct page ID for a given viewId', async () => {
    await siteRouter.push('/example', { caller: 'test' })
    await waitFor(10)

    expect(computedPageId.value).toEqual('id2')
  })

  it('get: should return the _special404 page ID if the viewId does not exist in the viewMap', async () => {
    await siteRouter.push('/non-existing-view', { caller: 'test' })
    await waitFor(10)

    expect(computedPageId.value).toEqual('_special404')
  })

  it('get: should return the home page ID if the viewId is root', async () => {
    await siteRouter.push('/', { caller: 'test' })
    await waitFor(10)

    expect(computedPageId.value).toEqual('id1')
  })

  it('set: should set the correct route for a given cardId', async () => {
    computedPageId.value = 'bar'
    await waitFor(10)

    expect(siteRouter.current.value.path).toEqual('/foo')
  })

  it('set: should set home (/) for home cardId', async () => {
    computedPageId.value = 'id1'
    await waitFor(10)

    expect(siteRouter.current.value.path).toEqual('/')
  })

  it('set: should handle non-existing cardId gracefully', async () => {
    const pushSpy = vi.spyOn(siteRouter, 'push')
    pushSpy.mockClear()

    // Setting a non-existing cardId should not cause navigation
    // since the page lookup will fail and return early
    computedPageId.value = 'nonExistingCardId'
    await waitFor(10)

    // The setter should exit early for non-existing pages
    // so no navigation should occur
    expect(pushSpy).not.toHaveBeenCalled()
  })
})

describe('getPageById', async () => {
  const testUtils = await createSiteTestUtils()
  const common = {
    fictionSites: testUtils.fictionSites,
    siteRouter: testUtils.fictionRouterSites,
    themeId: 'test',
    siteId: `test-${shortId()}`,
  }

  const pages = [
    new Card({ cardId: 'id1', title: 'First Page', slug: 'first-page' }),
    new Card({ cardId: 'id2', title: 'Second Page', slug: 'second-page' }),
  ].map(_ => _.toConfig())

  const site = await Site.create({ pages, ...common })

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
    expect(activeCard.title.value).toBe('Not Found')
    expect(activeCard.templateId.value).toBe('cardPageWrapV1')
  })

  it('should return 404 Card with correct structure', () => {
    const pageId = 'another-non-existing-page'
    const activeCard = getPageById({ pageId, site })

    expect(activeCard.cards.value).toHaveLength(1)
    expect(activeCard.cards.value[0].templateId.value).toBe('card404ErrorV1')
    expect(activeCard.cards.value[0].userConfig.value).toEqual({ heading: 'Nothing here' })
  })
})
