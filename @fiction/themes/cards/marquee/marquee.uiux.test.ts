import { afterAll, describe, expect, it } from 'vitest'
import { createSiteUiTestingKit } from '@fiction/site/test/siteTestUtils'
import { collectKeysFromOptions } from '../utils/refiner.js'
import { templates } from './index.js'

const headless = false

describe('marquee card', async () => {
  const kit = await createSiteUiTestingKit({ headless })

  afterAll(() => kit?.close())

  it('marquee: displays correctly', async () => {
    await kit.performActions({
      path: '/card-marquee',
      actions: [
        { type: 'exists', selector: 'a[href$="/testing"]' },
        { type: 'exists', selector: '.marquee-track.reverse' },
      ],
    })
  }, 15_000)
})

describe('validate option keys', async () => {
  it('marquee: validate option keys', async () => {
    const template = templates[0]
    const optionKeys = template.settings.options || []
    const keys = collectKeysFromOptions(optionKeys)

    expect(keys).toMatchInlineSnapshot(`
      [
        "items",
        "items.media",
        "items.name",
        "items.desc",
        "items.href",
        "direction",
        "stagger",
      ]
    `)

    const expectedKeys = [
      "items",
      "items.media",
      "items.name",
      "items.desc",
      "items.href",
      "direction",
      "stagger"
    ];

    expect(new Set(keys)).toEqual(new Set(expectedKeys));
  })
})
