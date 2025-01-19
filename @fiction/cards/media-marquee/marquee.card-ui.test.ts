import { isCi, toKebab } from '@fiction/core'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { collectKeysFromOptions } from '@fiction/site/utils/schema'
import { afterAll, describe, expect, it } from 'vitest'
import { template, templateId } from './index.js'

const headless = true

describe('marquee card', async () => {
  const kit = await createSiteUiTestingKit({ headless })

  afterAll(async () => kit?.close())

  it('marquee: displays correctly', { retry: isCi() ? 3 : 1 }, async () => {
    await kit.performActions({
      caller: 'marquee',
      path: `/demo-${toKebab(templateId)}`,
      actions: [
        { type: 'exists', selector: '[data-display-items]' },
        { type: 'exists', selector: '.marquee-track.reverse' },
      ],
    })
  })
})

describe('validate option keys', async () => {
  const config = await template.getConfig({})
  it('marquee: validate option keys', async () => {
    const optionKeys = config.options || []
    const keys = collectKeysFromOptions(optionKeys)

    expect(keys).toMatchInlineSnapshot(`
      [
        "items",
        "items.0.title",
        "items.0.subTitle",
        "items.0.media",
        "items.0.media.*",
        "items.0.href",
        "direction",
        "stagger",
        "speed",
        "showAllText",
      ]
    `)

    const expectedKeys = [
      'items',
      'items.0.title',
      'items.0.subTitle',
      'items.0.media',
      'items.0.media.*',
      'items.0.href',
      'direction',
      'stagger',
      'speed',
      'showAllText',
    ]

    expect(new Set(keys)).toEqual(new Set(expectedKeys))
  })
})
