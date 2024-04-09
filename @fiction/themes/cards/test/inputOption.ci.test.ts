import { afterEach, describe, expect, it } from 'vitest'
import * as zSchema from 'zod-to-json-schema'
import { InputOption, getOptionSchema } from '@fiction/ui/inputs'
import { standardOption } from '../inputSets'
import { refineOptions } from '../utils/refiner'

describe('getOptionSchema', () => {
  it('generates a schema for simple fields', () => {
    const options = [
      new InputOption({
        key: 'name',
        schema: ({ z }) => z.string().min(1),
      }),
      new InputOption({
        key: 'age',
        schema: ({ z }) => z.number().positive(),
      }),
    ]

    const schema = getOptionSchema(options)

    if (!schema)
      throw new Error('Schema is undefined')

    const result = schema.safeParse({ name: 'John Doe', age: 30 })
    expect(result.success).toBe(true)
    if (result.success)
      expect(result.data).toEqual({ name: 'John Doe', age: 30 })
  })

  it('handles nested options correctly', () => {
    const options = [
      new InputOption({
        key: 'users',
        schema: ({ z, subSchema }) => z.array(subSchema).min(1).max(3),
        options: [
          new InputOption({
            key: 'profile',
            schema: ({ z }) => z.object({
              name: z.string(),
              age: z.number().positive(),
            }),
          }),
        ],
      }),
    ]

    const schema = getOptionSchema(options)

    if (!schema)
      throw new Error('Schema is undefined')

    const r = zSchema.zodToJsonSchema(schema)
    expect(r).toMatchInlineSnapshot(`
      {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "additionalProperties": false,
        "properties": {
          "users": {
            "description": "users",
            "items": {
              "additionalProperties": false,
              "properties": {
                "profile": {
                  "additionalProperties": false,
                  "description": "profile",
                  "properties": {
                    "age": {
                      "exclusiveMinimum": 0,
                      "type": "number",
                    },
                    "name": {
                      "type": "string",
                    },
                  },
                  "required": [
                    "name",
                    "age",
                  ],
                  "type": "object",
                },
              },
              "required": [
                "profile",
              ],
              "type": "object",
            },
            "maxItems": 3,
            "minItems": 1,
            "type": "array",
          },
        },
        "required": [
          "users",
        ],
        "type": "object",
      }
    `)
    const result = schema.safeParse({ users: [{ profile: { name: 'Jane Doe', age: 25 } }] })
    expect(result.success).toBe(true)
    if (result.success)
      expect(result.data).toEqual({ users: [{ profile: { name: 'Jane Doe', age: 25 } }] })
  })

  it('handles arrays of nested objects correctly', () => {
    const options = [
      new InputOption({
        key: 'users',
        schema: ({ z, subSchema }) => z.array(subSchema),
        options: [
          new InputOption({
            key: 'user',
            schema: ({ z }) => z.object({
              name: z.string(),
              age: z.number().positive(),
            }),
          }),
        ],
      }),
    ]

    const schema = getOptionSchema(options)

    if (!schema)
      throw new Error('Schema is undefined')

    const result = schema.safeParse({
      users: [
        { user: { name: 'John Doe', age: 30 } },
        { user: { name: 'Jane Doe', age: 25 } },
      ],
    })
    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data).toEqual({
        users: [
          { user: { name: 'John Doe', age: 30 } },
          { user: { name: 'Jane Doe', age: 25 } },
        ],
      })
    }
  })
})

describe('navItemOptionSet Schema Generation', () => {
  afterEach(() => {

  })
  it('initializes correctly and returns all input options', () => {
    const option = standardOption.navItems({ key: 'nav', refine: {} })

    expect(option.options.value.length).toBe(2)
    expect(option.options.value[0].key.value).toBe('navTitle')
    expect(option.options.value[1].key.value).toBe('nav')
  })

  it('refines options', () => {
    const baseOption = standardOption.navItems({ key: 'list' })

    const refine = {
      'title': false,
      'list.name': 'test prompt',
      'list.desc': 'test describe',
      'list.href': false,
    }

    const options = refineOptions({ inputOptions: [baseOption], refine })

    const option = options[0]

    expect(option.options.value.length, 'nav items should be title and inputList').toBe(2)
    expect(option.options.value[0].key.value).toBe('listTitle')
    expect(option.options.value[1].key.value).toBe('list')

    const visibleOptions = option.options.value[1].options.value.filter(_ => !_.isHidden.value)
    expect(visibleOptions.map(option => option.key.value)).toEqual(['name', 'desc', 'target'])

    expect(visibleOptions.length, 'all options without href').toBe(3)

    const schema = getOptionSchema([option])

    if (!schema)
      throw new Error('Schema is undefined')

    const s = zSchema.zodToJsonSchema(schema) as Record<string, any>

    expect(s.properties.list.items.properties.desc.description).toBe('test describe')

    expect(s.properties).toMatchInlineSnapshot(`
      {
        "list": {
          "description": "Nav Items",
          "items": {
            "additionalProperties": false,
            "properties": {
              "desc": {
                "description": "test describe",
                "type": "string",
              },
              "href": {
                "description": "Link / Route",
                "type": "string",
              },
              "name": {
                "description": "test prompt",
                "type": "string",
              },
              "target": {
                "description": "Target",
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
        "listTitle": {
          "description": "Nav Items Title",
          "type": "string",
        },
      }
    `)
  })

  it('generates correct schema for NavItemOptionSet with nested and list options', () => {
    const options = standardOption.navItems({ label: 'Nav', key: 'nav' })

    const schema = getOptionSchema([options])

    if (!schema)
      throw new Error('Schema is undefined')

    expect(zSchema.zodToJsonSchema(schema)).toMatchInlineSnapshot(`
      {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "additionalProperties": false,
        "properties": {
          "nav": {
            "description": "Nav",
            "items": {
              "additionalProperties": false,
              "properties": {
                "desc": {
                  "description": "Description",
                  "type": "string",
                },
                "href": {
                  "description": "Link / Route",
                  "type": "string",
                },
                "name": {
                  "description": "Text",
                  "type": "string",
                },
                "target": {
                  "description": "Target",
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
          "navTitle": {
            "description": "Nav Title",
            "type": "string",
          },
        },
        "required": [
          "nav",
        ],
        "type": "object",
      }
    `)

    const validInput = {
      navTitle: 'Navigation Title',
      nav: [
        {
          name: 'Home',
          desc: 'Home Page',
          href: '/home',
          target: '_self',
        },
        {
          name: 'About',
          desc: 'About Page',
          href: '/about',
          target: '_blank',
        },
      ],
    }

    const validResult = schema.parse(validInput)

    expect(validResult).toEqual(validInput)

    const invalidInput = {
      navTitle: 'Nav',
      nav: [
        {
          name: 'Some Name',
          desc: 'A description that is valid.',
          href: 'http://example.com',
          target: '_self',
        },
      ],
    }

    const invalidResult = schema.safeParse(invalidInput)
    expect(invalidResult.success).toBe(true)
  })
})

describe('headerOptionSet', () => {
  it('initializes correctly and returns all input options', () => {
    const option = standardOption.headers()
    const subOptions = option.options.value || []
    expect(option.options.value.length).toBe(3)
    expect(subOptions[0].key.value).toBe('heading')
    expect(subOptions[1].key.value).toBe('subHeading')
    expect(subOptions[2].key.value).toBe('superHeading')
  })

  it('filters options based on refine', () => {
    const opt = standardOption.headers()

    const refine = {
      superHeading: false,
    }

    const filteredOptions = refineOptions({ inputOptions: [opt], refine })
    const visibleOptions = filteredOptions[0].options.value.filter(_ => !_.isHidden.value)
    expect(visibleOptions.length).toBe(2)
    expect(visibleOptions.map(option => option.key.value)).toEqual(['heading', 'subHeading'])
  })
})
