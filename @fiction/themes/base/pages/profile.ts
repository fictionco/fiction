import type { CardConfigPortable } from '@fiction/site/tables.js'
import { cardConfig } from '@fiction/cards/index.js'
import { createStockMediaHandler } from '@fiction/ui/stock/index.js'

export async function getCards(): Promise<CardConfigPortable[]> {
  const stock = await createStockMediaHandler()

  return [
    cardConfig({ templateId: 'cardProfileV1' }),
    cardConfig({ templateId: 'cardBentoV1' }),
    cardConfig({ templateId: 'cardQuotesV1' }),
  ]
}
