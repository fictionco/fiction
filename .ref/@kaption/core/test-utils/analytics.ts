import type { KaptionTestUtils } from '@kaption/core/test-utils'
import type { express } from '@factor/api'
import { waitFor } from '@factor/api'
import type { KaptionEvent, KaptionEventUserDefined } from '@kaption/client'
import { faker } from '@faker-js/faker'

export async function createKaptionEvents(testUtils: KaptionTestUtils): Promise<KaptionEvent[]> {
  const events = [] as KaptionEvent[]
  const anonymousId = testUtils.anonymousId
  const generatedEvents: KaptionEventUserDefined[] = [
    { type: 'track', event: 'view', anonymousId },
    { type: 'track', event: 'view', anonymousId },
    {
      type: 'identify',
      event: 'identify',
      anonymousId,
      userId: 'user1',
      traits: { email: 'em@ail.com' },
    },
    {
      event: 'custom',
      anonymousId,
      properties: { label: 'test' },
    },
  ]

  const throttled = await Promise.all(
    generatedEvents.map(async (_) => {
      await waitFor(500)
      return testUtils.initialized?.kaptionClient.createKaptionEvent(_)
    }),
  )

  events.push(...(throttled.filter(Boolean) as KaptionEvent[]))

  const remoteAddress = faker.internet.ip()

  const mockRequest = {
    query: { events: JSON.stringify(events) },
    headers: {
      'user-agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36`,
    },
    socket: { remoteAddress },
  } as unknown as express.Request

  const serverEvents = await testUtils.kaptionBeacon.parseRequestEvents(
    mockRequest,
  )

  return serverEvents
}

export async function saveKaptionEvents(testUtils: KaptionTestUtils): Promise<KaptionEvent[]> {
  const events = await createKaptionEvents(testUtils)

  const mgr = testUtils.kaptionBeacon.sessionManager

  const saveEvents = await mgr?.processRawEvents(events)

  mgr?.saveBuffer.batch(saveEvents || [])

  mgr?.saveBuffer.flushBuffer({ reason: 'test' })

  await waitFor(1000)

  return events
}
