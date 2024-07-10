import { describe, expect, it } from 'vitest'
import { waitFor } from '@fiction/core'
import { requestManageSite } from '../../load'
import { Card } from '../../card'
import type { CardConfigPortable, TableCardConfig } from '../../tables'
import { Site } from '../../site'
import { createSiteTestUtils } from '../../test/testUtils'
import { addNewCard, removeCard, requestManagePage, updateRegion } from '../region'

describe('removeCard', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' }

  it('should successfully remove a card from a region', async () => {
    const site = new Site({ ...common, isProd: false, themeId: 'test' })

    // First, add a card to ensure there's something to remove
    const cardId = 'cardToRemove'
    await addNewCard({ site, templateId: 'area', addToRegion: 'header', cardId })

    // Ensure the card was added
    expect(site.availableCards.value.some(c => c.cardId === cardId)).toBe(true)

    // Now, remove the card
    removeCard({ site, cardId })

    // Verify the card has been removed
    expect(site.availableCards.value.some(c => c.cardId === cardId)).toBe(false)
  })

  it('should successfully remove a nested card', async () => {
    const site = new Site({ ...common, isProd: false, themeId: 'test' })

    // Add a parent and a nested card
    const parentCardId = 'parentCard'
    const nestedCardId = 'nestedCard'
    await addNewCard({ site, templateId: 'area', addToRegion: 'footer', cardId: parentCardId })
    await addNewCard({ site, templateId: 'area', addToCardId: parentCardId, cardId: nestedCardId })

    // Ensure the nested card was added
    const parentCard = site.availableCards.value.find(c => c.cardId === parentCardId)
    expect(parentCard?.cards?.value.some(c => c.cardId === nestedCardId)).toBe(true)

    // Now, remove the nested card
    removeCard({ site, cardId: nestedCardId })

    // Verify the nested card has been removed
    expect(parentCard?.cards?.value.some(c => c.cardId === nestedCardId)).toBe(false)
  })

  it('should throw an error if attempting to remove a card that does not exist', () => {
    const site = new Site({ ...common, isProd: false, themeId: 'test' })

    // Attempt to remove a non-existent card
    const nonExistentCardId = 'nonExistentCard'
    expect(() => removeCard({ site, cardId: nonExistentCardId })).toThrow(`Card with ID ${nonExistentCardId} not found.`)
  })

  it('should call onRemove callback when a card is successfully removed', async () => {
    const site = new Site({ ...common, isProd: false, themeId: 'test' })
    const cardId = 'cardWithCallback'
    await addNewCard({ site, templateId: 'area', addToRegion: 'main', cardId })

    let callbackCalled = false
    removeCard({ site, cardId, onRemove: (removedCardId) => {
      expect(removedCardId).toMatchObject({ cardId })
      callbackCalled = true
    } })

    expect(callbackCalled).toBe(true)
  })
})

describe('addNewCard', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' }

  it('should throw an error if template is not found', async () => {
    const site = new Site({ ...common, isProd: false, themeId: 'test' })

    await expect(addNewCard({ site, templateId: 'noExist' })).rejects.toThrow(`Could not find template with key noExist`)
  })

  it('should add a new card to a region if addToCardId is not provided', async () => {
    const site = new Site({ ...common, isProd: false, themeId: 'test' })

    expect(Object.keys(site.viewMap.value)).toMatchInlineSnapshot(`
      [
        "__transaction",
        "_",
      ]
    `)
    expect(site.activePageId.value).toBeTruthy()
    expect(site.currentPage.value.templateId.value).toBe('wrap')
    expect(Object.keys(site.layout.value)).toContain('header')

    const cardId = 'card1'
    let r1: CardConfigPortable | undefined
    const r2 = await addNewCard({ site, templateId: 'area', addToRegion: 'header', cardId, onAdd: (config) => { r1 = config } })

    expect(r1?.cardId, 'callback is correct').toBe(cardId)
    expect(r2?.cardId, 'return is correct when not delayed').toBe(cardId)

    expect(site.availableCards.value.filter(_ => _.cardId === cardId)).toHaveLength(1)

    expect(site.availableCards.value.find(_ => _.cardId === cardId)?.regionId).toBe('header')
  })

  it('should add a new card to an existing card if addToCardId is provided', async () => {
    const site = new Site({ ...common, isProd: false, themeId: 'test' })

    await addNewCard({ site, templateId: 'area', addToRegion: 'footer', cardId: 'firstCard' })
    await addNewCard({ site, templateId: 'area', addToCardId: 'firstCard', cardId: 'nestedCard' })

    const setCard = site.availableCards.value.find(c => c.cardId === 'firstCard')?.cards.value[0]
    expect(setCard?.cardId).toBe('nestedCard')
  })

  it('should delay the addCard action if delay is provided and greater than 0', async () => {
    const site = new Site({ ...common, isProd: false, themeId: 'test' })

    const delay = 100
    let r1: CardConfigPortable | undefined
    await addNewCard({ site, templateId: 'area', addToRegion: 'footer', cardId: 'firstCard', delay, onAdd: (config) => { r1 = config } })

    expect(r1).toBeUndefined()

    await waitFor(110)

    expect(r1?.cardId).toBeDefined()
  })
})

describe('updateRegion', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' }
  const cardCommon = { regionId: 'main', templateId: 'area' } as const
  it('should add a new card if it does not exist', () => {
    const site = new Site({ ...common, isProd: false })
    const cardConfig: Partial<TableCardConfig> = { cardId: 'card1', ...cardCommon }
    const initialLength = site.pages.value.length

    updateRegion({ site, cardConfig })

    expect(site.pages.value).toHaveLength(initialLength + 1)
    expect(site.pages.value[0]).toBeInstanceOf(Card)
  })

  it('should update the existing card if it already exists', () => {
    const site = new Site({ ...common, isProd: false })

    const id = 'existingCard'
    site.pages.value.push(new Card({ cardId: id, userConfig: { val: 'bravo' }, site }))

    const cardConfig: Partial<TableCardConfig> = { cardId: id, userConfig: { val: 'alpha' }, ...cardCommon }
    updateRegion({ site, cardConfig })

    const reg = site.pages.value.filter(c => c.cardId === id)
    expect(reg).toHaveLength(1)
    expect(reg[0].userConfig.value.val).toEqual('alpha')
  })
})

describe('requestManagePage', async () => {
  const testUtils = await createSiteTestUtils()
  const initialized = await testUtils.init()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test', siteMode: 'standard' } as const
  const result = await requestManageSite(
    {
      _action: 'create',
      fields: { title: 'test', themeId: 'test' },
      caller: 'iframeEditingTest',
      ...common,
    },
  )
  if (!result.site || !result.response?.data)
    throw new Error('problem creating site')

  const site = result.site
  it('should throw an error if no action is provided', async () => {
    const regionCard: Partial<TableCardConfig> = { cardId: 'card1' }

    // @ts-expect-error test
    await expect(requestManagePage({
      site,
      regionCard,
      delay: 0,
    })).rejects.toThrow('Action is required.')
  })

  it('should process the upsert action correctly', async () => {
    const regionCard: Partial<TableCardConfig> = { cardId: 'card2', templateId: 'template1' }
    const { cardConfig: cc1 } = await requestManagePage({
      site,
      _action: 'upsert',
      regionCard,
      delay: 0,
      caller: 'upsert1',
    })

    expect(cc1?.cardId).toBe('card2')
    expect(cc1?.templateId).toBe('template1')
    expect(cc1?.regionId).toBe('main')
    expect(cc1?.siteId).toBe(site.siteId)
    expect(cc1?.userId).toBe(initialized.user.userId)

    const { cardConfig: cc2 } = await requestManagePage({
      site,
      _action: 'upsert',
      regionCard: { templateId: 'template2', cardId: cc1?.cardId },
      delay: 0,
      caller: 'upsert2',
    })
    expect(cc2?.cardId).toBe(cc1?.cardId)
    expect(cc2?.templateId).toBe('template2')
    expect(cc2?.regionId).toBe(cc1?.regionId)
    expect(cc2?.siteId).toBe(cc1?.siteId)
    expect(cc2?.userId).toBe(cc1?.userId)
    expect(cc2?.updatedAt).not.toBe(cc1?.updatedAt)

    const { response } = await requestManagePage({
      site,
      _action: 'delete',
      regionCard,
      delay: 0,
    })

    expect(response?.status).toBe('success')

    const r = await site.fictionSites.requests.ManagePage.projectRequest({
      siteId: site.siteId,
      _action: 'retrieve',
      fields: { cardId: cc1?.cardId, siteId: site.siteId },
      caller: 'retrieveAttemptAfterDelete',
    })

    expect(r.status).toBe('error')

    expect(r).toMatchInlineSnapshot(`
      {
        "context": "ManagePage",
        "httpStatus": 200,
        "message": "",
        "status": "error",
      }
    `)
  })
})
