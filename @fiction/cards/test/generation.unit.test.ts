import type { JsonSchema7ObjectType } from 'zod-to-json-schema'
import type { InputOptionGeneration } from '../../site/utils/generation'
import { shortId } from '@fiction/core'
import { Card, Site } from '@fiction/site'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { calculateTotalEstimatedTimeSeconds, generateJsonPropConfig, generateOutputProps, parseDescription, simulateProgress } from '@fiction/site/utils/generation'
import { describe, expect, it, vi } from 'vitest'
import zodToJsonSchema from 'zod-to-json-schema'
import { getCardTemplates } from '../index'

describe('generation utils', async () => {
  const testUtils = await createSiteTestUtils()
  const site = await Site.create({ fictionSites: testUtils.fictionSites, siteId: `test-${shortId()}` })
  const pageTemplates = site.theme.value?.getPageTemplates?.()
  const landingPageTemplate = pageTemplates?.find(t => t.pageTemplateId === 'landing')
  const cards = await landingPageTemplate?.getCards({ site })

  const heroCard = new Card({ site, templateId: 'cardHeroV1' })
  const heroCardConfig = await heroCard.tpl.value?.getConfig?.({ site })
  const zodSchema = heroCardConfig?.schema
  if (!zodSchema)
    throw new Error('No schema found')

  const jsonSchema = zodToJsonSchema(zodSchema) as JsonSchema7ObjectType

  it.only('gets default input config', () => {
    const inputConfig = generateJsonPropConfig({ jsonSchema, userPropConfig: {} })

    expect(jsonSchema).toMatchInlineSnapshot(`
      {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "additionalProperties": false,
        "properties": {
          "items": {
            "description": "Your story chapters - each a unique visual narrative",
            "items": {
              "additionalProperties": false,
              "properties": {
                "action": {
                  "additionalProperties": false,
                  "description": "Call-to-action buttons [@ai]",
                  "properties": {
                    "buttons": {
                      "description": "Interactive buttons [@ai]",
                      "items": {
                        "additionalProperties": false,
                        "description": "ActionButtonSchema",
                        "properties": {
                          "animate": {
                            "description": "Enable button animation",
                            "type": "boolean",
                          },
                          "design": {
                            "description": "Button visual style [@ai]",
                            "enum": [
                              "solid",
                              "ghost",
                              "outline",
                              "link",
                            ],
                            "type": "string",
                          },
                          "disabled": {
                            "type": "boolean",
                          },
                          "format": {
                            "enum": [
                              "block",
                              "spread",
                              "default",
                            ],
                            "type": "string",
                          },
                          "hover": {
                            "enum": [
                              "none",
                              "basic",
                              "rise",
                              "fade",
                              "slide",
                              "pop",
                            ],
                            "type": "string",
                          },
                          "href": {
                            "description": "Button link URL or /path [@ai]",
                            "type": "string",
                          },
                          "icon": {
                            "anyOf": [
                              {
                                "type": "string",
                              },
                              {
                                "$ref": "#/properties/items/items/properties/superTitle/properties/icon",
                              },
                            ],
                            "description": "Button icon [@ai]",
                          },
                          "iconAfter": {
                            "anyOf": [
                              {
                                "type": "string",
                              },
                              {
                                "$ref": "#/properties/items/items/properties/superTitle/properties/icon",
                              },
                            ],
                          },
                          "key": {
                            "description": "Unique key for the button",
                            "type": "string",
                          },
                          "label": {
                            "description": "Button text [@ai]",
                            "type": "string",
                          },
                          "loading": {
                            "type": "boolean",
                          },
                          "rounding": {
                            "enum": [
                              "none",
                              "md",
                              "full",
                            ],
                            "type": "string",
                          },
                          "size": {
                            "description": "Button size",
                            "enum": [
                              "xxs",
                              "xs",
                              "sm",
                              "md",
                              "lg",
                              "xl",
                              "2xl",
                            ],
                            "type": "string",
                          },
                          "target": {
                            "description": "Link target [@ai]",
                            "enum": [
                              "_blank",
                              "_self",
                            ],
                            "type": "string",
                          },
                          "testId": {
                            "type": "string",
                          },
                          "theme": {
                            "description": "Button color scheme [@ai]",
                            "enum": [
                              "primary",
                              "default",
                              "overlay",
                              "theme",
                              "muted",
                              "teal",
                              "cyan",
                              "sky",
                              "blue",
                              "indigo",
                              "violet",
                              "purple",
                              "fuchsia",
                              "pink",
                              "rose",
                              "red",
                              "orange",
                              "amber",
                              "yellow",
                              "lime",
                              "green",
                              "emerald",
                              "slate",
                              "gray",
                              "zinc",
                              "neutral",
                              "stone",
                              "black",
                              "white",
                            ],
                            "type": "string",
                          },
                          "type": {
                            "enum": [
                              "button",
                              "submit",
                              "reset",
                            ],
                            "type": "string",
                          },
                        },
                        "type": "object",
                      },
                      "type": "array",
                    },
                    "design": {
                      "$ref": "#/properties/items/items/properties/action/properties/buttons/items/properties/design",
                      "description": "Visual style",
                    },
                    "proof": {
                      "additionalProperties": false,
                      "description": "Trust indicators",
                      "properties": {
                        "community": {
                          "additionalProperties": false,
                          "description": "Social proof display",
                          "properties": {
                            "count": {
                              "description": "Community size",
                              "type": "number",
                            },
                            "isEnabled": {
                              "description": "Show social proof",
                              "type": "boolean",
                            },
                            "text": {
                              "description": "Social proof message ",
                              "type": "string",
                            },
                            "thumbCount": {
                              "description": "Avatar count to show",
                              "type": "number",
                            },
                          },
                          "type": "object",
                        },
                      },
                      "type": "object",
                    },
                    "size": {
                      "$ref": "#/properties/items/items/properties/action/properties/buttons/items/properties/size",
                      "description": "Component size",
                    },
                    "subscribe": {
                      "additionalProperties": false,
                      "description": "Email capture settings [@ai]",
                      "properties": {
                        "button": {
                          "additionalProperties": false,
                          "description": "buttons [@ai]",
                          "properties": {
                            "icon": {
                              "$ref": "#/properties/items/items/properties/superTitle/properties/icon",
                              "description": "Button icon [@ai]",
                            },
                            "label": {
                              "description": "Button text [@ai]",
                              "type": "string",
                            },
                          },
                          "type": "object",
                        },
                        "input": {
                          "additionalProperties": false,
                          "properties": {
                            "placeholder": {
                              "description": "Email input placeholder [@ai]",
                              "type": "string",
                            },
                          },
                          "type": "object",
                        },
                        "success": {
                          "additionalProperties": false,
                          "properties": {
                            "content": {
                              "description": "Success message content [@ai]",
                              "type": "string",
                            },
                            "title": {
                              "description": "Success message title [@ai]",
                              "type": "string",
                            },
                          },
                          "type": "object",
                        },
                      },
                      "type": "object",
                    },
                    "theme": {
                      "$ref": "#/properties/items/items/properties/action/properties/buttons/items/properties/theme",
                      "description": "Color scheme",
                    },
                    "title": {
                      "description": "Header text above actions [@ai]",
                      "type": "string",
                    },
                    "variant": {
                      "description": "Action type format [@ai]",
                      "enum": [
                        "buttons",
                        "subscribe",
                      ],
                      "type": "string",
                    },
                  },
                  "type": "object",
                },
                "caption": {
                  "description": "Media description [@ai]",
                  "type": "string",
                },
                "layout": {
                  "description": "Content alignment",
                  "enum": [
                    "justify",
                    "center",
                    "left",
                    "right",
                  ],
                  "type": "string",
                },
                "media": {
                  "additionalProperties": false,
                  "description": "Primary visual",
                  "properties": {
                    "alt": {
                      "$ref": "#/properties/items/items/properties/superTitle/properties/icon/properties/alt",
                    },
                    "aspect": {
                      "$ref": "#/properties/items/items/properties/superTitle/properties/icon/properties/aspect",
                    },
                    "el": {
                      "$ref": "#/properties/items/items/properties/superTitle/properties/icon/properties/el",
                    },
                    "format": {
                      "$ref": "#/properties/items/items/properties/superTitle/properties/icon/properties/format",
                    },
                    "html": {
                      "$ref": "#/properties/items/items/properties/superTitle/properties/icon/properties/html",
                    },
                    "props": {
                      "$ref": "#/properties/items/items/properties/superTitle/properties/icon/properties/props",
                    },
                    "url": {
                      "$ref": "#/properties/items/items/properties/superTitle/properties/icon/properties/url",
                    },
                  },
                  "type": "object",
                },
                "overlays": {
                  "description": "Decorative image layers",
                  "items": {
                    "additionalProperties": false,
                    "properties": {
                      "media": {
                        "$ref": "#/properties/items/items/properties/media",
                        "description": "Layer image [@ai]",
                      },
                      "position": {
                        "description": "Layer placement",
                        "enum": [
                          "top",
                          "bottom",
                          "left",
                          "right",
                          "center",
                          "bottomRight",
                          "topRight",
                          "bottomLeft",
                          "topLeft",
                        ],
                        "type": "string",
                      },
                      "widthPercent": {
                        "description": "Layer width %",
                        "type": "number",
                      },
                    },
                    "type": "object",
                  },
                  "type": "array",
                },
                "subTitle": {
                  "description": "Supporting message (10-30 words) [@ai]",
                  "type": "string",
                },
                "superTitle": {
                  "additionalProperties": false,
                  "description": "Small text above title [@ai]",
                  "properties": {
                    "href": {
                      "description": "Link URL [@ai]",
                      "type": "string",
                    },
                    "icon": {
                      "additionalProperties": false,
                      "description": "Visual indicator icon [@ai]",
                      "properties": {
                        "alt": {
                          "type": "string",
                        },
                        "aspect": {
                          "enum": [
                            "square",
                            "portrait",
                            "landscape",
                            "golden",
                            "wide",
                            "tall",
                            "cinema",
                            "panorama",
                          ],
                          "type": "string",
                        },
                        "class": {
                          "description": "tabler iconify class i-tabler-[icon-name]",
                          "type": "string",
                        },
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
                        "iconId": {
                          "description": "iconId is common icon name (e.g. user, check, lock)",
                          "type": "string",
                        },
                        "props": {
                          "additionalProperties": {},
                          "type": "object",
                        },
                        "url": {
                          "type": "string",
                        },
                      },
                      "type": "object",
                    },
                    "text": {
                      "description": "Short text above main title [@ai]",
                      "type": "string",
                    },
                    "theme": {
                      "description": "Color style",
                      "enum": [
                        "primary",
                        "default",
                        "overlay",
                        "theme",
                        "muted",
                        "teal",
                        "cyan",
                        "sky",
                        "blue",
                        "indigo",
                        "violet",
                        "purple",
                        "fuchsia",
                        "pink",
                        "rose",
                        "red",
                        "orange",
                        "amber",
                        "yellow",
                        "lime",
                        "green",
                        "emerald",
                        "slate",
                        "gray",
                        "zinc",
                        "neutral",
                        "stone",
                        "black",
                        "white",
                      ],
                      "type": "string",
                    },
                  },
                  "type": "object",
                },
                "title": {
                  "description": "Main headline (3-13 words) [@ai]",
                  "type": "string",
                },
              },
              "type": "object",
            },
            "type": "array",
          },
        },
        "required": [
          "items",
        ],
        "type": "object",
      }
    `)

    expect(Object.keys(inputConfig)).toMatchInlineSnapshot(`[]`)

    const outputProps = generateOutputProps({ jsonSchema, jsonPropConfig: inputConfig })

    // empty because no isUserEnabled
    expect(outputProps).toStrictEqual({})

    const inputConfig2 = generateJsonPropConfig({
      jsonSchema,
      userPropConfig: {
        title: { isUserEnabled: true },
        subTitle: { isUserEnabled: true },
      },
    })
    const outputProps2 = generateOutputProps({ jsonSchema, jsonPropConfig: inputConfig2 })

    expect(Object.values(inputConfig2).filter(c => c.isUserEnabled).length).toBe(2)
    expect(Object.values(outputProps2).filter(c => c.description).length).toBe(2)
  })

  it('parses description correctly', () => {
    const description = 'This is a test [@ai seconds=4 type=image]'
    const result = parseDescription(description)
    expect(result).toEqual({
      description: 'This is a test',
      attributes: { seconds: 4, type: 'image' },
      hasTag: true,
    })
  })

  it('parses description with empty attributes correctly', () => {
    const description = 'Only description'
    const result = parseDescription(description)
    expect(result).toEqual({
      description: 'Only description',
      attributes: {},
      hasTag: false,
    })
  })

  it('generates output props correctly', () => {
    const jsonSchema = {
      properties: {
        title: { type: 'string', description: 'Primary hero headline, 3 to 13 words' },
        subTitle: { type: 'string', description: 'Secondary hero headline, 10 to 30 words' },
      },
    } as unknown as JsonSchema7ObjectType

    const jsonPropConfig = {
      title: { isUserEnabled: true, prompt: 'Custom title' },
      subTitle: { isUserEnabled: false, prompt: 'Custom subtitle' },
    }

    const result = generateOutputProps({ jsonSchema, jsonPropConfig })

    expect(result).toEqual({
      title: { type: 'string', description: 'Custom title' },
    })
  })

  it('handles missing descriptions in generateJsonPropConfig', () => {
    const jsonSchema = {
      properties: {
        title: { type: 'string' },
      },
    } as unknown as JsonSchema7ObjectType

    const userPropConfig = {
      title: { isUserEnabled: true, hasTag: true },
    }

    const result = generateJsonPropConfig({ jsonSchema, userPropConfig })

    expect(result).toEqual({ })
  })

  it('handles numeric meta correctly in parseDescription', () => {
    const description = 'This is a test [@ai time=40 count=10]'
    const result = parseDescription(description)
    expect(result).toEqual({
      description: 'This is a test',
      attributes: { time: 40, count: 10 },
      hasTag: true,
    })
  })

  it('calculates total estimated time correctly', () => {
    const jsonPropConfig = {
      title: { isUserEnabled: true, estimatedMs: 5000 },
      subTitle: { isUserEnabled: true, estimatedMs: 3000 },
      media: { isUserEnabled: false, estimatedMs: 10000 },
    }

    const result = calculateTotalEstimatedTimeSeconds({ jsonPropConfig })

    expect(result).toBe(8) // (5000 + 3000) / 1000
  })

  it('returns zero for total estimated time with no enabled fields', () => {
    const jsonPropConfig = {
      title: { isUserEnabled: false, estimatedMs: 5000 },
      subTitle: { isUserEnabled: false, estimatedMs: 3000 },
    }

    const result = calculateTotalEstimatedTimeSeconds({ jsonPropConfig })

    expect(result).toBe(0)
  })

  it('returns correct cumulative time in generateJsonPropConfig', () => {
    const jsonSchema = {
      properties: {
        title: { type: 'string', description: 'Primary hero headline, 3 to 13 words' },
        subTitle: { type: 'string', description: 'Secondary hero headline, 10 to 30 words [@ai]' },
      },
    } as unknown as JsonSchema7ObjectType

    const userPropConfig = {
      title: { isUserEnabled: true },
      subTitle: { isUserEnabled: true },
    }

    const result = generateJsonPropConfig({ jsonSchema, userPropConfig })

    expect(result).toEqual({
      subTitle: {
        key: 'subTitle',
        label: 'Sub Title',
        prompt: 'Secondary hero headline, 10 to 30 words',
        estimatedMs: 4000,
        cumulativeTime: 4000,
        isUserEnabled: true,
        hasTag: true,
      },
    })
  })
})

describe('simulateProgress', () => {
  it('simulates progress correctly', async () => {
    const jsonPropConfig: Record<string, InputOptionGeneration> = {
      title: { isUserEnabled: true, label: 'title', cumulativeTime: 5000 },
      subTitle: { isUserEnabled: true, label: 'subTitle', cumulativeTime: 10000 },
    }

    const totalEstimatedTime = 15 // 15 seconds
    const updateProgress = vi.fn()
    vi.useFakeTimers()

    const { complete } = simulateProgress({
      totalEstimatedTime,
      jsonPropConfig,
      updateProgress,
    })

    // Initial call to tick
    expect(updateProgress).toHaveBeenCalledWith({ percent: 3, status: 'Generating title' })

    // Advance time by 5 seconds (1/3 of totalEstimatedTime)
    await vi.advanceTimersByTimeAsync(5000)
    expect(updateProgress).toHaveBeenCalledWith({ percent: 33, status: 'Generating title' })

    // Advance time by another 5 seconds (2/3 of totalEstimatedTime)
    await vi.advanceTimersByTimeAsync(5000)
    expect(updateProgress).toHaveBeenCalledWith({ percent: 67, status: 'Generating subTitle' })

    // Advance time by another 5 seconds (3/3 of totalEstimatedTime)
    await vi.advanceTimersByTimeAsync(5000)
    expect(updateProgress).toHaveBeenCalledWith({ percent: 100, status: 'Wrapping up...' })

    complete()
    expect(updateProgress).toHaveBeenCalledWith({ percent: 100, status: 'Complete!' })

    vi.useRealTimers()
  })
})
