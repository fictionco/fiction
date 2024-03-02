/**
 * @vitest-environment happy-dom
 */

import { beforeAll, describe, expect, it } from 'vitest'
import { JSDOM } from 'jsdom'
import { Card } from '../../card'
import type { LayoutOrder } from '../layout'
import { getOrderRecursive, getSimpleOrderSchema, layoutOrderCards, orderCards } from '../layout'

describe('orderCards', async () => {
  it('should reorder regions and nested cards based on provided order', () => {
    // Mock data setup
    const card1 = new Card({ cardId: 'card1', cards: [{ cardId: 'cardA', templateId: 'area' }] })
    const card2 = new Card({ cardId: 'card2', slug: '_default', cards: [{ cardId: 'cardB', templateId: 'area' }] })
    const card3 = new Card({ cardId: 'card3', cards: [{ cardId: 'cardC', templateId: 'hero' }] })
    const cards = [card1, card2, card3]

    const order = [
      { itemId: 'card1', items: [{ itemId: 'cardB' }] },
      { itemId: 'card2' },
      {
        itemId: 'card3',
        items: [
          { itemId: 'cardA', items: [{ itemId: 'cardC' }] }, // nested card1 inside card3
        ],
      },
    ]

    // Call the function
    const orderedRegions = orderCards({ cards, order })

    // Assertions
    expect(orderedRegions[0].cardId).toBe('card1')
    expect(orderedRegions[1].cards.value.length).toBe(0)
    expect(orderedRegions[2].cards.value[0].cardId).toBe('cardA')
    expect(orderedRegions[2].cards.value[0].cards.value[0].cardId).toBe('cardC')
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
