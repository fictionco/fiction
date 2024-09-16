import { Card } from '@fiction/site'
import { describe, expect, it } from 'vitest'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { templates } from '.'

describe('minimalProfile', async () => {
  it('has correct schema', async () => {
    if (!templates[0].settings.schema)
      throw new Error('no schema')

    const card = new Card({})

    expect(templates[0].getOptionConfig({ card }).value.unusedSchema).toMatchInlineSnapshot(`{}`)

    const jsonSchema = zodToJsonSchema(templates[0].settings.schema)
    expect(jsonSchema).toMatchInlineSnapshot(`
      {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "additionalProperties": false,
        "properties": {
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
            "description": "Title for list of details",
            "type": "string",
          },
          "heading": {
            "description": "Primary headline for profile 3 to 8 words",
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
            "description": "Splash picture in portrait format",
            "items": {
              "additionalProperties": false,
              "properties": {
                "media": {
                  "additionalProperties": false,
                  "properties": {
                    "format": {
                      "enum": [
                        "url",
                        "image",
                        "video",
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
              "required": [
                "media",
              ],
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
                "icon": {
                  "description": "icon reference associated with the social media platform (x, youtube, facebook, etc)",
                  "type": "string",
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
          "subHeading": {
            "description": "Formatted markdown of profile with paragraphs, 30 to 60 words, 2 paragraphs",
            "type": "string",
          },
          "superHeading": {
            "description": "Shorter badge above headline, 2 to 5 words",
            "type": "string",
          },
        },
        "type": "object",
      }
    `)
  })
})
