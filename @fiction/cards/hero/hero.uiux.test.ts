import { afterAll, describe, expect, it } from 'vitest'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { collectKeysFromOptions } from '@fiction/site/utils/schema.js'
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
        "purpose",
        "heading",
        "subHeading",
        "superHeading",
        "layout",
        "splash",
        "splash.url",
        "splash.format",
        "actions",
        "actions.0.name",
        "actions.0.href",
        "actions.0.btn",
        "actions.0.size",
        "actions.0.target",
      ]
    `)
  })
})
