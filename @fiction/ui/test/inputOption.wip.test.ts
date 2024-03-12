import { afterEach, describe, expect, it, vi } from 'vitest'
import * as zSchema from 'zod-to-json-schema'
import type { Refinement } from '../inputs'
import { InputOption, InputOptionsRefiner, OptionSet, getOptionSchema } from '../inputs'

describe('inputOptionsRefiner', () => {
  // Test for nested refine
  it('correctly filters options using nested refine', () => {
    const inputOptions = [
      new InputOption({ key: 'option1', options: [
        new InputOption({ key: 'subOption1' }),
        new InputOption({ key: 'subOption2' }),
        new InputOption({ key: 'subOption3' }),
      ] }),
      new InputOption({ key: 'option2', options: [
        new InputOption({ key: 'subOption1' }),
        new InputOption({ key: 'subOption2' }),
      ] }),
      new InputOption({ key: 'option3', aliasKey: 'option3Alias', options: [
        new InputOption({ key: 'subOption1' }),
        new InputOption({ key: 'subOption2', aliasKey: 'subAlias' }),
      ] }),
    ]

    const caller = 'test1'
    const consoleWarnSpy = vi.spyOn(console, 'warn')
    const refiner = new InputOptionsRefiner({ basePath: '', caller })
    const r1 = refiner.refineInputOptions({
      inputOptions,
      refine: {
        option1: { refine: { subOption1: true, subOptionNoExist: true } },
        option2: true,
        option3Alias: { refine: { subAlias: true } },
      },
    })

    expect(r1[0].options.value?.length).toBe(1)
    expect(r1[0].options.value?.[0].key.value).toBe('subOption1')

    expect(r1[1].options.value.map(_ => _.key.value)).toMatchInlineSnapshot(`
      [
        "subOption1",
        "subOption2",
      ]
    `)
    expect(r1[1].options.value?.length).toBe(2)
    expect(r1[1].options.value?.[0].key.value).toBe('subOption1')
    expect(r1[1].options.value?.[1].key.value).toBe('subOption2')

    expect(r1[2].options.value?.length).toBe(1)
    expect(r1[2].options.value?.[0].key.value).toBe('subOption2')

    expect(consoleWarnSpy).toHaveBeenCalledWith(`Warning: Filter key 'option1.subOptionNoExist' provided by '${caller}' was not used.`)
    consoleWarnSpy.mockRestore()
  })
  it('does not alter options without refine or basePath', () => {
    const inputOptions = [
      new InputOption({ key: 'option1', options: [new InputOption({ key: 'subOption1' })] }),
      new InputOption({ key: 'option2' }),
    ]
    const refiner = new InputOptionsRefiner({ basePath: '', caller: `test2` })
    const r2 = refiner.refineInputOptions({ inputOptions, refine: { } })

    expect(r2).toEqual(inputOptions)
  })

  it('warns about unused filter keys', () => {
    const inputOptions = [
      new InputOption({ key: 'option1', options: [new InputOption({ key: 'subOption1' })] }),
      new InputOption({ key: 'option2' }),
    ]

    const consoleWarnSpy = vi.spyOn(console, 'warn')
    const refine = { option1: true, option3: true }
    const basePath = 'base'
    const caller = `test3`
    const refiner = new InputOptionsRefiner({ basePath, caller })
    refiner.refineInputOptions({ inputOptions, refine })

    expect(consoleWarnSpy).toHaveBeenCalledWith(`Warning: Filter key 'option3' provided by '${caller}' was not used.`)
    consoleWarnSpy.mockRestore()
  })
  it('filters options based on refine and prepends basePath at depth 0', () => {
    const inputOptions = [
      new InputOption({ key: 'option1', options: [new InputOption({ key: 'subOption1' })] }),
      new InputOption({ key: 'option2' }),
    ]

    const refine = { option1: true, option2: true }
    const basePath = 'base'

    const refiner = new InputOptionsRefiner({ basePath, caller: `test4` })
    const result = refiner.refineInputOptions({ inputOptions, refine })

    expect(result.length).toBe(2)
    expect(result.length).toMatchInlineSnapshot(`2`)
    expect(result.map(_ => _.toConfig())).toMatchInlineSnapshot(`
      [
        {
          "aliasKey": "base.option1",
          "key": "base.option1",
          "options": [
            {
              "aliasKey": "subOption1",
              "key": "subOption1",
              "options": [],
              "props": {
                "key": "subOption1",
                "options": [],
                "required": false,
              },
            },
          ],
          "props": {
            "key": "base.option1",
            "options": [
              {
                "aliasKey": "subOption1",
                "key": "subOption1",
                "options": [],
                "props": {
                  "key": "subOption1",
                  "options": [],
                  "required": false,
                },
              },
            ],
            "required": false,
          },
        },
        {
          "aliasKey": "base.option2",
          "key": "base.option2",
          "options": [],
          "props": {
            "key": "base.option2",
            "options": [],
            "required": false,
          },
        },
      ]
    `)

    expect(result[0].key.value).toEqual('base.option1')
    expect(result[0].options.value?.[0].key.value).toEqual('subOption1')
    expect(result[1].key.value).toEqual('base.option2')
  })
})

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

const headerOptionSet = new OptionSet ({
  inputOptions() {
    return [
      new InputOption({
        key: 'heading',
        label: 'Heading',
        input: 'InputTextarea',
        props: { maxHeight: 250 },
        default: () => 'Headline',
        schema: ({ z }) => z.string(),
      }),
      new InputOption({
        key: 'subHeading',
        label: 'Sub Heading',
        input: 'InputTextarea',
        props: { maxHeight: 250 },
        default: () => 'Sub headline',
        schema: ({ z }) => z.string().optional(),
      }),
      new InputOption({
        key: 'superHeading',
        label: 'Super Heading',
        input: 'InputTextarea',
        props: { maxHeight: 250 },
        default: () => 'Super Headline',
        schema: ({ z }) => z.string().optional(),
      }),
    ]
  },
})

const navItemOptionSet = new OptionSet<{ refine?: { title?: Refinement, list?: Refinement<{ name?: Refinement, desc?: Refinement, href?: Refinement, target?: Refinement }> } }>({
  inputOptions(args): InputOption[] {
    const label = args?.label || 'Nav'
    const groupPath = args?.groupPath || 'nav'
    const listOptions = [
      new InputOption({
        key: 'name',
        label: 'Text',
        input: 'InputText',
        schema: ({ z }) => z.string(),
      }),
      new InputOption({
        key: 'desc',
        label: 'Description',
        input: 'InputTextarea',
        schema: ({ z }) => z.string().optional(),
      }),
      new InputOption({
        key: 'href',
        label: 'Link / Route',
        input: 'InputText',
        schema: ({ z }) => z.string().refine((val) => {
          // Simple regex to allow relative paths and full URLs
          const pattern = /^(\/[^\s]*)|([a-z]+:\/\/[^\s]*)$/i
          return pattern.test(val)
        }),
      }),
      new InputOption({
        key: 'target',
        label: 'Target',
        input: 'InputSelect',
        list: [
          { name: 'Normal', value: '_self' },
          { name: 'New Window', value: '_blank' },
        ],
        schema: ({ z }) => z.enum(['_self', '_blank']).optional(),
      }),
    ]

    const out = [
      new InputOption({
        aliasKey: 'title',
        key: `${groupPath}Title`,
        label: `${label} Title`,
        input: 'InputText',
        schema: ({ z }) => z.string().optional(),
      }),
      new InputOption({
        aliasKey: 'list',
        key: `${groupPath}`,
        input: 'InputList',
        options: listOptions,
        schema: ({ z, subSchema }) => z.array(subSchema),
      }),
    ]

    return [new InputOption({ label, input: 'group', options: out, key: 'grp' })]
  },
})

describe('navItemOptionSet Schema Generation', () => {
  afterEach(() => {
    navItemOptionSet.refiner.usedKeys.clear()
  })
  it('initializes correctly and returns all input options', () => {
    const options = navItemOptionSet.toOptions({ basePath: 'test', refine: {} })

    expect(options[0].options.value.length).toBe(2)
    expect(options[0].options.value[0].key.value).toBe('test.navTitle')
    expect(options[0].options.value[1].key.value).toBe('test.nav')

    expect(navItemOptionSet.refiner.usedKeys).toMatchInlineSnapshot(`Set {}`)
  })

  it('refines options', () => {
    const options = navItemOptionSet.toOptions({ groupPath: 'list', refine: { title: true, list: { refine: { name: true, desc: 'test describe', href: false } } } })

    expect(options[0].options.value.length).toBe(2)
    expect(options[0].options.value[0].key.value).toBe('listTitle')
    expect(options[0].options.value[1].key.value).toBe('list')

    expect(options[0].options.value[1].options.value.length).toBe(2)

    expect(navItemOptionSet.refiner.usedKeys).toMatchInlineSnapshot(`
      Set {
        "title",
        "list",
        "list.name",
        "list.desc",
      }
    `)

    const schema = getOptionSchema(options)

    if (!schema)
      throw new Error('Schema is undefined')

    const s = zSchema.zodToJsonSchema(schema) as Record<string, any>

    expect(s.properties.list.items.properties.desc.description).toBe('test describe')

    expect(s.properties).toMatchInlineSnapshot(`
      {
        "list": {
          "description": "list",
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
        "listTitle": {
          "description": "Nav Title",
          "type": "string",
        },
      }
    `)
  })

  it('generates correct schema for NavItemOptionSet with nested and list options', () => {
    const options = navItemOptionSet.toOptions({ label: 'Nav', groupPath: 'nav' })

    expect(options.length).toMatchInlineSnapshot(`1`)
    const schema = getOptionSchema(options)

    if (!schema)
      throw new Error('Schema is undefined')

    expect(zSchema.zodToJsonSchema(schema)).toMatchInlineSnapshot(`
      {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "additionalProperties": false,
        "properties": {
          "nav": {
            "description": "nav",
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
    const options = headerOptionSet.toOptions()

    expect(options.length).toBe(3)
    expect(options[0].key.value).toBe('heading')
    expect(options[1].key.value).toBe('subHeading')
    expect(options[2].key.value).toBe('superHeading')
  })

  it('filters options based on refine', () => {
    const filteredOptions = headerOptionSet.toOptions({ refine: { heading: true, subHeading: true } })

    expect(filteredOptions.length).toBe(2)
    expect(filteredOptions.map(option => option.key.value)).toEqual(['heading', 'subHeading'])
  })

  it('prefixes option keys with basePath correctly', () => {
    const options = headerOptionSet.toOptions({ basePath: 'header' })

    expect(options[0].key.value).toBe('header.heading')
    expect(options[1].key.value).toBe('header.subHeading')
    expect(options[2].key.value).toBe('header.superHeading')
  })

  it('correctly filters options using both basePath and refine', () => {
    const options = headerOptionSet.toOptions({ basePath: 'header', refine: { heading: true, superHeading: true } })

    expect(options.length).toBe(2)
    expect(options.map(option => option.key.value)).toMatchInlineSnapshot(`
      [
        "header.heading",
        "header.superHeading",
      ]
    `)
    expect(options.map(option => option.key.value)).toEqual(['header.heading', 'header.superHeading'])
  })
})
