import { dayjs, shortId } from '@fiction/core'
import { describe, expect, it } from 'vitest'
import { createAnalyticsTestUtils } from './helpers.js'

describe('metrics', async () => {
  const testUtils = await createAnalyticsTestUtils()
  const initialized = await testUtils.start()

  const { fictionClickhouse } = testUtils.fictionAnalytics

  if (!fictionClickhouse)
    throw new Error('no clickhouse')

  const orgId = initialized.org.orgId

  if (!orgId)
    throw new Error('no orgId')

  const event = 'test_metric'

  describe('queryEventTrack', () => {
    it('has clickhouse db', async () => {
      const check = await fetch('http://localhost:8123', { method: 'GET' })
      const checkText = await check.text()
      expect(checkText.trim()).toBe('Ok.')
    })

    it('tracks incremental metrics correctly', async () => {
      const trackResult = await testUtils.fictionAnalytics.queries.EventTrack.serve({
        eventData: {
          orgId,
          event,
          value: 5,
        },
      }, { caller: 'test', server: true })

      expect(trackResult.status).toBe('success')
      // Verify the data was saved
      const query = fictionClickhouse
        .clickhouseBaseQuery({ orgId, table: 'event' })
        .where({ event })
        .orderBy('timestamp', 'desc')

      const { data: [savedMetric] } = await fictionClickhouse.clickHouseSelect(query, { caller: 'testQueryEventTrack' })

      expect(savedMetric.value).toBe(5)
    })
  })

  describe('queryMetricAnalytics', () => {
    it('handles incremental metrics and returns properly formatted data', async () => {
      const incrementalMetric = `test_pageviews_${shortId()}`
      const now = dayjs()
      const timestamps = [now.subtract(2, 'hour'), now.subtract(1, 'hour'), now]

      for (const time of timestamps) {
        await testUtils.fictionAnalytics.queries.EventTrack.serve({
          eventData: {
            orgId,
            event: incrementalMetric,
            value: 10,
            timestamp: time.unix(),
          },
        }, { caller: 'test', server: true })
      }

      const result = await testUtils.fictionAnalytics.queries.MetricAnalytics.serve({
        orgId,
        event: [incrementalMetric],
        period: 'hour4',
        handling: 'increment',
        interval: 'hour',
      }, { caller: 'test', server: true })

      expect(result.status).toBe('success')

      const { main, mainTotals } = result.data || {}
      expect({ main, mainTotals }).toMatchInlineSnapshot(`
        {
          "main": [
            {
              "date": "2025-08-01T03:00:00.000Z",
              "value": 10,
            },
            {
              "date": "2025-08-01T04:00:00.000Z",
              "value": 10,
            },
            {
              "date": "2025-08-01T05:00:00.000Z",
              "value": 10,
            },
          ],
          "mainTotals": {
            "date": "",
            "value": 30,
          },
        }
      `)
      expect(result.data?.mainTotals?.value).toBe(30) // Sum of all increments
      expect(result.data?.main?.length).toBe(3)
    })

    it('handles snapshot metrics with proper value carryforward', async () => {
      const snapshotMetric = `test_followers_${shortId()}`
      const now = dayjs()
      const snapshots = [
        { time: now.subtract(2, 'hour'), value: 100 },
        { time: now.subtract(1, 'hour'), value: 150 },
        { time: now, value: 200 },
      ]

      for (const snapshot of snapshots) {
        await testUtils.fictionAnalytics.queries.EventTrack.serve({
          eventData: {
            orgId,
            event: snapshotMetric,
            value: snapshot.value,
            timestamp: snapshot.time.unix(),
          },
        }, { caller: 'test', server: true })
      }

      const result = await testUtils.fictionAnalytics.queries.MetricAnalytics.serve({
        orgId,
        event: [snapshotMetric],
        period: 'hour4',
        handling: 'snapshot',
        interval: 'hour',
      }, { caller: 'test', server: true })

      expect(result.status).toBe('success')
      expect(result.data?.main).toBeDefined()

      const mainData = result.data?.main || []
      const lastPoint = mainData[mainData.length - 1]
      expect(lastPoint?.value).toBe(200)
    })

    it('provides accurate period comparisons', async () => {
      const compareMetric = `test_sales_${shortId()}`

      await testUtils.fictionAnalytics.queries.EventTrack.serve({
        eventData: {
          orgId,
          event: compareMetric,
          value: 50,
          timestamp: dayjs().unix(),
        },

      }, { caller: 'test', server: true })

      await testUtils.fictionAnalytics.queries.EventTrack.serve({
        eventData: {
          orgId,
          event: compareMetric,
          value: 30,
          timestamp: dayjs().subtract(9, 'day').unix(),
        },
      }, { caller: 'test', server: true })

      const result = await testUtils.fictionAnalytics.queries.MetricAnalytics.serve({
        orgId,
        event: [compareMetric],
        period: 'week',
        compare: 'week',
        handling: 'increment',
      }, { caller: 'test', server: true })

      expect(result.status).toBe('success')
      expect(result.data?.main).toBeDefined()
      expect(result.data?.compare).toBeDefined()
      expect(result.data?.mainTotals?.value).toBe(50)
      expect(result.data?.compareTotals?.value).toBe(30)
    })
  })
})
