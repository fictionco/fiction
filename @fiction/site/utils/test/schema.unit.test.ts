import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { InputOption } from '@fiction/ui'
import { collectKeysFromOptions, refineOptions, zodSchemaToDotPathRecord, zodToSimpleSchema } from '../schema'

describe('schema tools', () => {
  const options = [
    new InputOption({ key: 'text', label: 'test', input: 'InputText' }),
    new InputOption({ key: 'sub', label: 'whatever', input: 'InputList', options: [
      new InputOption({ key: 'subText', label: 'subText', input: 'InputText' }),
      new InputOption({ key: 'author.name', label: 'Author', input: 'InputText' }),
      new InputOption({ key: 'author.title', label: 'Title', input: 'InputText' }),
    ] }),
    new InputOption({ key: 'grp', label: 'Group 1', input: 'group', options: [
      new InputOption({ key: 'groupInput', label: 'subText', input: 'InputTextarea' }),
    ] }),
    new InputOption({ key: 'media', label: 'test', input: 'InputMediaDisplay' }),
  ]

  const schema = z.object({
    text: z.string().optional(),
    sub: z.array(z.object({
      subText: z.string().optional(),
      author: z.object({
        name: z.string().optional(),
        title: z.string().optional(),
      }),
    })).optional(),
    groupInput: z.string().optional(),
    media: z.object({
      url: z.string().optional(),
      format: z.string().optional(),
      html: z.string().optional(),
    }).optional(),
  })

  const schema2 = schema.extend({
    extra: z.string().optional(),
  })

  it('rectifies options with schema', () => {
    const out = refineOptions({ options, schema })

    expect(out.unusedSchema).toMatchInlineSnapshot(`{}`)

    expect(Object.keys(out?.unusedSchema || { f: '', f2: '' }).length).toBe(0)

    expect(out.hiddenOptions).toMatchInlineSnapshot(`[]`)

    expect(out.hiddenOptions.length).toBe(0)

    const out2 = refineOptions({ options, schema: schema2 })

    expect(out2.unusedSchema).toMatchInlineSnapshot(`
      {
        "extra": "string",
      }
    `)

    expect(Object.keys(out2.unusedSchema || {}).length).toBe(1)
    expect(out2.unusedSchema?.extra).toBeTruthy()
    expect(out2.hiddenOptions).toMatchInlineSnapshot(`[]`)
  })
  it('creates keys from a nested list of options', () => {
    const keys = collectKeysFromOptions(options)

    expect(keys).toMatchInlineSnapshot(`
      [
        "text",
        "sub",
        "sub.0.subText",
        "sub.0.author.name",
        "sub.0.author.title",
        "groupInput",
        "media",
        "media.url",
        "media.format",
        "media.html",
      ]
    `)
  })
  it('creates a dot record from schema', () => {
    const schema = z.object({
      heading: z.string().optional().describe('Primary headline for profile 3 to 8 words'),
      subHeading: z.string().optional().describe('Formatted markdown of profile with paragraphs, 30 to 60 words, 2 paragraphs'),
      superHeading: z.string().optional().describe('Shorter badge above headline, 2 to 5 words'),
      details: z.array(z.object({
        name: z.string().optional(),
        desc: z.string().optional(),
        icon: z.string().optional(),
        href: z.string().optional(),
        subObject: z.object({
          subName: z.string().optional(),
          subDesc: z.string().optional(),
        }).optional(),
      })).optional().describe('List of details with contact details, location, etc.'),
      media: z.object({
        url: z.string().optional(),
        format: z.string().optional(),
        html: z.string().optional(),
      }).optional(),
    })

    const simple = zodToSimpleSchema(schema)

    expect(simple).toMatchInlineSnapshot(`
      {
        "_details": "array, List of details with contact details, location, etc.",
        "_media": "object",
        "details": [
          {
            "_subObject": "object",
            "desc": "string",
            "href": "string",
            "icon": "string",
            "name": "string",
            "subObject": {
              "subDesc": "string",
              "subName": "string",
            },
          },
        ],
        "heading": "string, Primary headline for profile 3 to 8 words",
        "media": {
          "format": "string",
          "html": "string",
          "url": "string",
        },
        "subHeading": "string, Formatted markdown of profile with paragraphs, 30 to 60 words, 2 paragraphs",
        "superHeading": "string, Shorter badge above headline, 2 to 5 words",
      }
    `)

    const r = zodSchemaToDotPathRecord(schema)

    expect(r).toMatchInlineSnapshot(`
      {
        "details": "array, List of details with contact details, location, etc.",
        "details.0.desc": "string",
        "details.0.href": "string",
        "details.0.icon": "string",
        "details.0.name": "string",
        "details.0.subObject": "object",
        "details.0.subObject.subDesc": "string",
        "details.0.subObject.subName": "string",
        "heading": "string, Primary headline for profile 3 to 8 words",
        "media": "object",
        "media.format": "string",
        "media.html": "string",
        "media.url": "string",
        "subHeading": "string, Formatted markdown of profile with paragraphs, 30 to 60 words, 2 paragraphs",
        "superHeading": "string, Shorter badge above headline, 2 to 5 words",
      }
    `)
  })
})
