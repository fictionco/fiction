import { toKebab } from '@fiction/core/index.js'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { collectKeysFromOptions } from '@fiction/site/utils/schema.js'
import { afterAll, describe, expect, it } from 'vitest'
import { template, templateId } from './index.js'

const headless = true

describe('hero: card', async () => {
  const kit = await createSiteUiTestingKit({ headless })

  afterAll(async () => kit?.close())

  it('hero: displays correctly', async () => {
    await kit.performActions({
      caller: 'hero',
      path: `/demo-${toKebab(templateId)}`,
      actions: [
        { type: 'count', selector: '[data-card-type="cardHeroV1"]' },
      ],
    })
  })
})

describe('validate option keys', async () => {
  const config = await template.getConfig({})
  it('hero: validate option keys', async () => {
    const optionKeys = config.options || []
    const keys = collectKeysFromOptions(optionKeys)

    expect(keys).toMatchInlineSnapshot(`
      [
        "title",
        "subTitle",
        "superTitle",
        "superTitle.icon.*",
        "superTitle.text",
        "superTitle.theme",
        "layout",
        "media",
        "media.*",
        "caption",
        "overlays",
        "overlays.0.media",
        "overlays.0.media.*",
        "overlays.0.position",
        "overlays.0.widthPercent",
        "action",
        "action.buttons.*",
        "action.subscribe.*",
        "action.proof.*",
        "action.design",
        "action.size",
        "action.theme",
        "action.title",
        "action.variant",
      ]
    `)
  })
})
