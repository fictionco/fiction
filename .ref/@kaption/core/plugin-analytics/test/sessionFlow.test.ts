/**
 * @vitest-environment jsdom
 * https://vitest.dev/config/#environment
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type {
  KaptionTestUtils,
} from '@kaption/core/test-utils'
import {
  createKaptionTestUtils,
} from '@kaption/core/test-utils'
import type { express } from '@factor/api'
import { getNetworkIp, safeDirname, waitFor } from '@factor/api'
import type {
  KaptionEvent,
  KaptionEventUserDefined,
} from '@kaption/client'
import {
  KaptionClient,
} from '@kaption/client'

let testUtils: KaptionTestUtils
const events = [] as KaptionEvent[]
let client: KaptionClient

describe('session flow', () => {
  beforeAll(async () => {
    testUtils = await createKaptionTestUtils({
      initialize: true,
      cwd: safeDirname(import.meta.url),
      testId: 'sessionFlow',
    })
    const projectId = testUtils.factorAdmin.activeProjectId.value
    if (!projectId)
      throw new Error('no projectId')
    client = new KaptionClient({ projectId })
  })
  afterAll(async () => {
    testUtils.close()
  })

  it('creates and updates sessions in memory', async () => {
    const generatedEvents: KaptionEventUserDefined[] = [
      { type: 'track', event: 'view' },
      { type: 'track', event: 'view' },
      { type: 'track', event: 'view' },
    ]

    const throttled = await Promise.all(
      generatedEvents.map(async (_) => {
        await waitFor(500)
        return client.createKaptionEvent(_)
      }),
    )

    events.push(...throttled)

    const remoteAddress = await getNetworkIp()

    const mockRequest = {
      query: { events: JSON.stringify(events) },
      headers: {
        'user-agent': navigator.userAgent,
      },
      socket: { remoteAddress },
    } as unknown as express.Request

    const serverEvents = await testUtils.kaptionBeacon.parseRequestEvents(
      mockRequest,
    )

    testUtils.kaptionBeacon.trackingBuffer.batch(serverEvents)

    expect(serverEvents.length).toBe(3)

    expect(serverEvents.map(_ => _.event)).toStrictEqual([
      'view',
      'view',
      'view',
    ])
  })
})
