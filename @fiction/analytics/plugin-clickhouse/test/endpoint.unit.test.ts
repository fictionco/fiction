import { dayjs, shortId } from '@fiction/core'
import { describe, expect, it } from 'vitest'
import { createAnalyticsTestUtils } from '../../test/helpers.js'

describe('metrics', async () => {
  const testUtils = await createAnalyticsTestUtils()
  const initialized = await testUtils.start()

  const { fictionClickhouse } = testUtils.fictionAnalytics

  if (!fictionClickhouse)
    throw new Error('no clickhouse')

  const orgId = initialized.org.orgId

  if (!orgId)
    throw new Error('no orgId')

  const metric = 'test_metric'

  describe('queryMetricTrack', () => {
    it('tracks incremental metrics correctly', async () => {
      const trackResult = await fictionClickhouse.queries.MetricTrack.serve({
        orgId,
        metric,
        count: 5,
      }, { caller: 'test', server: true })

      expect(trackResult.status).toBe('success')
      // Verify the data was saved
      const query = fictionClickhouse
        .clickhouseBaseQuery({ orgId, table: 'metrics' })
        .where({ metric })
        .orderBy('timestamp', 'desc')

      const { data: [savedMetric] } = await fictionClickhouse.clickHouseSelect(query, { caller: 'testQueryMetricTrack' })

      expect(savedMetric.count).toBe(5)
    })
  })

  describe('queryMetricAnalytics', () => {
    it('handles incremental metrics and returns properly formatted data', async () => {
      const incrementalMetric = `test_pageviews_${shortId()}`
      const now = dayjs()
      const timestamps = [now.subtract(2, 'hour'), now.subtract(1, 'hour'), now]

      for (const time of timestamps) {
        await fictionClickhouse.queries.MetricTrack.serve({
          orgId,
          metric: incrementalMetric,
          count: 10,
          timestamp: time.unix(),
        }, { caller: 'test', server: true })
      }

      const result = await fictionClickhouse.queries.MetricAnalytics.serve({
        orgId,
        metric: [incrementalMetric],
        period: 'hour4',
        handling: 'increment',
        interval: 'hour',
      }, { caller: 'test', server: true })

      expect(result.status).toBe('success')
      expect(result.data?.main).toMatchInlineSnapshot(`
        [
          {
            "count": 10,
            "date": "2024-12-22T15:00:00.000Z",
          },
          {
            "count": 10,
            "date": "2024-12-22T16:00:00.000Z",
          },
          {
            "count": 10,
            "date": "2024-12-22T17:00:00.000Z",
          },
        ]
      `)
      expect(result.data?.mainTotals?.count).toBe(30) // Sum of all increments
      expect(result.data?.main?.length).toBe(3)
    })

    it('handles snapshot metrics with proper value carryforward', async () => {
      const snapshotMetric = `test_followers_${shortId()}`
      const now = dayjs()
      const snapshots = [
        { time: now.subtract(2, 'hour'), count: 100 },
        { time: now.subtract(1, 'hour'), count: 150 },
        { time: now, count: 200 },
      ]

      for (const snapshot of snapshots) {
        await fictionClickhouse.queries.MetricTrack.serve({
          orgId,
          metric: snapshotMetric,
          count: snapshot.count,
          timestamp: snapshot.time.unix(),
        }, { caller: 'test', server: true })
      }

      const result = await fictionClickhouse.queries.MetricAnalytics.serve({
        orgId,
        metric: [snapshotMetric],
        period: 'hour4',
        handling: 'snapshot',
        interval: 'hour',
      }, { caller: 'test', server: true })

      expect(result.status).toBe('success')
      expect(result.data?.main).toBeDefined()

      const mainData = result.data?.main || []
      const lastPoint = mainData[mainData.length - 1]
      expect(lastPoint?.count).toBe(200)
    })

    it.only('provides accurate period comparisons', async () => {
      const compareMetric = `test_sales_${shortId()}`

      await fictionClickhouse.queries.MetricTrack.serve({
        orgId,
        metric: compareMetric,
        count: 50,
        timestamp: dayjs().unix(),
      }, { caller: 'test', server: true })

      await fictionClickhouse.queries.MetricTrack.serve({
        orgId,
        metric: compareMetric,
        count: 30,
        timestamp: dayjs().subtract(9, 'day').unix(),
      }, { caller: 'test', server: true })

      const result = await fictionClickhouse.queries.MetricAnalytics.serve({
        orgId,
        metric: [compareMetric],
        period: 'week',
        compare: 'week',
        handling: 'increment',
      }, { caller: 'test', server: true })

      expect(result.status).toBe('success')
      expect(result.data?.main).toBeDefined()
      expect(result.data?.compare).toBeDefined()
      expect(result.data?.mainTotals?.count).toBe(50)
      expect(result.data?.compareTotals?.count).toBe(30)
    })
  })
})
