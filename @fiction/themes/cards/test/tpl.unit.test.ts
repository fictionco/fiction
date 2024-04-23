import { afterEach, describe, expect, it } from 'vitest'
import { z } from 'zod'
import { standardCardTemplates } from '..'

describe('verify template settings config', () => {
  it('has template options set correctly', () => {
    //
    expect(standardCardTemplates.map((_) => {
      return { templateId: _.settings.templateId, unusedSchema: _.optionConfig.unusedSchema }
    })).toMatchInlineSnapshot(`
      [
        {
          "templateId": "wrap",
          "unusedSchema": undefined,
        },
        {
          "templateId": "404",
          "unusedSchema": undefined,
        },
        {
          "templateId": "quotes",
          "unusedSchema": undefined,
        },
        {
          "templateId": "profile",
          "unusedSchema": {
            "layout": "string: Media on left or right",
            "mediaItems.0._media": "object: no description",
            "mediaItems.0.media.alt": "string: no description",
          },
        },
        {
          "templateId": "hero",
          "unusedSchema": undefined,
        },
        {
          "templateId": "marquee",
          "unusedSchema": undefined,
        },
        {
          "templateId": "area",
          "unusedSchema": undefined,
        },
        {
          "templateId": "map",
          "unusedSchema": {
            "maps.0._markers": "array: no description",
          },
        },
      ]
    `)
  })
})
