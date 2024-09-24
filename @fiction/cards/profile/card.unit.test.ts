import { refineOptions } from '@fiction/site/utils/schema'
import { describe, expect, it } from 'vitest'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { templates } from '.'

describe('minimalProfile', async () => {
  it('has correct schema', async () => {
    if (!templates[0].settings.schema)
      throw new Error('no schema')

    const tpl = templates[0]

    if (!tpl)
      throw new Error('no template')

    const conf = refineOptions({
      options: tpl.settings.options || [],
      schema: tpl.settings.schema,
      templateId: tpl.settings.templateId,
    })

    expect(conf.unusedSchema).toMatchInlineSnapshot(`{}`)

    const jsonSchema = zodToJsonSchema(templates[0].settings.schema)
    expect(jsonSchema).toMatchInlineSnapshot(`
      {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "additionalProperties": false,
        "properties": {
          "content": {
            "description": "Formatted markdown of profile with paragraphs, 30 to 60 words, 2 paragraphs [ai]",
            "type": "string",
          },
          "details": {
            "description": "List of details with contact details, location, etc.",
            "items": {
              "additionalProperties": false,
              "properties": {
                "desc": {
                  "type": "string",
                },
                "href": {
                  "type": "string",
                },
                "icon": {
                  "type": "string",
                },
                "name": {
                  "type": "string",
                },
              },
              "type": "object",
            },
            "type": "array",
          },
          "detailsTitle": {
            "description": "Title for list of details [ai]",
            "type": "string",
          },
          "layout": {
            "description": "Media on left or right",
            "enum": [
              "left",
              "right",
            ],
            "type": "string",
          },
          "mediaItems": {
            "description": "Splash picture in portrait format  [ai seconds=40]",
            "items": {
              "additionalProperties": false,
              "properties": {
                "media": {
                  "additionalProperties": false,
                  "description": "Media item with image or video",
                  "properties": {
                    "el": {},
                    "format": {
                      "enum": [
                        "url",
                        "image",
                        "video",
                        "iframe",
                        "html",
                        "component",
                        "iconId",
                        "iconClass",
                        "typography",
                      ],
                      "type": "string",
                    },
                    "html": {
                      "type": "string",
                    },
                    "url": {
                      "type": "string",
                    },
                  },
                  "type": "object",
                },
              },
              "type": "object",
            },
            "type": "array",
          },
          "socials": {
            "description": "List of social media links",
            "items": {
              "additionalProperties": false,
              "properties": {
                "href": {
                  "description": "Full link for href",
                  "type": "string",
                },
                "media": {
                  "additionalProperties": false,
                  "description": "icon reference associated with the social media platform (x, youtube, facebook, etc)",
                  "properties": {
                    "class": {
                      "description": "tabler iconify class i-tabler-[icon-name]",
                      "type": "string",
                    },
                    "el": {
                      "$ref": "#/properties/mediaItems/items/properties/media/properties/el",
                    },
                    "format": {
                      "$ref": "#/properties/mediaItems/items/properties/media/properties/format",
                    },
                    "html": {
                      "$ref": "#/properties/mediaItems/items/properties/media/properties/html",
                    },
                    "iconId": {
                      "description": "iconId is common icon name (e.g. user, check, lock)",
                      "type": "string",
                    },
                    "url": {
                      "$ref": "#/properties/mediaItems/items/properties/media/properties/url",
                    },
                  },
                  "type": "object",
                },
                "name": {
                  "description": "@handle on (platform)",
                  "type": "string",
                },
              },
              "type": "object",
            },
            "type": "array",
          },
          "superTitle": {
            "description": "Shorter badge above headline, 2 to 5 words [ai]",
            "type": "string",
          },
          "title": {
            "description": "Primary headline for profile 3 to 8 words [ai]",
            "type": "string",
          },
        },
        "type": "object",
      }
    `)
  })
})
