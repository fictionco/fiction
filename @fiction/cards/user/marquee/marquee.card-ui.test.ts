import { isCi, toKebab } from '@fiction/core'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { afterAll, describe, it } from 'vitest'
import { templateId } from './index.js'

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
