import { toKebab } from '@fiction/core/index.js'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
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
