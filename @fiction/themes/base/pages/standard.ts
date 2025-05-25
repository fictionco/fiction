import type { Site } from '@fiction/site'
import type { CardConfigPortable } from '@fiction/site/tables.js'
import { cardConfigWithDefault } from '@fiction/cards/index.js'

export async function getCards(_args: { site: Site }): Promise<CardConfigPortable[]> {
  const { site } = _args

  const promises = [
    cardConfigWithDefault({ site, templateId: 'cardHeroV1' }),
  ]

  return Promise.all(promises)
}
