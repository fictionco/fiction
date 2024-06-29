import { afterAll, describe, expect, it } from 'vitest'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { collectKeysFromOptions } from '@fiction/site/utils/schema'
import { templates } from './index.js'

const headless = true

describe('showcase card', async () => {
  const kit = await createSiteUiTestingKit({ headless })

  afterAll(async () => kit?.close())

  it('showcase: displays correctly', async () => {
    await kit.performActions({
      path: '/demo-showcase',
      actions: [
        { type: 'exists', selector: '[data-test-id="showcase"]' },
      ],
    })
  })
})

describe('validate option keys', async () => {
  it('showcase: validate option keys', async () => {
    const template = templates[0]
    const optionKeys = template.settings.options || []
    const keys = collectKeysFromOptions(optionKeys)

    expect(keys).toMatchInlineSnapshot(`
      [
        "items",
        "items.0.media",
        "items.0.media.url",
        "items.0.media.format",
        "items.0.media.html",
        "items.0.href",
        "items.0.title",
        "items.0.subTitle",
        "items.0.superTitle",
        "items.0.content",
        "aspect",
        "gridColsMax",
        "gridColsMin",
      ]
    `)

    const expectedKeys = [
      'items',
      'items.0.media',
      'items.0.media.url',
      'items.0.media.format',
      'items.0.media.html',
      'items.0.href',
      'items.0.title',
      'items.0.subTitle',
      'items.0.superTitle',
      'items.0.content',
      'aspect',
      'gridColsMax',
      'gridColsMin',
    ]

    expect(new Set(keys)).toEqual(new Set(expectedKeys))
  })
})
