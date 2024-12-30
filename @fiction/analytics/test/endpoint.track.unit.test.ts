import { dayjs, shortId } from '@fiction/core'
import { describe, expect, it } from 'vitest'
import { createAnalyticsTestUtils } from './helpers.js'

describe('queryEventTrack', async () => {
  const testUtils = await createAnalyticsTestUtils()
  const initialized = await testUtils.start()
  const { fictionClickhouse } = testUtils.fictionAnalytics
  const orgId = initialized.org.orgId

  if (!orgId || !fictionClickhouse)
    throw new Error('Test setup failed')

  describe('event tracking', () => {
    it('handles single event writes', async () => {
      const event = `test_event_${shortId()}`
      const value = 5

      const result = await testUtils.fictionAnalytics.queries.EventTrack.serve({
        eventData: {
          orgId,
          event,
          value,
        },
      }, { caller: 'test', server: true })

      expect(result.status).toBe('success')

      // Verify write
      const query = fictionClickhouse
        .clickhouseBaseQuery({ orgId, table: 'event' })
        .where({ event })
        .orderBy('timestamp', 'desc')

      const { data: [savedEvent] } = await fictionClickhouse.clickHouseSelect(
        query,
        { caller: 'testEventTrack' },
      )

      expect(savedEvent.value).toBe(value)
    })

    it('handles buffered writes correctly', async () => {
      const event = `test_event_${shortId()}`
      const batchSize = 5
      const value = 10
      const now = dayjs()

      // Create batch of events
      const promises = Array.from({ length: batchSize }).fill(0).map((_, i) =>
        testUtils.fictionAnalytics.queries.EventTrack.serve({
          eventData: {
            orgId,
            event,
            value,
            timestamp: now.add(i, 'minutes').unix(),
          },
          useBuffer: true,
        }, { caller: 'test', server: true }),
      )

      const results = await Promise.all(promises)
      results.forEach(result => expect(result.status).toBe('success'))

      // Force flush buffer
      await testUtils.fictionAnalytics.queries.EventTrack.flush()

      // Verify writes
      const query = fictionClickhouse
        .clickhouseBaseQuery({ orgId, table: 'event' })
        .where({ event })
        .orderBy('timestamp', 'desc')

      const { data: savedEvents } = await fictionClickhouse.clickHouseSelect(
        query,
        { caller: 'testEventTrack' },
      )

      expect(savedEvents).toHaveLength(batchSize)
      savedEvents.forEach((savedEvent) => {
        expect(savedEvent.value).toBe(value)
        expect(savedEvent.eventId).toBeDefined()
      })
    })

    it('maintains event order in buffered writes', async () => {
      const event = `test_event_${shortId()}`
      const now = dayjs()

      // Create events with different timestamps
      await Promise.all([
        testUtils.fictionAnalytics.queries.EventTrack.serve({
          eventData: {
            orgId,
            event,
            value: 1,
            timestamp: now.unix(),
          },
          useBuffer: true,

        }, { caller: 'test', server: true }),
        testUtils.fictionAnalytics.queries.EventTrack.serve({
          eventData: {
            orgId,
            event,
            value: 2,
            timestamp: now.add(1, 'minute').unix(),
          },
          useBuffer: true,
        }, { caller: 'test', server: true }),
      ])

      await testUtils.fictionAnalytics.queries.EventTrack.flush()

      const query = fictionClickhouse
        .clickhouseBaseQuery({ orgId, table: 'event' })
        .where({ event })
        .orderBy('timestamp', 'asc')

      const { data: savedEvents } = await fictionClickhouse.clickHouseSelect(
        query,
        { caller: 'testEventTrack' },
      )

      expect(savedEvents).toHaveLength(2)
      expect(savedEvents[0].value).toBe(1)
      expect(savedEvents[1].value).toBe(2)
    })
  })
})
