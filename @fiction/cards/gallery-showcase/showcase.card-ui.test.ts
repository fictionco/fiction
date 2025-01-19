import { toKebab } from '@fiction/core/index.js'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { collectKeysFromOptions } from '@fiction/site/utils/schema'
import { afterAll, describe, expect, it } from 'vitest'
import { template, templateId } from './index.js'

const headless = true

describe('showcase card', async () => {
  const kit = await createSiteUiTestingKit({ headless })

  afterAll(async () => kit?.close())

  it('showcase: displays correctly', async () => {
    await kit.performActions({
      caller: 'showcase',
      path: `/demo-${toKebab(templateId)}`,
      actions: [
        { type: 'exists', selector: '[data-test-id="showcase"]' },
      ],
    })
  })
})

describe('validate option keys', async () => {
  const templateConfig = await template.getConfig({})
  it('showcase: validate option keys', async () => {
    const optionKeys = templateConfig?.options || []
    const keys = collectKeysFromOptions(optionKeys)

    expect(keys).toMatchInlineSnapshot(`
      [
        "posts",
        "posts.entries.*",
        "posts.media.*",
        "posts.query.*",
        "posts.limit",
        "posts.offset",
        "posts.format",
        "posts.viewSlug",
        "aspect",
        "gridColsMax",
        "gridColsMin",
      ]
    `)

    const expectedKeys = [
      'posts',
      'posts.entries.*',
      'posts.media.*',
      'posts.query.*',
      'posts.limit',
      'posts.offset',
      'posts.format',
      'posts.viewSlug',
      'aspect',
      'gridColsMax',
      'gridColsMin',
    ]

    expect(new Set(keys)).toEqual(new Set(expectedKeys))
  })
})
