import type { DataPointChart, TimeLineInterval } from '@fiction/analytics/types'
import { refineParams, refineTimelineData } from '@fiction/analytics/utils/refine'
import { abort, dayjs } from '@fiction/core'
import { createTestUser } from '@fiction/core/test-utils'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { describe, expect, it } from 'vitest'

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
              "date": "2024-05-10T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-11T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-12T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-13T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-14T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-15T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-16T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-17T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-18T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-19T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-20T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-21T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-22T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-23T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-24T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-25T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-26T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-27T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-28T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-29T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-30T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-31T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-01T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-02T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 1,
            },
            {
              "cleaned": 0,
              "date": "2024-06-03T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-04T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-05T06:00:00.000Z",
              "subscriptions": 1,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 1,
              "date": "2024-06-06T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-07T06:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-08T06:00:00.000Z",
              "subscriptions": 1,
              "tense": "past",
              "unsubscribes": 1,
            },
            {
              "cleaned": 0,
              "date": "2024-06-09T06:00:00.000Z",
              "subscriptions": 1,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-10T06:00:00.000Z",
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
            "timeZone": "America/Denver",
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
      { date: '2024-06-01T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 0, tense: 'past' },
      { date: '2024-06-02T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 0, tense: 'past' },
      { date: '2024-06-03T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 0, tense: 'past' },
      { date: '2024-06-04T00:00:00.000Z', subscriptions: 0, unsubscribes: 1, cleaned: 0, tense: 'past' },
      { date: '2024-06-05T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 0, tense: 'past' },
      { date: '2024-06-06T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 0, tense: 'past' },
      { date: '2024-06-07T00:00:00.000Z', subscriptions: 1, unsubscribes: 0, cleaned: 0, tense: 'past' },
      { date: '2024-06-08T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 1, tense: 'past' },
      { date: '2024-06-09T00:00:00.000Z', subscriptions: 0, unsubscribes: 1, cleaned: 0, tense: 'past' },
      { date: '2024-06-10T00:00:00.000Z', subscriptions: 2, unsubscribes: 0, cleaned: 0, tense: 'past' },
      { date: '2024-06-11T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 0, tense: 'present' },
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
    expect(refinedData[1]).toEqual({ date: '2024-06-01T00:00:00.000Z', tense: 'past' })
    expect(refinedData[11]).toEqual({ date: '2024-06-11T00:00:00.000Z', tense: 'present' })
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

    const refinedData = refineTimelineData({
      timeZone,
      timeStartAtIso,
      timeEndAtIso,
      interval,
      data,
      nowIso,
      withRollup: false,
    })

    expect(refinedData.length).toBe(13) // 12 hours + initial point
    expect(refinedData[0]).toEqual({
      date: '2024-06-10T00:00:00.000Z',
      subscriptions: 2,
      unsubscribes: 0,
      cleaned: 0,
      tense: 'past',
    })
    expect(refinedData[12]).toEqual({
      date: '2024-06-10T12:00:00.000Z',
      subscriptions: 0,
      unsubscribes: 0,
      cleaned: 0,
      tense: 'present',
    })
  })
})

describe('refineData snapshot', () => {
  const baseArgs = {
    timeStartAtIso: '2024-06-01T00:00:00.000Z',
    timeEndAtIso: '2024-06-05T00:00:00.000Z',
    nowIso: '2024-06-05T00:00:00.000Z',
    timeZone: 'UTC',
    interval: 'day' as TimeLineInterval,
  }

  it('handles snapshot mode with follower counts', () => {
    const data: DataPointChart[] = [
      { date: '2024-06-01T00:00:00.000Z', followers: 100, engagement: 50 },
      { date: '2024-06-03T00:00:00.000Z', followers: 150, engagement: 75 },
    ]

    const refinedData = refineTimelineData({
      ...baseArgs,
      data,
      snapshotKeys: ['followers', 'engagement'],
    })

    expect(refinedData).toEqual([
      {
        date: '2024-06-01T00:00:00.000Z',
        followers: 100,
        engagement: 50,
        tense: 'past',
      },
      {
        date: '2024-06-02T00:00:00.000Z',
        followers: 100, // Carried forward
        engagement: 50, // Carried forward
        tense: 'past',
      },
      {
        date: '2024-06-03T00:00:00.000Z',
        followers: 150, // Updated
        engagement: 75, // Updated
        tense: 'past',
      },
      {
        date: '2024-06-04T00:00:00.000Z',
        followers: 150, // Carried forward
        engagement: 75, // Carried forward
        tense: 'past',
      },
      {
        date: '2024-06-05T00:00:00.000Z',
        followers: 150, // Carried forward
        engagement: 75, // Carried forward
        tense: 'present',
      },
    ])
  })

  it('maintains increment mode behavior for activity metrics', () => {
    const data: DataPointChart[] = [
      { date: '2024-06-01T00:00:00.000Z', views: 100, likes: 50 },
      { date: '2024-06-03T00:00:00.000Z', views: 150, likes: 75 },
    ]

    const refinedData = refineTimelineData({
      ...baseArgs,
      data,
    })

    expect(refinedData).toEqual([
      {
        date: '2024-06-01T00:00:00.000Z',
        views: 100,
        likes: 50,
        tense: 'past',
      },
      {
        date: '2024-06-02T00:00:00.000Z',
        views: 0, // Reset to 0
        likes: 0, // Reset to 0
        tense: 'past',
      },
      {
        date: '2024-06-03T00:00:00.000Z',
        views: 150,
        likes: 75,
        tense: 'past',
      },
      {
        date: '2024-06-04T00:00:00.000Z',
        views: 0, // Reset to 0
        likes: 0, // Reset to 0
        tense: 'past',
      },
      {
        date: '2024-06-05T00:00:00.000Z',
        views: 0, // Reset to 0
        likes: 0, // Reset to 0
        tense: 'present',
      },
    ])
  })

  it('handles mixed snapshot and increment data when specified', () => {
    const data: DataPointChart[] = [
      {
        date: '2024-06-01T00:00:00.000Z',
        followers: 100, // Snapshot
        posts: 5, // Increment
      },
      {
        date: '2024-06-03T00:00:00.000Z',
        followers: 150, // Snapshot
        posts: 3, // Increment
      },
    ]

    const refinedData = refineTimelineData({
      ...baseArgs,
      data,
      snapshotKeys: ['followers'], // Specify which keys should use snapshot mode
    })

    expect(refinedData).toEqual([
      {
        date: '2024-06-01T00:00:00.000Z',
        followers: 100, // Initial snapshot value
        posts: 5, // Initial increment value
        tense: 'past',
      },
      {
        date: '2024-06-02T00:00:00.000Z',
        followers: 100, // Carried forward
        posts: 0, // Reset to 0
        tense: 'past',
      },
      {
        date: '2024-06-03T00:00:00.000Z',
        followers: 150, // Updated snapshot
        posts: 3, // New increment value
        tense: 'past',
      },
      {
        date: '2024-06-04T00:00:00.000Z',
        followers: 150, // Carried forward
        posts: 0, // Reset to 0
        tense: 'past',
      },
      {
        date: '2024-06-05T00:00:00.000Z',
        followers: 150, // Carried forward
        posts: 0, // Reset to 0
        tense: 'present',
      },
    ])
  })

  it('handles empty data in snapshot mode', () => {
    const refinedData = refineTimelineData({ ...baseArgs, data: [] })

    expect(refinedData).toHaveLength(5)
    expect(refinedData[0]).toEqual({
      date: '2024-06-01T00:00:00.000Z',
      tense: 'past',
    })

    const refinedData2 = refineTimelineData({
      data: [],
      timeStartAtIso: '2024-10-23T16:05:37.073Z',
      timeEndAtIso: '2024-11-22T16:05:37.073Z',
      timeZone: 'UTC',
      interval: 'hour',
      snapshotKeys: [],
    })

    expect(refinedData2).toHaveLength(721)
  })
})
