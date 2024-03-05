import type { Card } from '../card'
import type { Site } from '../site'

export const selectors = {
  dragZone: '[data-drag-zone]',
  dragDepth: (depth: number) => `[data-drag-depth="${depth}"]`,
  handleId: '[data-handle-id]',
  regionId: '[data-region-id]',
}

// type is 'region' or 'card-1' or 'card-2' etc depth is number
export type LayoutOrder = { type?: string, itemId: string, items?: LayoutOrder[] }

export function getSimpleOrderSchema(crd: LayoutOrder[]): string {
  return crd.map((c) => {
    const subItems = c.items?.length ? `[${getSimpleOrderSchema(c.items)}]` : ''
    return `${c.itemId}${subItems}`
  }).join(',')
}

export function flattenCards(cardsToFlatten: Card[]): Card[] {
  return cardsToFlatten.flatMap(card =>
    [card, ...flattenCards(card.cards?.value || [])],
  ).filter(Boolean)
}

export function layoutOrderCards(args: { availableCards: Card[], order: LayoutOrder[] }): Card[] {
  const { availableCards, order } = args

  // Function to flatten all cards, including nested ones

  const allCards = flattenCards(availableCards)

  function reorder(args: { order?: LayoutOrder[] }): Card[] {
    const { order = [] } = args

    const newCards: Card[] = []

    if (order.length) {
      order.forEach((item) => {
        const card = allCards.find(c => c.cardId === item.itemId)

        if (!card)
          throw new Error(`Could not find card with id ${item.itemId}`)

        card.cards.value = reorder({ order: item.items })
        newCards.push(card)
      })
    }

    return newCards
  }

  return reorder({ order })
}

export function setLayoutOrder(args: { site: Site, order: LayoutOrder[] }) {
  const { site, order } = args
  const availableCards = flattenCards([...site.pages.value, ...Object.values(site.sections.value)])
  order.forEach((regionOrder) => {
    const ind = availableCards.findIndex(r => r.cardId === regionOrder.itemId)
    if (ind > -1) {
      const ordered = layoutOrderCards({ availableCards, order: regionOrder.items || [] })

      availableCards[ind].cards.value = ordered
    }
  })
}

export function getOrderRecursive(args: { depth?: number, parentEl: Element }): LayoutOrder[] {
  const { depth = 0, parentEl } = args

  // If the depth is 0, we're looking at the top-level regions
  if (depth === 0) {
    const regions = Array.from(parentEl.querySelectorAll(selectors.regionId))
    return regions.map((region) => {
      const r = region as HTMLElement
      return {
        type: 'region',
        itemId: r.dataset.regionId || 'no_id',
        items: getOrderRecursive({ depth: depth + 1, parentEl: r }),
      }
    })
  }

  const depthSelector = selectors.dragDepth(depth)

  // Otherwise, we're looking inside a drag zone
  const containers = parentEl.querySelectorAll(`:scope ${selectors.dragZone}${depthSelector}`)
  const out: LayoutOrder[] = []

  containers.forEach((container) => {
    const els = Array.from(container.querySelectorAll(`${depthSelector} > ${selectors.handleId}`))

    els.forEach((element) => {
      const el = element as HTMLElement
      const itemId = el.dataset.handleId || 'no_id'
      const newDepth = depth + 1
      const items = getOrderRecursive({ depth: newDepth, parentEl: el })
      out.push({ itemId, items, type: `card-${depth}` })
    })
  })

  return out
}
