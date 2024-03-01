import type { Card } from '../card'

export function sortRegionsByDragOrder(regions: Card[], order: string[]) {
  return regions.sort((a, b) => {
    const o = order || []
    return o.indexOf(a.cardId) - o.indexOf(b.cardId)
  })
}
