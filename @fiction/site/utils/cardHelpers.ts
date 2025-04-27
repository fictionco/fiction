import type { InputOption } from '@fiction/ui'
import type { Card } from '../card'
import { standardCardOptions } from '../cardStandard'

export async function getCardOptionConfig(args: { card?: Card }) {
  const { card } = args
  if (!card)
    return []
  const site = card.site

  const tpl = card?.tpl.value
  const config = await tpl?.getConfig?.({ site, card })
  const out = [...(config?.options || []), standardCardOptions({ card })]

  return out as InputOption[]
}
