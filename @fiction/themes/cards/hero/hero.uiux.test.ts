import { afterAll, describe, expect, it } from 'vitest'
import { createSiteUiTestingKit } from '@fiction/site/test/siteTestUtils'
import { collectKeysFromOptions } from '../utils/refiner.js'
import { templates } from './index.js'

const headless = true

describe('hero: card', async () => {
  const kit = await createSiteUiTestingKit({ headless })

  afterAll(() => kit?.close())

  it('hero: displays correctly', async () => {
    await kit.performActions({
      path: '/card-hero',
      actions: [
        { type: 'count', selector: '[data-card-type="hero"]' },
      ],
    })
  })
})

describe('validate option keys', async () => {
  it('hero: validate option keys', async () => {
    const template = templates[0]
    const optionKeys = template.settings.options || []
    const keys = collectKeysFromOptions(optionKeys)

    expect(keys).toMatchInlineSnapshot(`
      [
        "headers",
        "headers.heading",
        "headers.subHeading",
        "headers.superHeading",
        "layout",
        "splash",
        "actions",
        "actions.name",
        "actions.href",
        "actions.btn",
        "actions.size",
        "ai",
        "ai.purpose",
      ]
    `)
  })
})
