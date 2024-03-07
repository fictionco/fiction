import { describe, expect, it } from 'vitest'
import { waitFor } from '@fiction/core'
import { getOptionJsonSchema } from '@fiction/ui'
import { Card, CardTemplate } from '../card'
import { Site } from '../site'
import { standardCardTemplates } from '../cards'
import { createSiteTestUtils } from './siteTestUtils'

describe('card', async () => {
  const testUtils = await createSiteTestUtils()
  const site = new Site({ fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' })
  const card = new Card({
    site,
    tpl: standardCardTemplates.find(t => t.settings.templateId === 'hero') as CardTemplate,
    title: 'Test Card',
  })

  it('should have correct setup', () => {
    expect(site.pages.value.length).toMatchInlineSnapshot(`0`)
  })

  it('cardTemplate initializes with correct settings', () => {
    expect(card.tpl.value?.settings.templateId).toBe('hero')
    expect(card.tpl.value?.settings.title).toBe('Hero')
  })

  it('card initializes with correct settings and links to Site and Template', () => {
    expect(card.title.value).toBe('Test Card')
    expect(card.site).toBe(site)
  })

  it('cardTemplate toCard method generates a card with expected properties', () => {
    const newCard = standardCardTemplates.find(t => t.settings.templateId === 'hero')?.toCard({})
    expect(newCard?.settings.templateId).toBe('hero')
    expect(newCard?.settings.title).toBe('Hero')
  })

  it('card computes total estimated time correctly', () => {
    // Assuming options have been set up to produce a known total time
    const totalEstimatedTime = card.generation.totalEstimatedTime.value
    expect(totalEstimatedTime).toBeGreaterThan(0)
    // Update the expected time based on your options setup
    expect(totalEstimatedTime).toBe(16) // Example value
  })

  it('card generates correct prompt for content creation', () => {
    const prompt = card.generation.prompt.value
    expect(prompt).toMatchInlineSnapshot(`"create content for the "Test Card" card on the "404" page"`)
    expect(prompt.toLowerCase()).toContain('test card')
    // Adjust based on actual prompt structure
  })

  it('updates to Card reflect in userConfig and other properties', () => {
    card.updateUserConfig({ path: 'heading', value: 'New Headline' })
    expect(card.userConfig.value.heading).toBe('New Headline')

    card.update({ title: 'Updated Card' })
    expect(card.title.value).toBe('Updated Card')
    const prompt = card.generation.prompt.value
    expect(prompt.toLowerCase()).toContain('updated card')
  })

  it('should compute total estimated time correctly', () => {
    const totalEstimatedTime = card.generation.totalEstimatedTime.value

    expect(totalEstimatedTime).toBeGreaterThan(0)
    expect(totalEstimatedTime).toMatchInlineSnapshot(`16`)
  })

  it('should have correct generations settings', () => {
    const inputConfig = card.generation.inputConfig.value

    expect(inputConfig).toMatchInlineSnapshot(`
      {
        "userConfig.actions": {
          "cumulativeTime": 16000,
          "estimatedMs": 4000,
          "isDisabled": undefined,
          "key": "userConfig.actions",
          "label": undefined,
          "prompt": undefined,
        },
        "userConfig.heading": {
          "cumulativeTime": 4000,
          "estimatedMs": 4000,
          "isDisabled": undefined,
          "key": "userConfig.heading",
          "label": "Heading",
          "prompt": undefined,
        },
        "userConfig.subHeading": {
          "cumulativeTime": 8000,
          "estimatedMs": 4000,
          "isDisabled": undefined,
          "key": "userConfig.subHeading",
          "label": "Sub Heading",
          "prompt": undefined,
        },
        "userConfig.superHeading": {
          "cumulativeTime": 12000,
          "estimatedMs": 4000,
          "isDisabled": undefined,
          "key": "userConfig.superHeading",
          "label": "Super Heading",
          "prompt": undefined,
        },
      }
    `)
  })
})

describe('cardTemplate', async () => {
  const _testUtils = await createSiteTestUtils()
  it('initializes correctly with default settings', async () => {
    const site = new Site({ fictionSites: _testUtils.fictionSites, siteRouter: _testUtils.fictionRouterSites, themeId: 'test' })

    expect(site?.theme.value?.templates.map(t => t.settings.templateId)).toMatchInlineSnapshot(`
      [
        "wrap",
        "404",
        "quotes",
        "hero",
        "marquee",
        "area",
        "testWrap",
      ]
    `)
    const card = new Card({ templateId: 'hero', site })

    await waitFor(50)

    expect(card.templateId.value).toBe('hero')

    const jsonSchema = getOptionJsonSchema(card.tpl.value?.settings.options)

    if (!jsonSchema)
      throw new Error('jsonSchema is undefined')

    expect(jsonSchema).toMatchInlineSnapshot(`
      {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "additionalProperties": false,
        "properties": {
          "userConfig.actions": {
            "additionalProperties": false,
            "description": "userConfig.actions",
            "properties": {},
            "type": "object",
          },
          "userConfig.heading": {
            "description": "Heading",
            "type": "string",
          },
          "userConfig.subHeading": {
            "description": "Sub Heading",
            "type": "string",
          },
          "userConfig.superHeading": {
            "description": "Super Heading",
            "type": "string",
          },
        },
        "required": [
          "userConfig.heading",
          "userConfig.subHeading",
          "userConfig.actions",
        ],
        "type": "object",
      }
    `)
    expect(card.tpl.value).toBeInstanceOf(CardTemplate)
  })
})
