import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { collectKeysFromOptions } from '@fiction/site/utils/schema'
import { afterAll, describe, expect, it } from 'vitest'
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
        "posts",
        "aspect",
        "gridColsMax",
        "gridColsMin",
      ]
    `)

    const expectedKeys = [
      'posts',
      'aspect',
      'gridColsMax',
      'gridColsMin',
    ]

    expect(new Set(keys)).toEqual(new Set(expectedKeys))
  })
})
