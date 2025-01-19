import { toKebab } from '@fiction/core'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { afterAll, describe, expect, it } from 'vitest'
import { templateId } from './index.js'

describe('hero: card', async () => {
  const kit = await createSiteUiTestingKit({ headless: false, slowMo: 3000 })

  afterAll(async () => kit?.close())

  it('capture: ui testing', { retry: 3 }, async () => {
    await kit.performActions({
      caller: 'capture1',
      path: `/demo-${toKebab(templateId)}`,
      actions: [
        { type: 'exists', selector: '[data-mode="onLoad"] form' },
        { type: 'fill', selector: '[data-mode="onLoad"] form [data-test-id="email"]', text: 'arpowers+test@gmail.com' },
        { type: 'click', selector: '[data-mode="onLoad"] form [data-test-id="submit"]' },
        { type: 'value', selector: '[data-wrap-mode="onLoad"]', onValue: value => expect(value?.subscribed).toBeTruthy() },
      ],
    })

    await kit.browser.reset()

    await kit.performActions({
      caller: 'capture2',
      path: `/demo-${toKebab(templateId)}`,
      actions: [
        { type: 'exists', selector: '[data-mode="onLoad"] form' },
        { type: 'click', selector: '[data-mode="onLoad"] [data-test-id="dismiss"]' },
        { type: 'scrollTo', selector: 'blockquote' },
        { type: 'exists', selector: '[data-mode="onScroll"] form' },
        { type: 'fill', selector: '[data-mode="onScroll"] form [data-test-id="email"]', text: 'arpowers+test@gmail.com' },
        { type: 'click', selector: '[data-mode="onScroll"] form [data-test-id="submit"]' },
        { type: 'value', selector: '[data-wrap-mode="onScroll"]', onValue: value => expect(value?.subscribed).toBeTruthy() },
      ],
    })
  })
})
