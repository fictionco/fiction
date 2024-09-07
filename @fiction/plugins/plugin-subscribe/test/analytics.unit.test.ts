import { refineParams, refineTimelineData } from '@fiction/analytics/utils/refine'
import { abort, dayjs } from '@fiction/core'
import { createTestUser } from '@fiction/core/test-utils'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { describe, expect, it } from 'vitest'
import type { DataPointChart, TimeLineInterval } from '@fiction/analytics/types'

import { t } from '../schema.js'

describe('subscriptione endpoint', async () => {
  const testUtils = await createSiteTestUtils()

  const initialized = await testUtils.init()

  const orgId = initialized.orgId
  const userId = initialized.user.userId

  const { user: user2 } = await createTestUser(testUtils.fictionUser)
  const userId2 = user2?.userId

  const { user: user3 } = await createTestUser(testUtils.fictionUser)
  const userId3 = user3?.userId

  const { user: user4 } = await createTestUser(testUtils.fictionUser)
  const userId4 = user4?.userId

  const { user: user5 } = await createTestUser(testUtils.fictionUser)
  const userId5 = user5?.userId

  const setTestData = dayjs('2024-06-11T04:40:00.000Z')

  if (!orgId || !userId || !userId2 || !userId3) {
    throw abort('missing orgId or userId')
  }

  it('has analytics data correct', async () => {
    const db = testUtils.fictionDb.client()

    // Insert test data
    await db(t.subscribe).insert([
      { org_id: orgId, user_id: userId, status: 'active', updated_at: setTestData.subtract(1.4, 'day').toDate() },
      { org_id: orgId, user_id: userId2, status: 'unsubscribed', previous_status: 'active', updated_at: setTestData.subtract(40, 'hour').toDate() },
      { org_id: orgId, user_id: userId3, status: 'bounced', previous_status: 'active', updated_at: setTestData.subtract(3, 'day').toDate() },
      { org_id: orgId, user_id: userId4, status: 'active', updated_at: setTestData.subtract(5, 'hour').toDate() },
      { org_id: orgId, user_id: userId5, status: 'unsubscribed', previous_status: 'active', updated_at: setTestData.subtract(7, 'day').toDate() },
      { org_id: orgId, email: 'some@email.com', status: 'active', updated_at: setTestData.subtract(4, 'day').toDate() },
    ])

    const r = await testUtils.fictionSubscribe.queries.SubscriptionAnalytics.serve(refineParams({
      orgId,
      timeStartAtIso: setTestData.subtract(30, 'day').toISOString(),
      timeEndAtIso: setTestData.toISOString(),
      interval: 'day',
      order: 'asc',
    }), { server: true })

    if (r.data?.params)
      r.data.params.orgId = 'ORG_ID'

    expect(r.status).toBe('success')

    expect(r.data?.main?.length).toBeGreaterThan(0)

    expect(r).toMatchInlineSnapshot(`
      {
        "data": {
          "main": [
            {
              "cleaned": 0,
              "date": "2024-05-10T07:00:00.000Z",
              "label": "May 10",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-11T07:00:00.000Z",
              "label": "May 11",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-12T07:00:00.000Z",
              "label": "May 12",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-13T07:00:00.000Z",
              "label": "May 13",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-14T07:00:00.000Z",
              "label": "May 14",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-15T07:00:00.000Z",
              "label": "May 15",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-16T07:00:00.000Z",
              "label": "May 16",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-17T07:00:00.000Z",
              "label": "May 17",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-18T07:00:00.000Z",
              "label": "May 18",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-19T07:00:00.000Z",
              "label": "May 19",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-20T07:00:00.000Z",
              "label": "May 20",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-21T07:00:00.000Z",
              "label": "May 21",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-22T07:00:00.000Z",
              "label": "May 22",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-23T07:00:00.000Z",
              "label": "May 23",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-24T07:00:00.000Z",
              "label": "May 24",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-25T07:00:00.000Z",
              "label": "May 25",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-26T07:00:00.000Z",
              "label": "May 26",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-27T07:00:00.000Z",
              "label": "May 27",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-28T07:00:00.000Z",
              "label": "May 28",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-29T07:00:00.000Z",
              "label": "May 29",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-30T07:00:00.000Z",
              "label": "May 30",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-31T07:00:00.000Z",
              "label": "May 31",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-01T07:00:00.000Z",
              "label": "Jun 1",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-02T07:00:00.000Z",
              "label": "Jun 2",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 1,
            },
            {
              "cleaned": 0,
              "date": "2024-06-03T07:00:00.000Z",
              "label": "Jun 3",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-04T07:00:00.000Z",
              "label": "Jun 4",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-05T07:00:00.000Z",
              "label": "Jun 5",
              "subscriptions": 1,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 1,
              "date": "2024-06-06T07:00:00.000Z",
              "label": "Jun 6",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-07T07:00:00.000Z",
              "label": "Jun 7",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-08T07:00:00.000Z",
              "label": "Jun 8",
              "subscriptions": 1,
              "tense": "past",
              "unsubscribes": 1,
            },
            {
              "cleaned": 0,
              "date": "2024-06-09T07:00:00.000Z",
              "label": "Jun 9",
              "subscriptions": 1,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-10T07:00:00.000Z",
              "label": "Jun 10",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
          ],
          "mainTotals": {
            "cleaned": 1,
            "date": "",
            "subscriptions": 3,
            "unsubscribes": 2,
          },
          "params": {
            "compareEndAtIso": "2024-05-10T04:40:00.000Z",
            "compareStartAtIso": "2024-04-09T04:40:00.000Z",
            "interval": "day",
            "order": "asc",
            "orgId": "ORG_ID",
            "timeEndAtIso": "2024-06-11T04:40:00.000Z",
            "timeStartAtIso": "2024-05-11T04:40:00.000Z",
            "timeZone": "America/Los_Angeles",
          },
        },
        "status": "success",
      }
    `)
  })
})

describe('refineTimelineData', () => {
  it('correctly refines timeline data with daily interval', () => {
    const timeStartAtIso = '2024-06-01T00:00:00.000Z'
    const timeEndAtIso = '2024-06-11T00:00:00.000Z'
    const nowIso = '2024-06-11T00:00:00.000Z'
    const timeZone = 'UTC'
    const interval: TimeLineInterval = 'day'
    const now = dayjs(nowIso)
    const data: DataPointChart[] = [
      {
        cleaned: 1,
        date: '',
        subscriptions: 3,
        unsubscribes: 2,
      },
      {
        cleaned: 0,
        date: now.subtract(7, 'day').toISOString(),
        subscriptions: 0,
        unsubscribes: 1,
      },
      {
        cleaned: 0,
        date: now.subtract(4, 'day').toISOString(),
        subscriptions: 1,
        unsubscribes: 0,
      },
      {
        cleaned: 1,
        date: now.subtract(3, 'day').toISOString(),
        subscriptions: 0,
        unsubscribes: 0,
      },
      {
        cleaned: 0,
        date: now.subtract(2, 'day').toISOString(),
        subscriptions: 0,
        unsubscribes: 1,
      },
      {
        cleaned: 0,
        date: now.subtract(1, 'day').toISOString(),
        subscriptions: 2,
        unsubscribes: 0,
      },
    ]

    const refinedData = refineTimelineData({ timeZone, timeStartAtIso, timeEndAtIso, interval, data, withRollup: true, nowIso })

    expect(refinedData).toEqual([
      { date: '', subscriptions: 3, unsubscribes: 2, cleaned: 1, label: 'Totals', tense: 'past' },
      { date: '2024-06-01T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 0, label: 'Jun 1', tense: 'past' },
      { date: '2024-06-02T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 0, label: 'Jun 2', tense: 'past' },
      { date: '2024-06-03T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 0, label: 'Jun 3', tense: 'past' },
      { date: '2024-06-04T00:00:00.000Z', subscriptions: 0, unsubscribes: 1, cleaned: 0, label: 'Jun 4', tense: 'past' },
      { date: '2024-06-05T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 0, label: 'Jun 5', tense: 'past' },
      { date: '2024-06-06T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 0, label: 'Jun 6', tense: 'past' },
      { date: '2024-06-07T00:00:00.000Z', subscriptions: 1, unsubscribes: 0, cleaned: 0, label: 'Jun 7', tense: 'past' },
      { date: '2024-06-08T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 1, label: 'Jun 8', tense: 'past' },
      { date: '2024-06-09T00:00:00.000Z', subscriptions: 0, unsubscribes: 1, cleaned: 0, label: 'Jun 9', tense: 'past' },
      { date: '2024-06-10T00:00:00.000Z', subscriptions: 2, unsubscribes: 0, cleaned: 0, label: 'Jun 10', tense: 'past' },
      { date: '2024-06-11T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 0, label: 'Jun 11', tense: 'present' },
    ])
  })

  it('handles empty data array', () => {
    const timeStartAtIso = '2024-06-01T00:00:00.000Z'
    const timeEndAtIso = '2024-06-11T00:00:00.000Z'
    const nowIso = '2024-06-11T00:00:00.000Z'
    const timeZone = 'UTC'
    const interval: TimeLineInterval = 'day'
    const data: DataPointChart[] = []

    const refinedData = refineTimelineData({ timeZone, timeStartAtIso, timeEndAtIso, interval, data, nowIso, withRollup: true })

    expect(refinedData.length).toBe(12)
    expect(refinedData[1]).toEqual({ date: '2024-06-01T00:00:00.000Z', label: 'Jun 1', tense: 'past' })
    expect(refinedData[11]).toEqual({ date: '2024-06-11T00:00:00.000Z', label: 'Jun 11', tense: 'present' })
  })

  it('correctly refines timeline data with hourly interval', () => {
    const timeStartAtIso = '2024-06-10T00:00:00.000Z'
    const timeEndAtIso = '2024-06-10T12:00:00.000Z'
    const nowIso = '2024-06-10T12:00:00.000Z'
    const timeZone = 'UTC'
    const interval: TimeLineInterval = 'hour'
    const data: DataPointChart[] = [
      { date: '2024-06-10T00:00:00.000Z', subscriptions: 2, unsubscribes: 0, cleaned: 0 },
    ]

    const refinedData = refineTimelineData({ timeZone, timeStartAtIso, timeEndAtIso, interval, data, nowIso, withRollup: false })

    expect(refinedData.length).toBe(13) // 12 hours + initial point
    expect(refinedData[0]).toEqual({ date: '2024-06-10T00:00:00.000Z', subscriptions: 2, unsubscribes: 0, cleaned: 0, label: '12am', tense: 'past' })
    expect(refinedData[12]).toEqual({ date: '2024-06-10T12:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 0, label: '12pm', tense: 'present' })
  })
})
