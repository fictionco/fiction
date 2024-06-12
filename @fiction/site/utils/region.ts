import { log } from '@fiction/core'
import type { CardTemplate, Site } from '../index.js'
import { Card } from '../card.js'
import type { CardConfigPortable, PageRegion, TableCardConfig } from '../tables.js'

const logger = log.contextLogger('regionUtils')

export function updateRegion(args: { site: Site, cardConfig: Partial<TableCardConfig> }) {
  const { site, cardConfig } = args

  if (!site)
    throw new Error('Site is required.')

  const r = new Card({ ...cardConfig, site })

  const i = site.pages.value.findIndex(r => r.cardId === cardConfig.cardId)
  if (i > -1)
    site.pages.value[i] = r
  else
    site.pages.value = [r, ...site.pages.value]
}

export async function requestManagePage(args: {
  site: Site
  _action: 'upsert' | 'delete'
  regionCard?: CardConfigPortable
  delay: number
  successMessage?: string
  caller?: string
}) {
  const { site, _action, regionCard, delay = 400, successMessage, caller = 'unknown' } = args

  if (!site.siteId)
    throw new Error('siteId is required.')

  if (!_action)
    throw new Error('Action is required.')

  if (!regionCard)
    throw new Error('Region card is required.')

  // set defaults
  const fields = new Card({ site, ...regionCard }).toConfig()

  logger.info(`${caller}: requesting region action: ${_action}`, { data: { fields, successMessage } })

  const r = await site.fictionSites.requests.ManagePage.projectRequest({
    siteId: site.siteId,
    _action,
    fields: { ...fields },
    successMessage,
    caller: `requestManagePage:${caller}:${_action}`,
  })

  const cardConfig = r.data

  const updateRegionAction = () => {
    if (_action === 'delete') {
      const i = site.pages.value.findIndex(r => r.cardId === regionCard.cardId)

      if (i > -1)
        site.pages.value.splice(i, 1)
    }
    else if (cardConfig && cardConfig.cardId) {
      updateRegion({ site, cardConfig })

      site.activePageId.value = cardConfig.cardId
    }
  }

  if (r.status === 'success') {
    if (delay && delay > 0)
      setTimeout(() => updateRegionAction(), delay)

    else
      updateRegionAction()
  }
  return { cardConfig, response: r }
}

/**
 * Add a card to another card, if addToCardId is provided, otherwise add to region
 */
export function addNewCard(args: {
  site: Site
  templateId: string
  addToRegion?: PageRegion
  addToCardId?: string
  delay?: number
  cardId?: string
  onAdd?: (cardConfig: CardConfigPortable) => void
  location?: 'top' | 'bottom'
}) {
  const { site, templateId, addToCardId, addToRegion, delay, cardId, onAdd, location } = args
  const regionId = addToRegion || 'main'

  const tpl = site.theme.value?.templates.find(t => t.settings.templateId === templateId)

  if (!tpl)
    throw new Error(`Could not find template with key ${templateId}`)

  const cardConfig = tpl?.toCard({ cardId, site }).toConfig() as TableCardConfig & { cardId: string }

  const addCardAction = () => {
    if (addToCardId) {
      const card = site.availableCards.value.find(c => c.cardId === addToCardId)
      if (card)
        card.addCard({ cardConfig, location })
    }
    else {
      const regionCard = site.layout.value[regionId]

      if (!regionCard)
        throw new Error(`no region "${regionId}" -- ${Object.keys(site.layout.value).join(', ')} - ${site.currentPage.value.tpl.value?.settings.templateId}`)

      regionCard.addCard({ cardConfig, location })
    }

    if (onAdd)
      onAdd(cardConfig)

    site.events.emit('addCard', { template: tpl })

    return cardConfig
  }

  if (delay && delay > 0)
    setTimeout(addCardAction, delay)

  else
    return addCardAction()
}

export function removeCard(args: {
  site: Site
  cardId: string
  onRemove?: (args: { cardId: string }) => void
}) {
  const { site, cardId, onRemove } = args
  let cardFound = false

  // Search and remove the card in all regions
  for (const region of Object.values(site.layout.value)) {
    const index = region.cards.value.findIndex(c => c.cardId === cardId)
    if (index > -1) {
      // Use Vue's reactivity-aware methods for array manipulation
      region.cards.value = [...region.cards.value.slice(0, index), ...region.cards.value.slice(index + 1)]
      cardFound = true
      break
    }
  }

  if (!cardFound) {
    // Search nested cards
    site.availableCards.value.forEach((card) => {
      const index = card.cards.value?.findIndex(c => c.cardId === cardId)
      if (index > -1) {
        // Ensure reactivity for nested card removal
        card.cards.value = [...card.cards.value.slice(0, index), ...card.cards.value.slice(index + 1)]
        cardFound = true
      }
    })
  }

  if (!cardFound)
    throw new Error(`Card with ID ${cardId} not found.`)

  if (onRemove)
    onRemove({ cardId })
}
