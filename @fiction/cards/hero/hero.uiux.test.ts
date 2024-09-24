import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { collectKeysFromOptions } from '@fiction/site/utils/schema.js'
import { afterAll, describe, expect, it } from 'vitest'
import { templates } from './index.js'

const headless = true

describe('hero: card', async () => {
  const kit = await createSiteUiTestingKit({ headless })

  afterAll(async () => kit?.close())

  it('hero: displays correctly', async () => {
    await kit.performActions({
      caller: 'hero',
      path: '/demo-hero',
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
        "heading",
        "subHeading",
        "superHeading",
        "superColor",
        "superIcon",
        "superIcon.url",
        "superIcon.format",
        "superIcon.html",
        "superIcon.iconId",
        "superIcon.el",
        "superIcon.class",
        "layout",
        "actions",
        "actions.0.design",
        "actions.0.href",
        "actions.0.icon",
        "actions.0.iconAfter",
        "actions.0.name",
        "actions.0.size",
        "actions.0.target",
        "actions.0.theme",
        "splash",
        "splash.url",
        "splash.format",
        "splash.html",
        "splash.el",
        "splash.modify.*",
        "caption",
        "overlays",
        "overlays.0.media",
        "overlays.0.media.url",
        "overlays.0.media.format",
        "overlays.0.media.html",
        "overlays.0.media.el",
        "overlays.0.media.modify.*",
        "overlays.0.opacity",
        "overlays.0.position",
        "overlays.0.widthPercent",
      ]
    `)
  })
})
