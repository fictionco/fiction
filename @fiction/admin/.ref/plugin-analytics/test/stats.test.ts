import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { waitFor } from '@factor/api'

import type { KaptionTestUtils } from '../../test-utils'
import { createKaptionTestUtils } from '../../test-utils'

let testUtils: KaptionTestUtils
let projectId: string | undefined
describe('analytics stats', () => {
  beforeAll(async () => {
    testUtils = await createKaptionTestUtils({
      tagSettings: { onlyTags: ['analytics'], throttleMs: 20 },
      initialize: true,
      headless: true,
      uiSpeed: 500,
    })

    projectId = testUtils.initialized?.project.projectId

    if (!projectId)
      throw new Error('no project id')
    const projectIds = [projectId]

    const promises = [
      testUtils.kaptionTag.tagStaticServer({
        tagSettings: { onlyTags: ['analytics'], throttleMs: 20 },
        projectIds,
      }),
      testUtils.kaptionTag.launchExampleApp(projectIds),
      testUtils.kaptionBeacon.createBeaconServer(),
    ]

    await Promise.all(promises)
  })

  afterAll((): void => {
    testUtils.close()
  })

  it('loads correctly', async () => {
    const spyBeaconEvents = vi.spyOn(
      testUtils.kaptionBeacon,
      'saveNewRawEvents',
    )
    const { context, url }
      = await testUtils.kaptionTag.factorTestingApp.newContext()
    const page = await context.newPage()
    await page?.goto(url.value)

    await page.click('#link-tour')

    await page.click('#link-pricing')

    await page.click('#link-home')

    await waitFor(5000)

    const c = spyBeaconEvents.mock?.calls
    const eventProps = c
      ?.map(_ => _[0])
      .flatMap(g =>
        g.map((e) => {
          return {
            event: e.event,
            properties: e.properties,
            type: e.type,
            reason: e.type,
          }
        }),
      )

    expect(eventProps.map(e => e.event)).toEqual(
      expect.arrayContaining(['stat', 'view', 'click']),
    )

    expect(eventProps.length).toBeGreaterThan(5)

    await waitFor(1000)
    expect(1).toBe(1)
  }, 25_000)
})
