import { getCardTemplates } from '@fiction/cards'
import { shortId, waitFor } from '@fiction/core'
import { describe, expect, it } from 'vitest'
import { Card, CardTemplate } from '../card'
import { CardGeneration } from '../generation'
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

  const generation = new CardGeneration({ card })

  it('should have correct setup', () => {
    expect(site.pages.value.length).toMatchInlineSnapshot(`1`)
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

  it('card computes total estimated time correctly', async () => {
    generation.fieldsUserConfig.value = { title: { isUserEnabled: true }, subTitle: { isUserEnabled: true } }

    await waitFor(50)

    // Assuming options have been set up to produce a known total time
    const totalEstimatedTime = await generation.getTotalEstimatedTime()
    expect(totalEstimatedTime).toBe(8)
    // Update the expected time based on your options setup
    expect(totalEstimatedTime).toMatchInlineSnapshot(`8`)
  })

  it('card generates correct prompt for content creation', () => {
    const prompt = generation.prompt.value
    expect(prompt).toMatchInlineSnapshot(`"create content for the "Test Card" website section"`)
    expect(prompt.toLowerCase()).toContain('test card')
    // Adjust based on actual prompt structure
  })

  it('updates to Card reflect in userConfig and other properties', () => {
    card.updateUserConfig({ path: 'title', value: 'New Headline' })
    expect(card.userConfig.value.title).toBe('New Headline')

    card.update({ title: 'Updated Card' }, { caller: 'cardunit' })
    expect(card.title.value).toBe('Updated Card')
    const prompt = generation.prompt.value
    expect(prompt.toLowerCase()).toContain('updated card')
  })

  it('should compute total estimated time correctly', async () => {
    generation.fieldsUserConfig.value = { title: { isUserEnabled: true }, subTitle: { isUserEnabled: true } }

    const totalEstimatedTime = await generation.getTotalEstimatedTime()

    expect(totalEstimatedTime).toMatchInlineSnapshot(`8`)
    expect(totalEstimatedTime).toBe(8)
  })

  it('should have correct generations settings', async () => {
    const inputConfig = await generation.getJsonPropConfig()

    expect(inputConfig).toMatchInlineSnapshot(`
      {
        "action": {
          "cumulativeTime": 8000,
          "estimatedMs": 4000,
          "hasTag": true,
          "key": "action",
          "label": "Action",
          "prompt": "Call-to-action buttons",
        },
        "caption": {
          "cumulativeTime": 8000,
          "estimatedMs": 4000,
          "hasTag": true,
          "key": "caption",
          "label": "Caption",
          "prompt": "Media description",
        },
        "subTitle": {
          "cumulativeTime": 8000,
          "estimatedMs": 4000,
          "hasTag": true,
          "isUserEnabled": true,
          "key": "subTitle",
          "label": "Sub Title",
          "prompt": "Supporting message (10-30 words)",
        },
        "superTitle": {
          "cumulativeTime": 8000,
          "estimatedMs": 4000,
          "hasTag": true,
          "key": "superTitle",
          "label": "Super Title",
          "prompt": "Small text above title",
        },
        "title": {
          "cumulativeTime": 4000,
          "estimatedMs": 4000,
          "hasTag": true,
          "isUserEnabled": true,
          "key": "title",
          "label": "Title",
          "prompt": "Main headline (3-13 words)",
        },
      }
    `)

    expect(inputConfig).toEqual(expect.objectContaining({
      title: expect.any(Object),
      subTitle: expect.any(Object),
      superTitle: expect.any(Object),
      action: expect.any(Object),
      caption: expect.any(Object),
    }))

    expect(inputConfig.subTitle.label).toEqual('Sub Title')

    expect(Object.values(inputConfig).filter(c => c.isUserEnabled && c.hasTag).length).toBe(2)
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
        "cardStatementSliderV1",
        "cardBentoV1",
        "cardPeopleV1",
        "cardTestimonialsV1",
        "cardQuotesV1",
        "cardMetricsV1",
        "cardLogosV1",
        "cardShowcaseGalleryV1",
        "cardPostsListV1",
        "cardBlogV1",
        "cardInstaV1",
        "cardStepsV1",
        "cardFaqV1",
        "cardTimelineV1",
        "cardCinemaSliderV1",
        "cardPhotoGalleryV1",
        "cardModalMediaV1",
        "cardTourV1",
        "cardCtaV1",
        "cardCaptureV1",
        "cardContactV1",
        "cardPricingV1",
        "cardMapsV1",
        "cardPageWrapV1",
        "cardPageAreaV1",
        "cardSiteNavV1",
        "cardFooterProV1",
        "cardFooterPersonalV1",
        "cardMarqueeV1",
        "cardOverlaySliderV1",
        "cardTickerV1",
        "CardParallaxScrollV1",
        "cardResponsiveTextV1",
        "cardShapeEffectV1",
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
