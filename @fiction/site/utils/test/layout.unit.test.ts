/**
 * @vitest-environment happy-dom
 */

import { shortId } from '@fiction/core'
import { JSDOM } from 'jsdom'
import { beforeAll, describe, expect, it } from 'vitest'
import { Card } from '../../card'
import { Site } from '../../site'
import { createSiteTestUtils } from '../../test/testUtils'
import { getOrderRecursive, getSimpleOrderSchema, layoutOrderCards, setLayoutOrder } from '../layout'
import type { CardConfigPortable } from '../../tables'
import type { LayoutOrder } from '../layout'

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
    const page1 = new Card({ cardId: 'page1', cards: [{ cardId: 'cardA', templateId: 'area' }] })
    const page2 = new Card({ cardId: 'page2', slug: 'foo', isHome: true, cards: [{ cardId: 'cardB', templateId: 'area' }] })
    const page3 = new Card({ cardId: 'page3', cards: [{ cardId: 'cardC', templateId: 'hero' }] })
    const cardHeader = new Card({ cardId: 'header', cards: [{ cardId: 'headerA', templateId: 'area' }] }).toConfig()
    const cardFooter = new Card({ cardId: 'footer', cards: [{ cardId: 'footerA', templateId: 'area' }] }).toConfig()

    const pages = [page1, page2, page3].map(c => c.toConfig())
    const sections: Record<string, CardConfigPortable> = { header: cardHeader, footer: cardFooter }
    const site = await Site.create({ pages, sections, ...common })

    const order = [
      { itemId: 'page2', items: [{ itemId: 'cardB' }, { itemId: 'cardC' }] },
      { itemId: 'header', items: [{ itemId: 'headerA' }] },
      { itemId: 'footer', items: [{ itemId: 'cardA' }, { itemId: 'footerA' }] },
    ]

    setLayoutOrder({ site, order })

    // Assertions to verify the correct order
    // -- You'll need to adjust these based on the actual structure and access methods of your Site and Card classes
    expect(site.pages.value.find(p => p.cardId === 'page2')?.cards.value.map(c => c.cardId)).toEqual(['cardB', 'cardC'])
    expect(site.sections.value.header?.cards.value.map(c => c.cardId)).toEqual(['headerA'])
    expect(site.sections.value.footer?.cards.value.map(c => c.cardId)).toEqual(['cardA', 'footerA'])

    const order2 = [
      { itemId: 'page2', items: [{ itemId: 'cardC' }, { itemId: 'cardA' }] },
      { itemId: 'page3', items: [{ itemId: 'cardA' }, { itemId: 'cardB' }] },
    ]

    setLayoutOrder({ site, order: order2 })

    await site.addCard({ cardId: 'cardD', templateId: 'hero', addToCardId: 'page3', location: 'top' })

    expect(site.pages.value.find(p => p.cardId === 'page2')?.cards.value.map(c => c.cardId)).toEqual(['cardC', 'cardA'])
    expect(site.pages.value.find(p => p.cardId === 'page3')?.cards.value.map(c => c.cardId)).toEqual(['cardD', 'cardA', 'cardB'])
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
