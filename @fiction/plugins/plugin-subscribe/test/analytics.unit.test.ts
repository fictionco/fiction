import type { TrackEventTypes } from '@fiction/analytics/index.js'
import type { TableSubscribeConfig } from '../schema.js'
import { refineParams } from '@fiction/analytics/utils/refine'
import { abort, dayjs } from '@fiction/core'
import { createTestUser } from '@fiction/core/test-utils'

import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { describe, expect, it, vi } from 'vitest'
import { t } from '../schema.js'
import { getSubscriberMetrics, trackSubscriberMetrics } from '../utils/analytics.js'

describe('subscription analytics tracking', async () => {
  const testUtils = await createSiteTestUtils()
  const initialized = await testUtils.init()
  const orgId = initialized.orgId
  const fictionSubscribe = testUtils.fictionSubscribe
  const trackSpy = vi.spyOn(testUtils.fictionAnalytics, 'track')

  it('tracks through complete subscriber lifecycle', async () => {
    // Create subscriber
    const createResponse = await fictionSubscribe.queries.ManageSubscription.serve({
      _action: 'create',
      orgId,
      subscriber: {
        email: 'test@example.com',
        status: 'active',
      },
    }, { server: true })

    expect(trackSpy).toHaveBeenCalledWith({
      orgId,
      event: 'subscriptionActive' satisfies keyof TrackEventTypes,
      email: 'test@example.com',
      userId: '',
    })

    const event: (keyof TrackEventTypes)[] = ['subscriptionTotalActive']

    // Query analytics for post metrics
    const result = await testUtils.fictionAnalytics.queries.MetricAnalytics.serve({
      orgId,
      event,
      timeStartAtIso: dayjs().subtract(1, 'day').toISOString(),
      timeEndAtIso: dayjs().add(1, 'day').toISOString(),
      interval: 'day',
      handling: 'snapshot',
    }, { server: true })

    expect(result.status).toBe('success')

    expect(result.data?.mainTotals).toEqual({
      date: expect.any(String),
      value: 1,
    })

    // Unsubscribe
    const subscriptionId = createResponse.data?.[0].subscriptionId

    if (!subscriptionId) {
      throw abort('missing subscriptionId')
    }

    await fictionSubscribe.queries.ManageSubscription.serve({
      _action: 'update',
      orgId,
      where: [{ subscriptionId }],
      fields: { status: 'unsubscribed' },
    }, { server: true })

    expect(trackSpy).toHaveBeenCalledWith({
      orgId,
      event: 'subscriptionUnsubscribed' satisfies keyof TrackEventTypes,
      email: 'test@example.com',
      userId: '',
    })

    // Delete
    await fictionSubscribe.queries.ManageSubscription.serve({
      _action: 'delete',
      orgId,
      where: [{ subscriptionId }],
    }, { server: true })

    expect(trackSpy).toHaveBeenCalledWith({
      orgId,
      event: 'subscriptionTotalActive' satisfies keyof TrackEventTypes,
      value: 0,
    })
  })

  it('tracks metrics after bulk operations', async () => {
    await fictionSubscribe.queries.ManageSubscription.serve({
      _action: 'bulkCreate',
      orgId,
      subscribers: [
        { email: 'one@test.com' },
        { email: 'two@test.com' },
      ],
    }, { server: true })

    const metrics = await getSubscriberMetrics({ orgId, fictionSubscribe })

    expect(metrics).toEqual({
      totalSubscribed: 2,
      totalUnsubscribed: 0,
      totalCleaned: 0,
    })

    expect(trackSpy).toHaveBeenCalledWith({
      orgId,
      event: 'subscriptionTotalActive' satisfies keyof TrackEventTypes,
      value: 2,
    })
  })
})

describe('subscriber metrics', async () => {
  const testUtils = await createSiteTestUtils()
  const initialized = await testUtils.init()
  const orgId = initialized.orgId

  const { user: user1 } = await createTestUser(testUtils.fictionUser)
  const { user: user2 } = await createTestUser(testUtils.fictionUser)
  const { user: user3 } = await createTestUser(testUtils.fictionUser)

  it('counts subscribers by status correctly', async () => {
    const db = testUtils.fictionDb.client()

    await db('fiction_subscribe').insert([
      { org_id: orgId, user_id: user1?.userId, status: 'active' },
      { org_id: orgId, user_id: user2?.userId, status: 'unsubscribed' },
      { org_id: orgId, user_id: user3?.userId, status: 'bounced' },
      { org_id: orgId, email: 'test@example.com', status: 'active' },
    ])

    const metrics = await getSubscriberMetrics({
      orgId,
      fictionSubscribe: testUtils.fictionSubscribe,
    })

    expect(metrics).toEqual({
      totalSubscribed: 2,
      totalUnsubscribed: 1,
      totalCleaned: 1,
    })
  })

  it('tracks metrics through analytics', async () => {
    const trackSpy = vi.spyOn(testUtils.fictionAnalytics, 'track')

    await trackSubscriberMetrics({
      orgId,
      fictionSubscribe: testUtils.fictionSubscribe,
    }, { server: true })

    expect(trackSpy).toHaveBeenCalledTimes(2)
    expect(trackSpy).toHaveBeenCalledWith({
      orgId,
      event: 'subscriptionTotalActive' satisfies keyof TrackEventTypes,
      value: 2,
    })
    expect(trackSpy).toHaveBeenCalledWith({
      orgId,
      event: 'subscriptionTotalUnsubscribed' satisfies keyof TrackEventTypes,
      value: 1,
    })
  })

  it('tracks status transitions correctly', async () => {
    const trackSpy = vi.spyOn(testUtils.fictionAnalytics, 'track')
    const db = testUtils.fictionDb.client()

    // Initial subscription
    await trackSubscriberMetrics({
      orgId,
      fictionSubscribe: testUtils.fictionSubscribe,
      subscribe: {
        status: 'active',
        email: 'test@example.com',
      } as TableSubscribeConfig,
    }, { server: true })

    expect(trackSpy).toHaveBeenCalledWith({
      orgId,
      event: 'subscriptionActive' satisfies keyof TrackEventTypes,
      email: 'test@example.com',
      userId: '',
    })

    // Status change
    await trackSubscriberMetrics({
      orgId,
      fictionSubscribe: testUtils.fictionSubscribe,
      previousStatus: 'active',
      subscribe: {
        status: 'unsubscribed',
        email: 'test@example.com',
      } as TableSubscribeConfig,
    }, { server: true })

    expect(trackSpy).toHaveBeenCalledWith({
      orgId,
      event: 'subscriptionUnsubscribed' satisfies keyof TrackEventTypes,
      email: 'test@example.com',
      userId: '',
    })
  })

  it('handles missing previous status', async () => {
    const trackSpy = vi.spyOn(testUtils.fictionAnalytics, 'track')

    await trackSubscriberMetrics({
      orgId,
      fictionSubscribe: testUtils.fictionSubscribe,
      subscribe: { status: 'active' } as TableSubscribeConfig,
    }, { server: true })

    expect(trackSpy).toHaveBeenCalledWith({
      orgId,
      event: 'subscriptionActive' satisfies keyof TrackEventTypes,
      email: '',
      userId: '',
    })
  })
})

describe('subscription endpoint', async () => {
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
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-11T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-12T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-13T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-14T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-15T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-16T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-17T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-18T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-19T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-20T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-21T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-22T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-23T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-24T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-25T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-26T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-27T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-28T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-29T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-30T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-05-31T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-01T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-02T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 1,
            },
            {
              "cleaned": 0,
              "date": "2024-06-03T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-04T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-05T07:00:00.000Z",
              "subscriptions": 1,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 1,
              "date": "2024-06-06T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-07T07:00:00.000Z",
              "subscriptions": 0,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-08T07:00:00.000Z",
              "subscriptions": 1,
              "tense": "past",
              "unsubscribes": 1,
            },
            {
              "cleaned": 0,
              "date": "2024-06-09T07:00:00.000Z",
              "subscriptions": 1,
              "tense": "past",
              "unsubscribes": 0,
            },
            {
              "cleaned": 0,
              "date": "2024-06-10T07:00:00.000Z",
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
            "nowIso": "2025-01-18T03:20:26.684Z",
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
