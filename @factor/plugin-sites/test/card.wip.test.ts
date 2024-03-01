import { describe, expect, it } from 'vitest'
import { waitFor } from '@factor/api'
import { Card, CardTemplate } from '../card'
import { Site } from '../site'
import { createSiteTestUtils } from './siteTestUtils'

describe('cardTemplate', async () => {
  const _testUtils = await createSiteTestUtils()
  it('initializes correctly with default settings', async () => {
    const site = new Site({ factorSites: _testUtils.factorSites, siteRouter: _testUtils.factorRouterSites, themeId: 'test' })

    expect(site?.theme.value?.templates.map(t => t.settings.templateId)).toMatchInlineSnapshot(`
      [
        "wrap",
        "404",
        "quotes",
        "logos",
        "hero",
        "doc",
        "marquee",
        "area",
        "tour",
        "mediaGrid",
        "metrics",
        "features",
        "testWrap",
      ]
    `)
    const card = new Card({ templateId: 'hero', site })

    await waitFor(50)

    expect(card.templateId.value).toBe('hero')

    if (!card.tpl.value?.jsonSchema.value)
      throw new Error('card.tpl.value?.schema.value is undefined')

    expect(card.tpl.value?.jsonSchema.value).toMatchInlineSnapshot(`
      {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "additionalProperties": false,
        "properties": {
          "userConfig.actions": {
            "additionalProperties": false,
            "properties": {},
            "type": "object",
          },
          "userConfig.heading": {
            "type": "string",
          },
          "userConfig.subHeading": {
            "type": "string",
          },
          "userConfig.superHeading": {
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
