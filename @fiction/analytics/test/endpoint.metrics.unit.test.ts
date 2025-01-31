import type { FictionAnalytics } from '../index.js'
import { dayjs, shortId } from '@fiction/core'
import { afterAll, describe, expect, it } from 'vitest'
import { createAnalyticsTestUtils } from './helpers.js'

type TestMetric = `test_${string}`

const TEST_DATES = {
  baseDate: dayjs('2024-01-01T12:00:00Z'), // Noon UTC on Jan 1, 2024
  baseTimestamp: dayjs('2024-01-01T12:00:00Z').unix(),
  hourAgo: dayjs('2024-01-01T11:00:00Z').unix(),
  twoHoursAgo: dayjs('2024-01-01T10:00:00Z').unix(),
  threeHoursAgo: dayjs('2024-01-01T09:00:00Z').unix(),
  weekAgo: dayjs('2023-12-25T12:00:00Z').unix(),
} as const

async function createTestSession(args: {
  pageViews?: number
  hasGoal?: boolean
  timestamp?: number
  fictionAnalytics: FictionAnalytics
  orgId: string
  engageDuration?: number
}) {
  const {
    pageViews = 2,
    hasGoal = false,
    timestamp = TEST_DATES.baseDate.subtract(30, 'minute').unix(),
    fictionAnalytics,
    orgId,
    engageDuration = 60,
  } = args

  const sessionId = `test_${shortId()}`
  const anonymousId = `anon_${shortId()}`

  // Init event
  await fictionAnalytics.queries.EventTrack.serve({
    eventData: {
      orgId,
      event: 'init',
      sessionId,
      anonymousId,
      timestamp,
      deviceType: 'desktop',
      browser: 'Chrome',
      countryCode: 'US',
      isReturning: 1,
    },
  }, { caller: 'test', server: true })

  for (let i = 0; i < pageViews; i++) {
    await fictionAnalytics.queries.EventTrack.serve({
      eventData: {
        orgId,
        event: 'view',
        sessionId,
        anonymousId,
        timestamp: timestamp + i,
        engageDuration,
        scrollDepth: 80,
      },
    }, { caller: 'test', server: true })
  }

  if (hasGoal) {
    await fictionAnalytics.queries.EventTrack.serve({
      eventData: {
        orgId,
        event: 'signup',
        sessionId,
        anonymousId,
        timestamp: timestamp + pageViews + 1,
        conversion: 'goal',
      },
    }, { caller: 'test', server: true })
  }

  // End session
  await fictionAnalytics.queries.EventTrack.serve({
    eventData: {
      orgId,
      event: 'session',
      sessionId,
      anonymousId,
      timestamp: timestamp + pageViews + 2,
      duration: (pageViews + 2) * 60,
    },
  }, { caller: 'test', server: true })

  return { sessionId, anonymousId }
}

describe('queryCompiledMetrics', async () => {
  const testUtils = await createAnalyticsTestUtils()
  const initialized = await testUtils.start()
  const fictionAnalytics = testUtils.fictionAnalytics
  const { fictionClickhouse } = fictionAnalytics
  const orgId = initialized.org.orgId as string

  if (!orgId || !fictionClickhouse)
    throw new Error('Test setup failed')

  afterAll(async () => {
    await testUtils.close()
  })

  describe('snapshot metrics', () => {
    it('combines multiple snapshot metrics correctly with filled timeline', async () => {
      // Create test metrics
      const socialMetric1: TestMetric = `test_twitter_${shortId()}`
      const socialMetric2: TestMetric = `test_linkedin_${shortId()}`
      const now = dayjs()

      // Track some snapshot data with gaps
      await Promise.all([
        // Twitter followers - Early value
        fictionAnalytics.queries.EventTrack.serve({
          eventData: {
            orgId,
            event: socialMetric1,
            value: 100,
            timestamp: now.subtract(3, 'hour').unix(),
          },
        }, { caller: 'test', server: true }),
        fictionAnalytics.queries.EventTrack.serve({
          eventData: {
            orgId,
            event: socialMetric2,
            value: 60,
            timestamp: now.subtract(3, 'hour').unix(),
          },
        }, { caller: 'test', server: true }),

        // Twitter followers - Latest value
        fictionAnalytics.queries.EventTrack.serve({
          eventData: {
            orgId,
            event: socialMetric1,
            value: 150,
            timestamp: now.subtract(1, 'hour').unix(),
          },
        }, { caller: 'test', server: true }),

        // LinkedIn followers - Single value, should carry forward
        fictionAnalytics.queries.EventTrack.serve({
          eventData: {
            orgId,
            event: socialMetric2,
            value: 250,
            timestamp: now.subtract(2, 'hour').unix(),
          },
        }, { caller: 'test', server: true }),
      ])

      const k = 'total_social'

      const result = await fictionAnalytics.queries.CompiledMetrics.serve({
        orgId,
        period: 'hour4',
        interval: 'hour',
        metrics: [
          {
            key: k,
            type: 'snapshot',
            events: [socialMetric1, socialMetric2],
          },
        ],
      }, { caller: 'test', server: true })

      expect(result.status).toBe('success')
      expect(result.data?.length).toBe(1)

      const mainData = result.data?.[0].data.main || []

      // Verify timeline is complete
      expect(mainData.length).toBeGreaterThan(3) // Should have at least 4 hours of data points

      // Verify values carry forward correctly
      const timeline = mainData.map(d => ({
        value: d.value,
      }))

      // Check specific points
      const threeHoursAgo = timeline[1]
      const twoHoursAgo = timeline[2]
      const oneHourAgo = timeline[3]
      const current = timeline[4]

      expect(timeline).toMatchInlineSnapshot(`
        [
          {
            "value": 0,
          },
          {
            "value": 160,
          },
          {
            "value": 350,
          },
          {
            "value": 400,
          },
          {
            "value": 400,
          },
        ]
      `)

      // Initial point should have Twitter's first value (100)
      expect(threeHoursAgo.value).toBe(160)

      // Two hours ago should have Twitter (100) + LinkedIn (250)
      expect(twoHoursAgo.value).toBe(350)

      // One hour ago should have Twitter (150) + LinkedIn (250)
      expect(oneHourAgo.value).toBe(400)

      // Current should maintain the last known values
      expect(current.value).toBe(400)
    })

    it('handles multiple metrics with different event combinations', async () => {
      const metric1: TestMetric = `test_metric1_${shortId()}`
      const metric2: TestMetric = `test_metric2_${shortId()}`
      const metric3: TestMetric = `test_metric3_${shortId()}`
      const now = TEST_DATES.baseDate

      // Create test data
      await Promise.all([
        fictionAnalytics.queries.EventTrack.serve({
          eventData: {
            orgId,
            event: metric1,
            value: 100,
            timestamp: now.unix(),
          },
        }, { caller: 'test', server: true }),

        fictionAnalytics.queries.EventTrack.serve({
          eventData: {
            orgId,
            event: metric2,
            value: 200,
            timestamp: now.unix(),
          },
        }, { caller: 'test', server: true }),

        fictionAnalytics.queries.EventTrack.serve({
          eventData: {
            orgId,
            event: metric3,
            value: 300,
            timestamp: now.unix(),
          },
        }, { caller: 'test', server: true }),
      ])

      const result = await fictionAnalytics.queries.CompiledMetrics.serve({
        orgId,
        period: 'hour',
        timeEndAtIso: now.toISOString(),
        timeZone: 'UTC',
        metrics: [
          {
            key: 'combo1',
            type: 'snapshot',
            events: [metric1, metric2],
          },
          {
            key: 'combo2',
            type: 'snapshot',
            events: [metric2, metric3],
          },
        ],
      }, { caller: 'test', server: true })

      expect(result.status).toBe('success')
      const mainData = result.data || []
      expect(mainData.length).toBe(2)

      expect(mainData[0].data.main?.pop()?.value).toBe(300) // 100 + 200
      expect(mainData[1].data.main?.pop()?.value).toBe(500) // 200 + 300
    })

    it('handles period comparisons for snapshot metrics', async () => {
      const metricName: TestMetric = `test_compare_${shortId()}`
      const now = TEST_DATES.baseDate
      const lastWeek = now.subtract(8, 'day')

      // This week's data
      await fictionAnalytics.queries.EventTrack.serve({
        eventData: {
          orgId,
          event: metricName,
          value: 100,
          timestamp: now.unix(),
        },
      }, { caller: 'test', server: true })

      // Last week's data
      await fictionAnalytics.queries.EventTrack.serve({
        eventData: {
          orgId,
          event: metricName,
          value: 50,
          timestamp: lastWeek.unix(),
        },
      }, { caller: 'test', server: true })

      const result = await fictionAnalytics.queries.CompiledMetrics.serve({
        orgId,
        period: 'week',
        compare: 'week',
        timeEndAtIso: now.toISOString(),
        timeZone: 'UTC',
        metrics: [
          {
            key: 'test_metric',
            type: 'snapshot',
            events: [metricName],
          },
        ],
      }, { caller: 'test', server: true })

      expect(result.status).toBe('success')
      const metricResult = result.data?.[0].data || {}
      expect(metricResult.main).toBeDefined()
      expect(metricResult.compare).toBeDefined()

      const mainTotal = metricResult.mainTotals?.value
      const compareTotal = metricResult.compareTotals?.value

      expect(mainTotal).toBe(100)
      expect(compareTotal).toBe(50)
    })

    it('returns error for missing orgId', async () => {
      const result = await fictionAnalytics.queries.CompiledMetrics.serve({
        // @ts-expect-error Testing missing orgId
        orgId: undefined,
        timeEndAtIso: TEST_DATES.baseDate.toISOString(),
        timeZone: 'UTC',
        metrics: [
          {
            key: 'test',
            type: 'snapshot',
            events: ['test_missing'],
          },
        ],
      }, { caller: 'test', server: true })

      expect(result.status).toBe('error')
      expect(result.message).toBe('Missing orgId')
    })

    it('returns error for empty metrics', async () => {
      const result = await fictionAnalytics.queries.CompiledMetrics.serve({
        orgId,
        metrics: [],
        timeEndAtIso: TEST_DATES.baseDate.toISOString(),
        timeZone: 'UTC',
      }, { caller: 'test', server: true })

      expect(result.status).toBe('error')
      expect(result.message).toBe('No metrics specified')
    })
  })

  describe('session metrics', () => {
    it('calculates bounce rate correctly', async () => {
      const now = TEST_DATES.baseDate
      const randomOrgId = shortId()
      const halfHourAgo = now.subtract(30, 'minute')

      // Create bounced session
      await createTestSession({
        fictionAnalytics,
        orgId: randomOrgId,
        timestamp: halfHourAgo.unix(),
        pageViews: 1,
      })

      // Create non-bounced session
      await createTestSession({
        fictionAnalytics,
        orgId: randomOrgId,
        timestamp: halfHourAgo.add(1, 'second').unix(),
        pageViews: 2,
      })

      const result = await fictionAnalytics.queries.CompiledMetrics.serve({
        orgId: randomOrgId,
        period: 'hour4',
        interval: 'hour',
        timeZone: 'UTC',
        timeEndAtIso: now.toISOString(),
        metrics: [
          {
            key: 'bounceRate',
            type: 'session',
            selector: 'avg(session__isBounce) * 100',
          },
          {
            key: 'sessionCount',
            type: 'session',
            selector: 'count(*)',
          },
          {
            key: 'pageCount',
            type: 'session',
            selector: 'avg(session__pageCount)',
          },
        ],
      }, { caller: 'test', server: true })

      expect(result.status).toBe('success')

      const bounceData = result.data?.[0].data.main || []
      const pnt = bounceData.find(d => dayjs(d.date).isSame(halfHourAgo, 'hour'))

      expect(pnt).toMatchInlineSnapshot(`
        {
          "bounceRate": 50,
          "date": "2024-01-01T11:00:00.000Z",
          "pageCount": 1.5,
          "sessionCount": "2",
          "tense": "past",
          "value": 50,
        }
      `)

      // Should be 50% bounce rate (1 bounced, 1 non-bounced)
      expect(pnt?.value).toBe(50)
    })

    it('tracks engaged time accurately', async () => {
      const engageDuration = 120 // 2 minutes
      const randomOrgId = shortId()
      const now = TEST_DATES.baseDate
      const halfHourAgo = now.subtract(30, 'minute')
      await createTestSession({ fictionAnalytics, timestamp: halfHourAgo.unix(), orgId: randomOrgId, pageViews: 2, engageDuration })
      await createTestSession({ fictionAnalytics, timestamp: halfHourAgo.unix(), orgId: randomOrgId, pageViews: 2, engageDuration })

      const result = await fictionAnalytics.queries.CompiledMetrics.serve({
        orgId: randomOrgId,
        period: 'hour4',
        interval: 'hour',
        timeEndAtIso: now.toISOString(),
        timeZone: 'UTC',
        metrics: [{
          key: 'engagedTime',
          type: 'session',
          selector: 'sum(session__engageDuration)',
        }],
      }, { caller: 'test', server: true })

      expect(result.status).toBe('success')
      const timeData = result.data?.[0].data.main || []
      const hasValue = timeData.find(d => d.value === 480)

      // Should match total engaged duration (4 pageviews * 120 seconds)
      expect(hasValue).toBeTruthy()
    })

    it('calculates conversion rates correctly', async () => {
      const randomOrgId = shortId()
      const now = TEST_DATES.baseDate
      const halfHourAgo = now.subtract(30, 'minute')
      // Session with conversion
      await createTestSession({
        fictionAnalytics,
        orgId: randomOrgId,
        hasGoal: true,
        timestamp: halfHourAgo.unix(),
      })

      // Session without conversion
      await createTestSession({
        fictionAnalytics,
        orgId: randomOrgId,
        hasGoal: false,
        timestamp: halfHourAgo.unix(),
      })

      const result = await fictionAnalytics.queries.CompiledMetrics.serve({
        orgId: randomOrgId,
        period: 'week',
        interval: 'day',
        timeZone: 'UTC',
        timeEndAtIso: now.toISOString(),
        metrics: [{
          key: 'conversionRate',
          type: 'session',
          selector: 'avg(session__hasGoalConversion) * 100',
        }],
      }, { caller: 'test', server: true })

      expect(result.status).toBe('success')
      const conversionData = result.data?.[0].data.main || []

      const lastPoint = conversionData[conversionData.length - 1]

      // Should be 50% conversion rate (1 converted, 1 non-converted)
      expect(lastPoint?.value).toBe(50)
    })
  })

  describe('event metrics', () => {
    it('counts unique visitors correctly', async () => {
      const now = TEST_DATES.baseDate
      const uniqueVisitors = 3
      const randomOrgId = shortId()

      // Create multiple sessions with same visitor
      for (let i = 0; i < uniqueVisitors; i++) {
        await createTestSession({
          fictionAnalytics,
          orgId: randomOrgId,
          timestamp: now.subtract(5, 'hour').unix() + (i * 100),
        })
      }

      const result = await fictionAnalytics.queries.CompiledMetrics.serve({
        orgId: randomOrgId,
        period: 'week',
        timeZone: 'UTC',
        timeEndAtIso: now.toISOString(),
        metrics: [{
          key: 'uniqueVisitors',
          type: 'event',
          selector: 'uniq(anonymousId)',
        }],
      }, { caller: 'test', server: true })

      expect(result.status).toBe('success')
      const visitorData = result.data?.[0].data.main || []
      const lastPoint = visitorData[visitorData.length - 1]

      console.warn('visitorData', visitorData)

      expect(+(lastPoint?.value || 0)).toBe(uniqueVisitors)
    })

    it('tracks custom events with values', async () => {
      const randomOrgId = shortId()
      const eventName = `test_event_${shortId()}`
      const now = TEST_DATES.baseDate
      const halfHourAgo = now.subtract(30, 'minute')

      // Track custom events with values
      await fictionAnalytics.queries.EventTrack.serve({
        eventData: {
          orgId: randomOrgId,
          event: eventName,
          value: 100,
          timestamp: now.subtract(2, 'day').unix(),
        },
      }, { caller: 'test', server: true })

      await fictionAnalytics.queries.EventTrack.serve({
        eventData: {
          orgId: randomOrgId,
          event: eventName,
          value: 200,
          timestamp: now.subtract(6, 'day').unix() + 3600,
        },
      }, { caller: 'test', server: true })

      const result = await fictionAnalytics.queries.CompiledMetrics.serve({
        orgId: randomOrgId,
        period: 'week',
        timeZone: 'UTC',
        timeEndAtIso: now.toISOString(),
        metrics: [{
          key: 'eventValue',
          type: 'event',
          selector: 'sum(value)',
        }],
      }, { caller: 'test', server: true })

      expect(result.status).toBe('success')

      const eventData = result.data?.[0].data.main || []

      const total = eventData.reduce((sum, point) => sum + (Number(point?.value) || 0), 0)

      expect(total).toBe(300)
    })
  })
})
