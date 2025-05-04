/**
 * @vitest-environment happy-dom
 */

import type { CardConfigPortable } from '../../tables'
import type { LayoutOrder } from '../layout'
import { shortId, waitFor } from '@fiction/core'
import { JSDOM } from 'jsdom'
import { beforeAll, describe, expect, it } from 'vitest'
import { Card } from '../../card'
import { Site } from '../../site'
import { createSiteTestUtils } from '../../test/testUtils'
import { getOrderRecursive, getSimpleOrderSchema, layoutOrderCards, moveCard, setLayoutOrder } from '../layout'

describe('setLayoutOrder', async () => {
  const testUtils = await createSiteTestUtils()
  const common = {
    fictionSites: testUtils.fictionSites,
    siteRouter: testUtils.fictionRouterSites,
    siteMode: 'standard',
    themeId: 'test',
    siteId: `test-${shortId()}`,
  } as const
  it('should reorder regions and nested cards based on provided order', async () => {
    // Mock data setup
    const cardA = { cardId: 'cardA', templateId: 'cardPageAreaV1' }
    const cardB = { cardId: 'cardB', templateId: 'cardPageAreaV1' }
    const page1 = new Card({ cardId: 'page1', cards: [cardA, cardB] })
    const page2 = new Card({ cardId: 'page2', slug: 'foo', isHome: true, cards: [cardB, cardA] })
    const cardHeader = new Card({ cardId: 'header', cards: [{ cardId: 'headerA', templateId: 'cardPageAreaV1' }] }).toConfig()
    const cardFooter = new Card({ cardId: 'footer', cards: [{ cardId: 'footerA', templateId: 'cardPageAreaV1' }] }).toConfig()

    const pages = [page1, page2].map(c => c.toConfig())
    const sections: Record<string, CardConfigPortable> = { header: cardHeader, footer: cardFooter }
    const site = await Site.create({ pages, sections, ...common })

    site.activePageId.value = 'page2'

    const order = [
      { itemId: 'page2', items: [{ itemId: 'cardB' }, { itemId: 'cardA' }] },
      { itemId: 'header', items: [{ itemId: 'headerA' }] },
      { itemId: 'footer', items: [{ itemId: 'cardA' }, { itemId: 'footerA' }] },
    ]

    setLayoutOrder({ site, order })

    // Assertions to verify the correct order
    // -- You'll need to adjust these based on the actual structure and access methods of your Site and Card classes
    expect(site.pages.value.find(p => p.cardId === 'page2')?.cards.value.map(c => c.cardId)).toEqual(['cardB', 'cardA'])
    expect(site.sections.value.header?.cards.value.map(c => c.cardId)).toEqual(['headerA'])
    expect(site.sections.value.footer?.cards.value.map(c => c.cardId)).toEqual(['cardA', 'footerA'])

    const order2 = [
      { itemId: 'page2', items: [{ itemId: 'cardA' }, { itemId: 'cardB' }] },
    ]

    setLayoutOrder({ site, order: order2 })

    await site.addCard({ cardId: 'cardD', templateId: 'cardHeroV1', addToCardId: 'page2', location: 'top' })

    expect(site.pages.value.find(p => p.cardId === 'page2')?.cards.value.map(c => c.cardId)).toEqual(['cardD', 'cardA', 'cardB'])
  })
})

describe('layout handling', () => {
  beforeAll(async () => {

  })

  it('gets the right order from dom', async () => {
    const dom = new JSDOM(`<div class="parent">
                            <div data-region-id="x">
                              <div data-drag-zone data-drag-depth="1">
                                <div data-handle-id="aa"></div>
                                <div data-handle-id="bb">
                                  <div data-drag-zone data-drag-depth="2">
                                    <div data-handle-id="aaa"></div>
                                    <div data-handle-id="bbb"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div data-region-id="y">
                            <div data-drag-zone data-drag-depth="1">
                              <div data-handle-id="xx"></div>
                              <div data-handle-id="yy">
                                <div data-drag-zone data-drag-depth="2">
                                  <div data-handle-id="xxx"></div>
                                  <div data-handle-id="yyy"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                           `)

    const parentEl = dom.window.document.querySelector('.parent')
    if (!parentEl)
      throw new Error('no parentEl')

    const result = getOrderRecursive({ parentEl })

    const r = getSimpleOrderSchema(result)
    expect(r).toMatchInlineSnapshot(`"x[aa,bb[aaa,bbb]],y[xx,yy[xxx,yyy]]"`)

    expect(r).toBe('x[aa,bb[aaa,bbb]],y[xx,yy[xxx,yyy]]')

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "itemId": "x",
          "items": [
            {
              "itemId": "aa",
              "items": [],
              "type": "card-1",
            },
            {
              "itemId": "bb",
              "items": [
                {
                  "itemId": "aaa",
                  "items": [],
                  "type": "card-2",
                },
                {
                  "itemId": "bbb",
                  "items": [],
                  "type": "card-2",
                },
              ],
              "type": "card-1",
            },
          ],
          "regionId": "none",
          "type": "region",
        },
        {
          "itemId": "y",
          "items": [
            {
              "itemId": "xx",
              "items": [],
              "type": "card-1",
            },
            {
              "itemId": "yy",
              "items": [
                {
                  "itemId": "xxx",
                  "items": [],
                  "type": "card-2",
                },
                {
                  "itemId": "yyy",
                  "items": [],
                  "type": "card-2",
                },
              ],
              "type": "card-1",
            },
          ],
          "regionId": "none",
          "type": "region",
        },
      ]
    `)
  })

  it('reorders cards correct', async () => {
    const availableCards = [
      new Card({ cardId: 'a', cards: [
        new Card({ cardId: 'x', cards: [] }),
        new Card({ cardId: 'y' }),
        new Card({ cardId: 'z' }),
      ].map(c => c.toConfig()) }),
      new Card({ cardId: 'b' }),
      new Card({ cardId: 'c' }),
      new Card({ cardId: 'hello' }),
      new Card({ cardId: 'world' }),
    ]

    const order: LayoutOrder[] = [
      { itemId: 'a' },
      { itemId: 'c', items: [
        { itemId: 'b' },
        { itemId: 'x' },
        { itemId: 'y' },
        { itemId: 'z', items: [{ itemId: 'hello' }, { itemId: 'world' }] },
      ] },

    ]

    const newCards = layoutOrderCards({ availableCards, order })

    type CardInfo = { cardId?: string, cards: CardInfo[] }

    const result = newCards.map((c) => {
      const getDetails = (c: Card): CardInfo => {
        return {
          cardId: c.toConfig().cardId,
          cards: c.cards.value.map(c => getDetails(c)),
        }
      }
      return getDetails(c)
    })

    const getSimple = (crd: CardInfo[]): string => {
      return crd.map((c) => {
        const subItems = c.cards.length ? `[${getSimple(c.cards)}]` : ''
        return `${c.cardId}${subItems}`
      }).join(',')
    }

    expect(getSimple(result)).toMatchInlineSnapshot(`"a,c[b,x,y,z[hello,world]]"`)
    expect(getSimple(result)).toBe('a,c[b,x,y,z[hello,world]]')
  })
})

describe('moveCard', async () => {
  const testUtils = await createSiteTestUtils()
  const common = {
    fictionSites: testUtils.fictionSites,
    siteRouter: testUtils.fictionRouterSites,
    siteMode: 'standard',
    themeId: 'test',
    siteId: `test-${shortId()}`,
  } as const

  it('should move a card up within its parent container', async () => {
    // Setup a site with a parent page and child cards
    const cardA = { cardId: 'cardA', templateId: 'cardHeroV1' }
    const cardB = { cardId: 'cardB', templateId: 'cardHeroV1' }
    const cardC = { cardId: 'cardC', templateId: 'cardHeroV1' }
    const page = new Card({
      cardId: 'page1',
      slug: 'home',
      isHome: true,
      cards: [cardA, cardB, cardC],
    })

    const site = await Site.create({
      pages: [page.toConfig()],
      sections: {},
      ...common,
    })

    // Set active page
    site.activePageId.value = 'page1'

    // Get the card to move (middle card)
    const cardToMove = site.availableCards.value.find(c => c.cardId === 'cardB')

    // Move the card up
    moveCard({ card: cardToMove!, direction: 'up' })

    await waitFor(100)

    // Check that the card is now in the first position
    const updatedPage = site.pages.value.find(p => p.cardId === 'page1')
    expect(updatedPage?.cards.value.map(c => c.cardId)).toEqual(['cardB', 'cardA', 'cardC'])
  })

  it('should move a card down within its parent container', async () => {
    // Setup a site with a parent page and child cards
    const cardA = { cardId: 'cardA', templateId: 'cardHeroV1' }
    const cardB = { cardId: 'cardB', templateId: 'cardHeroV1' }
    const cardC = { cardId: 'cardC', templateId: 'cardHeroV1' }
    const page = new Card({
      cardId: 'page1',
      slug: 'home',
      isHome: true,
      cards: [cardA, cardB, cardC],
    })

    const site = await Site.create({
      pages: [page.toConfig()],
      sections: {},
      ...common,
    })

    // Set active page
    site.activePageId.value = 'page1'

    // Get the card to move (first card)
    const cardToMove = site.availableCards.value.find(c => c.cardId === 'cardA')

    // Move the card down
    moveCard({ card: cardToMove!, direction: 'down' })

    // Check that the card is now in the second position
    const updatedPage = site.pages.value.find(p => p.cardId === 'page1')
    expect(updatedPage?.cards.value.map(c => c.cardId)).toEqual(['cardB', 'cardA', 'cardC'])
  })

  it('should not move a card when already at edge position', async () => {
    // Setup a site with a parent page and child cards
    const cardA = { cardId: 'cardA', templateId: 'cardHeroV1' }
    const cardB = { cardId: 'cardB', templateId: 'cardHeroV1' }
    const page = new Card({
      cardId: 'page1',
      slug: 'home',
      isHome: true,
      cards: [cardA, cardB],
    })

    const site = await Site.create({
      pages: [page.toConfig()],
      sections: {},
      ...common,
    })

    // Set active page
    site.activePageId.value = 'page1'

    // Get the first card
    const firstCard = site.availableCards.value.find(c => c.cardId === 'cardA')

    // Try to move the top card up (should stay in place)
    moveCard({ card: firstCard!, direction: 'up' })

    // Check that the order hasn't changed
    const updatedPage = site.pages.value.find(p => p.cardId === 'page1')
    expect(updatedPage?.cards.value.map(c => c.cardId)).toEqual(['cardA', 'cardB'])
  })
})
