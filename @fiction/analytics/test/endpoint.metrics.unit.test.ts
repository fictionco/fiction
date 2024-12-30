import type { FictionAnalytics } from '../index.js'
import { dayjs, shortId } from '@fiction/core'
import { describe, expect, it } from 'vitest'
import { createAnalyticsTestUtils } from './helpers.js'

async function createTestSession(args: {
  pageViews?: number
  hasGoal?: boolean
  timestamp?: number
  fictionAnalytics: FictionAnalytics
  orgId: string
}) {
  const { pageViews = 2, hasGoal = false, timestamp = dayjs().unix(), fictionAnalytics, orgId } = args
  const sessionId = `test_${shortId()}`
  const anonymousId = `anon_${shortId()}`

  // Init event
  await fictionAnalytics.queries.EventTrack.serve({
    orgId,
    event: 'init',
    sessionId,
    anonymousId,
    timestamp,
    deviceType: 'desktop',
    browser: 'Chrome',
    countryCode: 'US',
    isReturning: 1,
  }, { caller: 'test', server: true })

  // Page views
  for (let i = 0; i < pageViews; i++) {
    await fictionAnalytics.queries.EventTrack.serve({
      orgId,
      event: 'view',
      sessionId,
      anonymousId,
      timestamp: timestamp + (i * 60),
      engageDuration: 60,
      scrollDepth: 80,
    }, { caller: 'test', server: true })
  }

  if (hasGoal) {
    await fictionAnalytics.queries.EventTrack.serve({
      orgId,
      event: 'signup',
      sessionId,
      anonymousId,
      timestamp: timestamp + ((pageViews + 1) * 60),
      conversion: 'goal',
    }, { caller: 'test', server: true })
  }

  // End session
  await fictionAnalytics.queries.EventTrack.serve({
    orgId,
    event: 'session',
    sessionId,
    anonymousId,
    timestamp: timestamp + ((pageViews + 2) * 60),
    duration: (pageViews + 2) * 60,
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

  describe('snapshot metrics', () => {
    it('combines multiple snapshot metrics correctly', async () => {
      // Create test metrics
      const socialMetric1 = `test_twitter_${shortId()}`
      const socialMetric2 = `test_linkedin_${shortId()}`
      const now = dayjs()

      // Track some snapshot data
      await Promise.all([
        // Twitter followers
        fictionAnalytics.queries.EventTrack.serve({
          orgId,
          event: socialMetric1,
          value: 100,
          timestamp: now.subtract(2, 'hour').unix(),
        }, { caller: 'test', server: true }),
        fictionAnalytics.queries.EventTrack.serve({
          orgId,
          event: socialMetric1,
          value: 150,
          timestamp: now.subtract(1, 'hour').unix(),
        }, { caller: 'test', server: true }),

        // LinkedIn followers
        fictionAnalytics.queries.EventTrack.serve({
          orgId,
          event: socialMetric2,
          value: 200,
          timestamp: now.subtract(2, 'hour').unix(),
        }, { caller: 'test', server: true }),
        fictionAnalytics.queries.EventTrack.serve({
          orgId,
          event: socialMetric2,
          value: 250,
          timestamp: now.subtract(1, 'hour').unix(),
        }, { caller: 'test', server: true }),
      ])

      const result = await fictionAnalytics.queries.CompiledMetrics.serve({
        orgId,
        period: 'hour4',
        interval: 'hour',
        metrics: [
          {
            key: 'total_social',
            type: 'snapshot',
            events: [socialMetric1, socialMetric2],
          },
        ],
      }, { caller: 'test', server: true })

      expect(result.status).toBe('success')
      expect(result.data?.length).toBe(1)

      const mainData = result.data?.[0].data.main || []
      const lastPoint = mainData[mainData.length - 1]

      // Should sum latest values: 150 + 250 = 400
      expect(lastPoint?.value).toBe(400)
    })

    it('handles multiple metrics with different event combinations', async () => {
      const metric1 = `test_metric1_${shortId()}`
      const metric2 = `test_metric2_${shortId()}`
      const metric3 = `test_metric3_${shortId()}`
      const now = dayjs()

      // Create test data
      await Promise.all([
        fictionAnalytics.queries.EventTrack.serve({
          orgId,
          event: metric1,
          value: 100,
          timestamp: now.unix(),
        }, { caller: 'test', server: true }),
        fictionAnalytics.queries.EventTrack.serve({
          orgId,
          event: metric2,
          value: 200,
          timestamp: now.unix(),
        }, { caller: 'test', server: true }),
        fictionAnalytics.queries.EventTrack.serve({
          orgId,
          event: metric3,
          value: 300,
          timestamp: now.unix(),
        }, { caller: 'test', server: true }),
      ])

      const result = await fictionAnalytics.queries.CompiledMetrics.serve({
        orgId,
        period: 'hour',
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
      const metricName = `test_compare_${shortId()}`
      const now = dayjs()
      const lastWeek = now.subtract(8, 'day')

      // This week's data
      await fictionAnalytics.queries.EventTrack.serve({
        orgId,
        event: metricName,
        value: 100,
        timestamp: now.unix(),
      }, { caller: 'test', server: true })

      // Last week's data
      await fictionAnalytics.queries.EventTrack.serve({
        orgId,
        event: metricName,
        value: 50,
        timestamp: lastWeek.unix(),
      }, { caller: 'test', server: true })

      const result = await fictionAnalytics.queries.CompiledMetrics.serve({
        orgId,
        period: 'week',
        compare: 'week',
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
        metrics: [
          {
            key: 'test',
            type: 'snapshot',
            events: ['test'],
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
      }, { caller: 'test', server: true })

      expect(result.status).toBe('error')
      expect(result.message).toBe('No metrics specified')
    })
  })
})
