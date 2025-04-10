/**
 * @vitest-environment happy-dom
 */
import { shortId, waitFor } from '@fiction/core'
import { beforeEach, describe, expect, it } from 'vitest'
import { Site } from '../../site'
import { createSiteTestUtils } from '../../test/testUtils'
import { SiteHistory } from '../history'

describe('siteHistory', async () => {
  const testUtils = await createSiteTestUtils()
  const common = {
    fictionSites: testUtils.fictionSites,
    siteRouter: testUtils.fictionRouterSites,
    themeId: 'test',
    siteId: `test-${shortId()}`,
    siteMode: 'designer' as const,
  }
  let site: Site
  let history: SiteHistory

  beforeEach(async () => {
    site = await Site.create(common, { isNewSite: true })
    history = new SiteHistory(site)
    history.init()
  })

  it('initializes correctly', () => {
    expect(history.canUndo.value, 'Should start with no undo states').toBe(false)
    expect(history.canRedo.value, 'Should start with no redo states').toBe(false)
    expect(history.past.value.length, 'Should have initial state').toBe(1)
  })

  it('saves state and manages undo/redo', async () => {
    await site.update({ title: 'First Title' }, { caller: 'test' })
    history.saveState({
      type: 'site',
      description: 'First change',
      siteConfig: site.toConfig(),
    })

    await site.update({ title: 'Second Title' }, { caller: 'test' })
    history.saveState({
      type: 'site',
      description: 'Second change',
      siteConfig: site.toConfig(),
    })

    expect(history.canUndo.value, 'Should allow undo after changes').toBe(true)
    expect(site.title.value, 'Should have latest title').toBe('Second Title')

    await history.undo()
    expect(site.title.value, 'Should restore previous title after undo').toBe('First Title')
    expect(history.canRedo.value, 'Should allow redo after undo').toBe(true)

    await history.redo()
    expect(site.title.value, 'Should restore latest title after redo').toBe('Second Title')
    expect(history.canRedo.value, 'Should have no redo states after redo').toBe(false)
  })

  it('handles card states', async () => {
    const cardId = 'test-card'
    await site.addCard({ templateId: 'cardHeroV1', cardId })
    await waitFor(1200)

    const card = site.availableCards.value.find(c => c.cardId === cardId)

    expect(card, 'Card should exist').toBeTruthy()

    await card?.update({ title: 'Initial' }, { caller: 'test' })
    history.saveState({
      type: 'card',
      description: 'Card update',
      cardConfig: card?.toConfig() || {},
    })

    await card?.update({ title: 'Modified' }, { caller: 'test' })
    history.saveState({
      type: 'card',
      description: 'Card modified',
      cardConfig: card?.toConfig() || {},
    })

    await history.undo()
    expect(card?.title.value, 'Should restore initial card title').toBe('Initial')

    await history.redo()
    expect(card?.title.value, 'Should restore modified card title').toBe('Modified')
  })

  it('enforces max history size', () => {
    const maxStates = 25
    for (let i = 0; i < maxStates; i++) {
      history.saveState({
        type: 'site',
        description: `State ${i}`,
        siteConfig: { title: `Title ${i}` },
      })
    }

    let undoCount = 0
    while (history.canUndo.value && undoCount <= 30) {
      history.undo()
      undoCount++
    }

    expect(undoCount, 'Should limit history size to maxHistorySize').toBeLessThanOrEqual(20)
  })

  it('manages redo stack', async () => {
    await site.update({ title: 'First' }, { caller: 'test' })
    history.saveState({ type: 'site', description: 'First', siteConfig: site.toConfig() })

    await site.update({ title: 'Second' }, { caller: 'test' })
    history.saveState({ type: 'site', description: 'Second', siteConfig: site.toConfig() })

    await history.undo()
    expect(history.canRedo.value, 'Should have redo state after undo').toBe(true)

    await site.update({ title: 'Third' }, { caller: 'test' })
    history.saveState({ type: 'site', description: 'Third', siteConfig: site.toConfig() })
    expect(history.canRedo.value, 'Should clear redo stack after new state').toBe(false)
  })
})
