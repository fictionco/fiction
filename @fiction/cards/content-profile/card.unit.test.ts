import { refineOptions } from '@fiction/site/utils/schema'
import { describe, expect, it } from 'vitest'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { template } from '.'

describe('minimalProfile', async () => {
  const config = await template.getConfig({})
  it('has correct schema', async () => {
    if (!config?.schema)
      throw new Error('no schema')

    const tpl = template

    if (!tpl)
      throw new Error('no template')

    const conf = await refineOptions({
      options: config.options || [],
      schema: config.schema,
      templateId: tpl.settings.templateId,
    })

    expect(conf.unusedSchema).toMatchInlineSnapshot(`{}`)

    const jsonSchema = zodToJsonSchema(config.schema)
    expect(jsonSchema).toMatchInlineSnapshot(`
      {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "additionalProperties": false,
        "properties": {
          "action": {
            "additionalProperties": false,
            "description": "List of social media links",
            "properties": {
              "buttons": {
                "description": "Interactive buttons [ai]",
                "items": {
                  "additionalProperties": false,
                  "description": "ActionButtonSchema",
                  "properties": {
                    "design": {
                      "description": "Button visual style [ai]",
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
                      "description": "Button link URL or /path [ai]",
                      "type": "string",
                    },
                    "icon": {
                      "anyOf": [
                        {
                          "type": "string",
                        },
                        {
                          "$ref": "#/properties/superTitle/properties/icon",
                        },
                      ],
                      "description": "Button icon [ai]",
                    },
                    "iconAfter": {
                      "anyOf": [
                        {
                          "type": "string",
                        },
                        {
                          "$ref": "#/properties/superTitle/properties/icon",
                        },
                      ],
                    },
                    "label": {
                      "description": "Button text [ai]",
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
                      "description": "Button color scheme [ai]",
                      "enum": [
                        "theme",
                        "primary",
                        "default",
                        "overlay",
                        "naked",
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
                "type": "array",
              },
              "design": {
                "$ref": "#/properties/action/properties/buttons/items/properties/design",
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
                "$ref": "#/properties/action/properties/buttons/items/properties/size",
                "description": "Component size",
              },
              "subscribe": {
                "additionalProperties": false,
                "description": "Email capture settings [ai]",
                "properties": {
                  "button": {
                    "additionalProperties": false,
                    "description": "buttons [ai]",
                    "properties": {
                      "icon": {
                        "$ref": "#/properties/superTitle/properties/icon",
                        "description": "Button icon [ai]",
                      },
                      "label": {
                        "description": "Button text [ai]",
                        "type": "string",
                      },
                    },
                    "type": "object",
                  },
                  "input": {
                    "additionalProperties": false,
                    "properties": {
                      "placeholder": {
                        "description": "Email input placeholder [ai]",
                        "type": "string",
                      },
                    },
                    "type": "object",
                  },
                  "success": {
                    "additionalProperties": false,
                    "properties": {
                      "content": {
                        "description": "Success message content [ai]",
                        "type": "string",
                      },
                      "title": {
                        "description": "Success message title [ai]",
                        "type": "string",
                      },
                    },
                    "type": "object",
                  },
                },
                "type": "object",
              },
              "theme": {
                "$ref": "#/properties/action/properties/buttons/items/properties/theme",
                "description": "Color scheme",
              },
              "title": {
                "description": "Header text above actions [ai]",
                "type": "string",
              },
              "variant": {
                "description": "Action type format [ai]",
                "enum": [
                  "buttons",
                  "subscribe",
                ],
                "type": "string",
              },
            },
            "type": "object",
          },
          "content": {
            "description": "Formatted markdown of profile with paragraphs, 30 to 60 words, 2 paragraphs [ai]",
            "type": "string",
          },
          "details": {
            "description": "List of details with contact details, location, etc.",
            "items": {
              "additionalProperties": false,
              "description": "NavListItemSchema",
              "properties": {
                "href": {
                  "description": "Navigation URL - internal path or external link",
                  "type": "string",
                },
                "icon": {
                  "$ref": "#/properties/superTitle/properties/icon",
                  "description": "Leading icon shown before the label",
                },
                "label": {
                  "description": "Primary text displayed for the item (e.g., "Products")",
                  "type": "string",
                },
                "value": {
                  "description": "Value associated with the item",
                  "type": [
                    "string",
                    "number",
                  ],
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
            "description": "Splash pictures in portrait format [ai seconds=40]",
            "items": {
              "additionalProperties": false,
              "description": "NavListItemSchema",
              "properties": {
                "media": {
                  "additionalProperties": false,
                  "description": "Media content shown with the item",
                  "properties": {
                    "alt": {
                      "$ref": "#/properties/superTitle/properties/icon/properties/alt",
                    },
                    "aspect": {
                      "$ref": "#/properties/superTitle/properties/icon/properties/aspect",
                    },
                    "backgroundColor": {
                      "type": "string",
                    },
                    "backgroundPosition": {
                      "enum": [
                        "center",
                        "top",
                        "bottom",
                        "left",
                        "right",
                      ],
                      "type": "string",
                    },
                    "backgroundRepeat": {
                      "enum": [
                        "repeat",
                        "no-repeat",
                        "repeat-x",
                        "repeat-y",
                      ],
                      "type": "string",
                    },
                    "backgroundSize": {
                      "enum": [
                        "cover",
                        "contain",
                        "auto",
                      ],
                      "type": "string",
                    },
                    "blurhash": {
                      "type": "string",
                    },
                    "caption": {
                      "type": "string",
                    },
                    "class": {
                      "$ref": "#/properties/superTitle/properties/icon/properties/class",
                    },
                    "displayHeightPercent": {
                      "type": "number",
                    },
                    "displayWidthPercent": {
                      "type": "number",
                    },
                    "el": {
                      "$ref": "#/properties/superTitle/properties/icon/properties/el",
                    },
                    "filters": {
                      "items": {
                        "additionalProperties": false,
                        "properties": {
                          "filter": {
                            "enum": [
                              "brightness",
                              "opacity",
                              "contrast",
                              "blur",
                              "grayscale",
                              "sepia",
                              "saturate",
                              "invert",
                              "hue-rotate",
                            ],
                            "type": "string",
                          },
                          "percent": {
                            "maximum": 100,
                            "minimum": 0,
                            "type": "number",
                          },
                          "value": {
                            "type": "string",
                          },
                        },
                        "type": "object",
                      },
                      "type": "array",
                    },
                    "format": {
                      "$ref": "#/properties/superTitle/properties/icon/properties/format",
                    },
                    "gradient": {
                      "additionalProperties": false,
                      "properties": {
                        "angle": {
                          "maximum": 360,
                          "minimum": 0,
                          "type": "number",
                        },
                        "css": {
                          "type": "string",
                        },
                        "stops": {
                          "items": {
                            "additionalProperties": false,
                            "properties": {
                              "color": {
                                "type": "string",
                              },
                              "opacity": {
                                "maximum": 1,
                                "minimum": 0,
                                "type": "number",
                              },
                              "position": {
                                "maximum": 100,
                                "minimum": 0,
                                "type": "number",
                              },
                              "scale": {
                                "enum": [
                                  0,
                                  25,
                                  50,
                                  100,
                                  200,
                                  300,
                                  400,
                                  500,
                                  600,
                                  700,
                                  800,
                                  900,
                                  950,
                                  975,
                                  1000,
                                ],
                                "type": "number",
                              },
                              "theme": {
                                "enum": [
                                  "theme",
                                  "primary",
                                  "default",
                                  "overlay",
                                  "naked",
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
                                  "themeInverted",
                                  "primaryInverted",
                                  "defaultInverted",
                                  "overlayInverted",
                                  "nakedInverted",
                                  "tealInverted",
                                  "cyanInverted",
                                  "skyInverted",
                                  "blueInverted",
                                  "indigoInverted",
                                  "violetInverted",
                                  "purpleInverted",
                                  "fuchsiaInverted",
                                  "pinkInverted",
                                  "roseInverted",
                                  "redInverted",
                                  "orangeInverted",
                                  "amberInverted",
                                  "yellowInverted",
                                  "limeInverted",
                                  "greenInverted",
                                  "emeraldInverted",
                                  "slateInverted",
                                  "grayInverted",
                                  "zincInverted",
                                  "neutralInverted",
                                  "stoneInverted",
                                  "blackInverted",
                                  "whiteInverted",
                                ],
                                "type": "string",
                              },
                            },
                            "type": "object",
                          },
                          "type": "array",
                        },
                        "type": {
                          "enum": [
                            "linear",
                            "radial",
                            "conic",
                          ],
                          "type": "string",
                        },
                      },
                      "type": "object",
                    },
                    "height": {
                      "type": "number",
                    },
                    "html": {
                      "$ref": "#/properties/superTitle/properties/icon/properties/html",
                    },
                    "iconId": {
                      "$ref": "#/properties/superTitle/properties/icon/properties/iconId",
                    },
                    "mime": {
                      "type": "string",
                    },
                    "modify": {
                      "additionalProperties": false,
                      "properties": {
                        "flip": {
                          "enum": [
                            "horizontal",
                            "vertical",
                          ],
                          "type": "string",
                        },
                      },
                      "type": "object",
                    },
                    "overlay": {
                      "additionalProperties": false,
                      "properties": {
                        "blendMode": {
                          "enum": [
                            "normal",
                            "multiply",
                            "screen",
                            "overlay",
                            "darken",
                            "lighten",
                            "color-dodge",
                            "color-burn",
                            "hard-light",
                            "soft-light",
                            "difference",
                            "exclusion",
                            "hue",
                            "saturation",
                            "color",
                            "luminosity",
                          ],
                          "type": "string",
                        },
                        "color": {
                          "type": "string",
                        },
                        "gradient": {
                          "$ref": "#/properties/mediaItems/items/properties/media/properties/gradient",
                        },
                        "opacity": {
                          "maximum": 100,
                          "minimum": 0,
                          "type": "number",
                        },
                      },
                      "type": "object",
                    },
                    "props": {
                      "$ref": "#/properties/superTitle/properties/icon/properties/props",
                    },
                    "tags": {
                      "items": {
                        "type": "string",
                      },
                      "type": "array",
                    },
                    "thumbUrl": {
                      "type": "string",
                    },
                    "url": {
                      "$ref": "#/properties/superTitle/properties/icon/properties/url",
                    },
                    "videoControls": {
                      "additionalProperties": false,
                      "description": "Video playback controls",
                      "properties": {
                        "autoplay": {
                          "type": "boolean",
                        },
                        "controls": {
                          "type": "boolean",
                        },
                        "freeze": {
                          "additionalProperties": false,
                          "description": "Video freeze settings",
                          "properties": {
                            "playOnHover": {
                              "description": "Play on hover, freeze on blur",
                              "type": "boolean",
                            },
                            "time": {
                              "description": "Time in seconds to freeze video",
                              "type": "number",
                            },
                          },
                          "type": "object",
                        },
                        "loop": {
                          "type": "boolean",
                        },
                        "muted": {
                          "type": "boolean",
                        },
                        "playbackRate": {
                          "maximum": 16,
                          "minimum": 0.1,
                          "type": "number",
                        },
                        "playsinline": {
                          "type": "boolean",
                        },
                        "poster": {
                          "type": "string",
                        },
                        "preload": {
                          "enum": [
                            "none",
                            "metadata",
                            "auto",
                          ],
                          "type": "string",
                        },
                      },
                      "type": "object",
                    },
                    "width": {
                      "type": "number",
                    },
                  },
                  "type": "object",
                },
              },
              "type": "object",
            },
            "type": "array",
          },
          "superTitle": {
            "additionalProperties": false,
            "properties": {
              "icon": {
                "additionalProperties": false,
                "description": "Visual indicator icon [ai]",
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
                "description": "Short text above main title [ai]",
                "type": "string",
              },
              "theme": {
                "description": "Color style",
                "enum": [
                  "theme",
                  "primary",
                  "default",
                  "overlay",
                  "naked",
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
            "description": "Primary headline for profile 3 to 8 words [ai]",
            "type": "string",
          },
        },
        "type": "object",
      }
    `)
  })
})
