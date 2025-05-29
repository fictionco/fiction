import { getCardTemplates } from '@fiction/cards'
import { shortId, waitFor } from '@fiction/core'
import { describe, expect, it } from 'vitest'
import { Card, CardTemplate } from '../card'
import { Site } from '../site'
import { createSiteTestUtils } from './testUtils'

describe('card', async () => {
  const testUtils = await createSiteTestUtils()
  const site = await Site.create({ fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test', siteId: `test-${shortId()}` })

  const templates = await getCardTemplates({ caller: 'testCard' })
  const inlineTemplate = templates.find(t => t.settings.templateId === 'cardHeroV1')
  const card = new Card({
    site,
    inlineTemplate,
    title: 'Test Card',
  })

  it('should have correct setup', () => {
    expect(site.pages.value.length).toMatchInlineSnapshot(`3`)
  })

  it('cardTemplate initializes with correct settings', () => {
    expect(card.tpl.value?.settings.templateId).toBe('cardHeroV1')
    expect(card.tpl.value?.settings.title).toBe('Hero')
  })

  it('card initializes with correct settings and links to Site and Template', () => {
    expect(card.title.value).toBe('Test Card')
    expect(card.site).toBe(site)
  })

  it('cardTemplate toCard method generates a card with expected properties', async () => {
    const newCard = await templates.find(t => t.settings.templateId === 'cardHeroV1')?.toCard({ site })
    expect(newCard?.settings.templateId).toBe('cardHeroV1')
    expect(newCard?.settings.title).toBeFalsy()
  })
})

describe('cardTemplate', async () => {
  const _testUtils = await createSiteTestUtils()
  it('initializes correctly with default settings', async () => {
    const site = await Site.create({ fictionSites: _testUtils.fictionSites, siteRouter: _testUtils.fictionRouterSites, themeId: 'test', siteId: `test-${shortId()}` })

    expect(site?.theme.value?.templates.map(t => t.settings.templateId)).toMatchInlineSnapshot(`
      [
        "cardHeroV1",
        "cardProfileV1",
        "cardStoryV1",
        "cardFeaturesV1",
        "cardBentoV1",
        "cardPeopleV1",
        "cardTestimonialsV1",
        "cardQuotesV1",
        "cardMetricsV1",
        "cardLogosV1",
        "cardShowcaseGalleryV1",
        "cardPostsListV1",
        "cardBlogV1",
        "cardSinglePostV1",
        "cardStepsV1",
        "cardFaqV1",
        "cardTimelineV1",
        "cardPhotoGalleryV1",
        "cardModalMediaV1",
        "cardCaptureV1",
        "cardPricingV1",
        "cardMapsV1",
        "cardPageWrapV1",
        "cardPageAreaV1",
        "cardSiteNavV1",
        "cardFooterProV1",
        "cardStandardFooterV1",
        "cardMarqueeV1",
        "cardOverlaySliderV1",
        "cardTickerV1",
        "CardParallaxScrollV1",
        "cardResponsiveTextV1",
        "cardTextEffectV1",
        "card404ErrorV1",
        "cardTransactionViewV1",
        "testWrap",
        "testBlog",
      ]
    `)
    const card = new Card({ templateId: 'cardHeroV1', site })

    await waitFor(50)

    expect(card.templateId.value).toBe('cardHeroV1')

    expect(card.tpl.value).toBeInstanceOf(CardTemplate)
  })
})
