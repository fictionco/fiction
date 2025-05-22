import { colorList, colorTheme, SuperTitleSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { describe, expect, it } from 'vitest'
import { z } from 'zod/v4'
import { collectKeysFromOptions, refineOptions, zodSchemaToDotPathRecord, zodToSimpleSchema } from '../__optionSchema'

describe('schema tools', () => {
  const options: InputOption[] = [
    new InputOption({ key: 'text', label: 'test', input: 'InputText' }),
    new InputOption({ key: 'sub', label: 'whatever', input: 'InputList', options: [
      new InputOption({ key: 'subText', label: 'subText', input: 'InputText' }),
      new InputOption({ key: 'author.name', label: 'Author', input: 'InputText' }),
      new InputOption({ key: 'author.title', label: 'Title', input: 'InputText' }),
    ] }),
    new InputOption({ key: 'grp', label: 'Group 1', input: 'group', options: [
      new InputOption({ key: 'groupInput', label: 'subText', input: 'InputTextarea' }),
    ] }),
    new InputOption({ key: 'media', label: 'test', input: 'InputMedia' }),
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
      modify: z.object({
        flip: z.boolean().optional(),
      }),
      el: z.custom((val) => {
        return typeof val === 'function' || val instanceof Promise
      }, { message: 'Must be an async component or Promise' }).optional(),
    }).optional(),
  })

  const schema2 = schema.extend({
    extra: z.string().optional(),
  })

  const ColorSchema = {
    bg: z.object({
      color: z.string().optional(),
    }),
    theme: z.enum(colorTheme).optional(),
  }

  const UserConfigSchema = z.object({
    scheme: z.object({
      flip: z.boolean().optional(),
      light: z.object(ColorSchema).optional(),
      dark: z.object(ColorSchema).optional(),
    }),
  })

  it('rectifies options with schema', async () => {
    const out = await refineOptions({ options, schema })

    expect(out.dotRecord).toMatchInlineSnapshot(`
      {
        "groupInput": "string",
        "media": "object",
        "media.el": "unknown",
        "media.format": "string",
        "media.html": "string",
        "media.modify": "object",
        "media.modify.flip": "boolean",
        "media.url": "string",
        "sub": "array",
        "sub.0.author": "object",
        "sub.0.author.name": "string",
        "sub.0.author.title": "string",
        "sub.0.subText": "string",
        "text": "string",
      }
    `)
    expect(out.unusedSchema).toMatchInlineSnapshot(`{}`)

    expect(Object.keys(out?.unusedSchema || { f: '', f2: '' }).length, 'no unused schema').toBe(0)

    expect(out.hiddenOptions).toMatchInlineSnapshot(`[]`)

    expect(out.hiddenOptions.length, 'no hidden options').toBe(0)

    const out2 = await refineOptions({ options, schema: schema2 })

    expect(out2.unusedSchema).toMatchInlineSnapshot(`
      {
        "extra": "string",
      }
    `)

    expect(Object.keys(out2.unusedSchema || {}).length).toBe(1)
    expect(out2.unusedSchema?.extra).toBeTruthy()
    expect(out2.hiddenOptions).toMatchInlineSnapshot(`[]`)
  })

  it('handles duplicated nested options', async () => {
    const s = await zodToSimpleSchema(UserConfigSchema)

    expect(s).toMatchInlineSnapshot(`
      {
        "$scheme": "object",
        "scheme": {
          "$dark": "object",
          "$light": "object",
          "dark": {
            "$bg": "object",
            "bg": {
              "color": "string",
            },
            "theme": "string",
          },
          "flip": "boolean",
          "light": {
            "$bg": "object",
            "bg": {
              "color": "string",
            },
            "theme": "string",
          },
        },
      }
    `)

    const ops: InputOption[] = [
      new InputOption({ key: 'scheme.flip', label: 'Reverse Color Scheme', input: 'InputCheckbox' }),
      new InputOption({ key: 'scheme.light', label: 'Light Mode', input: 'group', options: [
        new InputOption({ key: 'scheme.light.bg.color', label: 'Light Background Color', input: 'InputColor' }),
        new InputOption({ key: 'scheme.light.theme', label: 'Light Color Theme', input: 'InputSelect', props: { list: colorList } }),
      ] }),
      new InputOption({ key: 'scheme.dark', label: 'Dark Mode', input: 'group', options: [
        new InputOption({ key: 'scheme.dark.bg.color', label: 'Dark Background Color', input: 'InputColor' }),
        new InputOption({ key: 'scheme.dark.theme', label: 'Dark Color Theme', input: 'InputSelect', props: { list: colorList } }),
      ] }),
    ]

    const r = await refineOptions({ options: ops, schema: UserConfigSchema })

    expect(r.unusedSchema).toMatchInlineSnapshot(`{}`)

    expect(Object.keys(r.unusedSchema || { noop: false }).length).toBe(0)
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
        "media.*",
      ]
    `)
  })
  it('creates a dot record from schema', async () => {
    const schema = z.object({
      title: z.string().optional().describe('Primary headline for profile 3 to 8 words'),
      subTitle: z.string().optional().describe('Formatted markdown of profile with paragraphs, 30 to 60 words, 2 paragraphs'),
      superTitle: SuperTitleSchema.optional().describe('Shorter badge above headline, 2 to 5 words'),
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

    const simple = await zodToSimpleSchema(schema)

    expect(simple).toMatchInlineSnapshot(`
      {
        "$details": "array, List of details with contact details, location, etc.",
        "$media": "object",
        "$superTitle": "object, Shorter badge above headline, 2 to 5 words",
        "details": [
          {
            "$subObject": "object",
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
        "media": {
          "format": "string",
          "html": "string",
          "url": "string",
        },
        "subTitle": "string, Formatted markdown of profile with paragraphs, 30 to 60 words, 2 paragraphs",
        "superTitle": {
          "$icon": "object, Visual indicator icon [@ai]",
          "icon": {
            "alt": "string",
            "aspect": "string",
            "class": "string, tabler iconify class i-tabler-[icon-name]",
            "el": "",
            "format": "string",
            "html": "string",
            "iconId": "string, iconId is common icon name (e.g. user, check, lock)",
            "props": "object",
            "url": "string",
          },
          "text": "string, Short text above main title [@ai]",
          "theme": "string, Color style",
        },
        "title": "string, Primary headline for profile 3 to 8 words",
      }
    `)

    const r = zodSchemaToDotPathRecord(schema)

    expect(r).toMatchInlineSnapshot(`Promise {}`)
  })
})
