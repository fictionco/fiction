import { describe, expect, it } from 'vitest'
import { standardCardTemplates } from '@fiction/cards'
import { getGenerationInputConfig } from '../generation'
import type { CardTemplate } from '../../card'
import { Card } from '../../card'
import { Site } from '../../site'
import { CardGeneration } from '../../generation'
import { createSiteTestUtils } from '../../test/siteTestUtils'

describe('generation utils', async () => {
  const testUtils = createSiteTestUtils()
  const site = new Site({ fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' })
  const card = new Card({
    site,
    tpl: standardCardTemplates.find(t => t.settings.templateId === 'hero') as CardTemplate,
    title: 'Test Card',
  })

  it('gets default input config', () => {
    const options = card.tpl.value?.settings.options || []

    const inputConfig = getGenerationInputConfig(options)

    expect(inputConfig).toMatchInlineSnapshot(`
      [
        {
          "estimatedMs": 4000,
          "isDisabled": undefined,
          "key": "heading",
          "label": "Heading",
          "prompt": undefined,
        },
        {
          "estimatedMs": 4000,
          "isDisabled": undefined,
          "key": "subHeading",
          "label": "Sub Heading",
          "prompt": undefined,
        },
        {
          "estimatedMs": 4000,
          "isDisabled": undefined,
          "key": "superHeading",
          "label": "Super Heading",
          "prompt": undefined,
        },
        {
          "estimatedMs": 4000,
          "isDisabled": undefined,
          "key": "layout",
          "label": "Layout",
          "prompt": undefined,
        },
        {
          "estimatedMs": 4000,
          "isDisabled": undefined,
          "key": "actions",
          "label": "Actions",
          "prompt": undefined,
        },
      ]
    `)
  })
})
