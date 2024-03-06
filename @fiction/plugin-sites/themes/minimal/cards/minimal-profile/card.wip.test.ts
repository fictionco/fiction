import { describe, expect, it } from 'vitest'
import { templates } from '.'

describe('minimalProfile', async () => {
  it('has correct schema', async () => {
    expect(templates[0].jsonSchema.value).toMatchInlineSnapshot(`
      {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "additionalProperties": false,
        "properties": {
          "userConfig.details": {
            "description": "Concise detail information like email, city, skills, last job, etc.",
            "items": {
              "additionalProperties": false,
              "properties": {
                "desc": {
                  "description": "Value for profile detail (email@example.com), max 3 words",
                  "type": "string",
                },
                "href": {
                  "type": "string",
                },
                "name": {
                  "description": "Label for profile detail (Email)",
                  "type": "string",
                },
                "target": {
                  "enum": [
                    "_self",
                    "_blank",
                  ],
                  "type": "string",
                },
              },
              "required": [
                "name",
                "href",
              ],
              "type": "object",
            },
            "type": "array",
          },
          "userConfig.detailsTitle": {
            "type": "string",
          },
          "userConfig.heading": {
            "description": "Primary headline for profile 3 to 8 words",
            "type": "string",
          },
          "userConfig.mediaItems": {
            "items": {
              "additionalProperties": false,
              "properties": {
                "media": {
                  "additionalProperties": false,
                  "description": "splash picture in portrait format",
                  "properties": {
                    "format": {
                      "enum": [
                        "url",
                      ],
                      "type": "string",
                    },
                    "url": {
                      "type": "string",
                    },
                  },
                  "required": [
                    "url",
                    "format",
                  ],
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
          "userConfig.socials": {
            "items": {
              "additionalProperties": false,
              "properties": {
                "desc": {
                  "maxLength": 100,
                  "minLength": 2,
                  "type": "string",
                },
                "href": {
                  "type": "string",
                },
                "icon": {
                  "enum": [
                    "x",
                    "linkedin",
                    "facebook",
                    "instagram",
                    "youtube",
                    "github",
                    "email",
                    "phone",
                    "pinterest",
                    "snapchat",
                    "twitch",
                    "discord",
                    "slack",
                    "snapchat",
                  ],
                  "type": "string",
                },
                "name": {
                  "maxLength": 30,
                  "minLength": 2,
                  "type": "string",
                },
                "target": {
                  "enum": [
                    "_self",
                    "_blank",
                  ],
                  "type": "string",
                },
              },
              "required": [
                "name",
                "icon",
                "href",
              ],
              "type": "object",
            },
            "type": "array",
          },
          "userConfig.subHeading": {
            "description": "Formatted markdown of profile with paragraphs, 50 to 80 words, 2 paragraphs",
            "type": "string",
          },
          "userConfig.superHeading": {
            "description": "Shorter badge above headline, 2 to 5 words",
            "type": "string",
          },
        },
        "required": [
          "userConfig.mediaItems",
          "userConfig.heading",
          "userConfig.subHeading",
          "userConfig.details",
          "userConfig.socials",
        ],
        "type": "object",
      }
    `)
  })
})
