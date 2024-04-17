import { afterAll, describe, it } from 'vitest'
import { createSiteUiTestingKit } from '@fiction/site/test/siteTestUtils'

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
