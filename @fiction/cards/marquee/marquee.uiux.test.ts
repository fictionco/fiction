import { afterAll, describe, expect, it } from 'vitest'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { collectKeysFromOptions } from '@fiction/site/utils/schema'
import { templates } from './index.js'

const headless = true

describe('marquee card', async () => {
  const kit = await createSiteUiTestingKit({ headless })

  afterAll(async () => kit?.close())

  it('marquee: displays correctly', async () => {
    await kit.performActions({
      path: '/card-marquee',
      actions: [
        { type: 'exists', selector: 'a[href$="/testing"]' },
        { type: 'exists', selector: '.marquee-track.reverse' },
      ],
    })
  })
})

describe('validate option keys', async () => {
  it('marquee: validate option keys', async () => {
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
        "items.0.name",
        "items.0.desc",
        "items.0.href",
        "direction",
        "stagger",
      ]
    `)

    const expectedKeys = [
      'items',
      'items.0.media',
      'items.0.media.url',
      'items.0.media.format',
      'items.0.media.html',
      'items.0.name',
      'items.0.desc',
      'items.0.href',
      'direction',
      'stagger',
    ]

    expect(new Set(keys)).toEqual(new Set(expectedKeys))
  })
})
