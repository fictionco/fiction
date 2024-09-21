import { standardCardTemplates } from '@fiction/cards'
import { shortId, waitFor } from '@fiction/core'
import { describe, expect, it } from 'vitest'
import { Card, CardTemplate } from '../card'
import { CardGeneration } from '../generation'
import { Site } from '../site'
import { createSiteTestUtils } from './testUtils'

describe('card', async () => {
  const testUtils = await createSiteTestUtils()
  const site = await Site.create({ fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test', siteId: `test-${shortId()}` })

  const inlineTemplate = standardCardTemplates.find(t => t.settings.templateId === 'hero')
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
    expect(card.tpl.value?.settings.templateId).toBe('hero')
    expect(card.tpl.value?.settings.title).toBe('Hero')
  })

  it('card initializes with correct settings and links to Site and Template', () => {
    expect(card.title.value).toBe('Test Card')
    expect(card.site).toBe(site)
  })

  it('cardTemplate toCard method generates a card with expected properties', async () => {
    const newCard = await standardCardTemplates.find(t => t.settings.templateId === 'hero')?.toCard({ site })
    expect(newCard?.settings.templateId).toBe('hero')
    expect(newCard?.settings.title).toBe('Hero')
  })

  it('card computes total estimated time correctly', async () => {
    generation.fieldsUserConfig.value = { heading: { isUserEnabled: true }, subHeading: { isUserEnabled: true } }

    await waitFor(50)

    // Assuming options have been set up to produce a known total time
    const totalEstimatedTime = generation.totalEstimatedTime.value
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
    card.updateUserConfig({ path: 'heading', value: 'New Headline' })
    expect(card.userConfig.value.heading).toBe('New Headline')

    card.update({ title: 'Updated Card' }, { caller: 'cardunit' })
    expect(card.title.value).toBe('Updated Card')
    const prompt = generation.prompt.value
    expect(prompt.toLowerCase()).toContain('updated card')
  })

  it('should compute total estimated time correctly', () => {
    generation.fieldsUserConfig.value = { heading: { isUserEnabled: true }, subHeading: { isUserEnabled: true } }

    const totalEstimatedTime = generation.totalEstimatedTime.value

    expect(totalEstimatedTime).toMatchInlineSnapshot(`8`)
    expect(totalEstimatedTime).toBe(8)
  })

  it('should have correct generations settings', () => {
    const inputConfig = generation.jsonPropConfig.value

    expect(inputConfig).toEqual(expect.objectContaining({
      heading: expect.any(Object),
      overlays: expect.any(Object),
      splash: expect.any(Object),
      subHeading: expect.any(Object),
      superColor: expect.any(Object),
      superHeading: expect.any(Object),
      superIcon: expect.any(Object),

    }))

    expect(inputConfig.subHeading.label).toEqual('Sub Heading')

    expect(Object.values(inputConfig).filter(c => c.isUserEnabled && c.hasTag).length).toBe(2)

    expect(inputConfig).toMatchInlineSnapshot(`
      {
        "heading": {
          "cumulativeTime": 4000,
          "estimatedMs": 4000,
          "hasTag": true,
          "isUserEnabled": true,
          "key": "heading",
          "label": "Heading",
          "prompt": "Primary hero headline, 3 to 13 words",
        },
        "overlays": {
          "cumulativeTime": 8000,
          "estimatedMs": 4000,
          "hasTag": true,
          "key": "overlays",
          "label": "Overlays",
          "prompt": "Overlays to be placed on top of the splash image",
        },
        "splash": {
          "cumulativeTime": 8000,
          "estimatedMs": 4000,
          "hasTag": true,
          "key": "splash",
          "label": "Splash",
          "prompt": "Splash picture for hero",
        },
        "subHeading": {
          "cumulativeTime": 8000,
          "estimatedMs": 4000,
          "hasTag": true,
          "isUserEnabled": true,
          "key": "subHeading",
          "label": "Sub Heading",
          "prompt": "Secondary hero headline, 10 to 30 words",
        },
        "superColor": {
          "cumulativeTime": 8000,
          "estimatedMs": 4000,
          "hasTag": true,
          "key": "superColor",
          "label": "Super Color",
          "prompt": "change color of super heading",
        },
        "superHeading": {
          "cumulativeTime": 8000,
          "estimatedMs": 4000,
          "hasTag": true,
          "key": "superHeading",
          "label": "Super Heading",
          "prompt": "Shorter badge above headline, 2 to 5 words",
        },
        "superIcon": {
          "cumulativeTime": 8000,
          "estimatedMs": 4000,
          "hasTag": true,
          "key": "superIcon",
          "label": "Super Icon",
          "prompt": "Icon for the super heading",
        },
      }
    `)
  })
})

describe('cardTemplate', async () => {
  const _testUtils = await createSiteTestUtils()
  it('initializes correctly with default settings', async () => {
    const site = await Site.create({ fictionSites: _testUtils.fictionSites, siteRouter: _testUtils.fictionRouterSites, themeId: 'test', siteId: `test-${shortId()}` })

    expect(site?.theme.value?.templates.map(t => t.settings.templateId)).toMatchInlineSnapshot(`
      [
        "wrap",
        "transaction",
        "404",
        "nav",
        "footer",
        "quotes",
        "profile",
        "hero",
        "marquee",
        "area",
        "maps",
        "magazine",
        "demoProse",
        "capture",
        "showcase",
        "cinema",
        "story",
        "ticker",
        "people",
        "pricing",
        "logos",
        "mediaGrid",
        "tour",
        "features",
        "metrics",
        "faq",
        "mediaPop",
        "textEffects",
        "trek",
        "fitText",
        "overSlide",
        "statement",
        "testimonials",
        "effectShape",
        "gallery",
        "contact",
        "hitlist",
        "testWrap",
        "testBlog",
      ]
    `)
    const card = new Card({ templateId: 'hero', site })

    await waitFor(50)

    expect(card.templateId.value).toBe('hero')

    expect(card.tpl.value).toBeInstanceOf(CardTemplate)
  })
})
