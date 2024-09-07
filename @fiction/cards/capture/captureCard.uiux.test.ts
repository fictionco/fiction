import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { afterAll, describe, expect, it } from 'vitest'

describe('hero: card', async () => {
  const kit = await createSiteUiTestingKit({ headless: false, slowMo: 0 })

  afterAll(async () => kit?.close())

  it('capture: ui testing', { retry: 3 }, async () => {
    await kit.performActions({
      path: '/demo-capture',
      actions: [
        { type: 'exists', selector: '[data-mode="onLoad"] form' },
        { type: 'fill', selector: '[data-mode="onLoad"] form [data-test-id="email"]', text: 'arpowers+test@gmail.com' },
        { type: 'click', selector: '[data-mode="onLoad"] form [data-test-id="submit"]' },
        { type: 'value', selector: '[data-wrap-mode="onLoad"]', callback: value => expect(value?.subscribed).toBeTruthy() },
      ],
    })

    await kit.browser.reset()

    await kit.performActions({
      path: '/demo-capture',
      actions: [
        { type: 'exists', selector: '[data-mode="onLoad"] form' },
        { type: 'click', selector: '[data-mode="onLoad"] [data-test-id="dismiss"]' },
        { type: 'scrollTo', selector: 'blockquote' },
        { type: 'exists', selector: '[data-mode="onScroll"] form' },
        { type: 'fill', selector: '[data-mode="onScroll"] form [data-test-id="email"]', text: 'arpowers+test@gmail.com' },
        { type: 'click', selector: '[data-mode="onScroll"] form [data-test-id="submit"]' },
        { type: 'value', selector: '[data-wrap-mode="onScroll"]', callback: value => expect(value?.subscribed).toBeTruthy() },
      ],
    })
  })
})
