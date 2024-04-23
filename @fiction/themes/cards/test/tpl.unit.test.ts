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
          "unusedSchema": {},
        },
        {
          "templateId": "404",
          "unusedSchema": {},
        },
        {
          "templateId": "quotes",
          "unusedSchema": {},
        },
        {
          "templateId": "profile",
          "unusedSchema": {
            "details": {},
            "layout": "Media on left or right",
            "mediaItems": {
              "media": {
                "alt": "string",
              },
            },
            "socials": {},
          },
        },
        {
          "templateId": "hero",
          "unusedSchema": {},
        },
        {
          "templateId": "marquee",
          "unusedSchema": {},
        },
        {
          "templateId": "area",
          "unusedSchema": {},
        },
        {
          "templateId": "map",
          "unusedSchema": {
            "maps": {
              "markers": {
                "lng": undefined,
              },
            },
          },
        },
      ]
    `)
  })
})
