import type { TrackEventTypes } from '@fiction/analytics/index.js'
import type { TableContactConfig } from '../schema.js'
import { refineParams } from '@fiction/analytics/utils/refine'
import { abort, dayjs } from '@fiction/core'
import { createTestUser } from '@fiction/core/test-utils'

import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { t } from '../schema.js'
import { getContactMetrics, trackContactMetrics } from '../utils/analytics.js'

describe('subscription analytics tracking', async () => {
  const testUtils = await createSiteTestUtils()
  const initialized = await testUtils.init()

  afterAll(() => testUtils.close())
  const orgId = initialized.orgId
  const fictionContact = testUtils.fictionContact
  const trackSpy = vi.spyOn(testUtils.fictionAnalytics, 'track')

  it('tracks through complete subscriber lifecycle', async () => {
    // Create subscriber
    const createResponse = await fictionContact.queries.ManageContact.serve({
      _action: 'create',
      orgId,
      contact: {
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
    const contactId = createResponse.data?.[0].contactId

    if (!contactId) {
      throw abort('missing contactId')
    }

    await fictionContact.queries.ManageContact.serve({
      _action: 'update',
      orgId,
      where: [{ contactId }],
      fields: { status: 'unsubscribed' },
    }, { server: true })

    expect(trackSpy).toHaveBeenCalledWith({
      orgId,
      event: 'subscriptionUnsubscribed' satisfies keyof TrackEventTypes,
      email: 'test@example.com',
      userId: '',
    })

    // Delete
    await fictionContact.queries.ManageContact.serve({
      _action: 'delete',
      orgId,
      where: [{ contactId }],
    }, { server: true })

    expect(trackSpy).toHaveBeenCalledWith({
      orgId,
      event: 'subscriptionTotalActive' satisfies keyof TrackEventTypes,
      value: 0,
    })
  })

  it('tracks metrics after bulk operations', async () => {
    await fictionContact.queries.ManageContact.serve({
      _action: 'bulkCreate',
      orgId,
      contacts: [
        { email: 'one@test.com' },
        { email: 'two@test.com' },
      ],
    }, { server: true })

    const metrics = await getContactMetrics({ orgId, fictionContact })

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

describe('contact metrics', async () => {
  const testUtils = await createSiteTestUtils()
  const initialized = await testUtils.init()

  afterAll(() => testUtils.close())
  const orgId = initialized.orgId

  const { user: user1 } = await createTestUser({ ...testUtils, caller: 'contactMetrics1' })
  const { user: user2 } = await createTestUser({ ...testUtils, caller: 'contactMetrics2' })
  const { user: user3 } = await createTestUser({ ...testUtils, caller: 'contactMetrics3' })

  it('counts contacts by status correctly', async () => {
    const db = testUtils.fictionDb.client()

    await db('fiction_contact').insert([
      { org_id: orgId, user_id: user1?.userId, status: 'active' },
      { org_id: orgId, user_id: user2?.userId, status: 'unsubscribed' },
      { org_id: orgId, user_id: user3?.userId, status: 'bounced' },
      { org_id: orgId, email: 'test@example.com', status: 'active' },
    ])

    const metrics = await getContactMetrics({
      orgId,
      fictionContact: testUtils.fictionContact,
    })

    expect(metrics).toEqual({
      totalSubscribed: 2,
      totalUnsubscribed: 1,
      totalCleaned: 1,
    })
  })

  it('tracks metrics through analytics', async () => {
    const trackSpy = vi.spyOn(testUtils.fictionAnalytics, 'track')

    await trackContactMetrics({
      orgId,
      fictionContact: testUtils.fictionContact,
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
    await trackContactMetrics({
      orgId,
      fictionContact: testUtils.fictionContact,
      contact: {
        status: 'active',
        email: 'test@example.com',
      } as TableContactConfig,
    }, { server: true })

    expect(trackSpy).toHaveBeenCalledWith({
      orgId,
      event: 'subscriptionActive' satisfies keyof TrackEventTypes,
      email: 'test@example.com',
      userId: '',
    })

    // Status change
    await trackContactMetrics({
      orgId,
      fictionContact: testUtils.fictionContact,
      previousStatus: 'active',
      contact: {
        status: 'unsubscribed',
        email: 'test@example.com',
      } as TableContactConfig,
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

    await trackContactMetrics({
      orgId,
      fictionContact: testUtils.fictionContact,
      contact: { status: 'active' } as TableContactConfig,
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

  afterAll(() => testUtils.close())

  const orgId = initialized.orgId
  const userId = initialized.user.userId

  const { user: user2 } = await createTestUser({ ...testUtils, caller: 'subscriberMetrics4' })
  const userId2 = user2?.userId

  const { user: user3 } = await createTestUser({ ...testUtils, caller: 'subscriberMetrics5' })
  const userId3 = user3?.userId

  const { user: user4 } = await createTestUser({ ...testUtils, caller: 'subscriberMetrics6' })
  const userId4 = user4?.userId

  const { user: user5 } = await createTestUser({ ...testUtils, caller: 'subscriberMetrics7' })
  const userId5 = user5?.userId

  const setTestData = dayjs('2024-06-11T04:40:00.000Z')

  if (!orgId || !userId || !userId2 || !userId3) {
    throw abort('missing orgId or userId')
  }

  it('has analytics data correct', async () => {
    const db = testUtils.fictionDb.client()

    // Insert test data
    await db(t.contact).insert([
      { org_id: orgId, user_id: userId, status: 'active', updated_at: setTestData.subtract(1.4, 'day').toDate() },
      { org_id: orgId, user_id: userId2, status: 'unsubscribed', previous_status: 'active', updated_at: setTestData.subtract(40, 'hour').toDate() },
      { org_id: orgId, user_id: userId3, status: 'bounced', previous_status: 'active', updated_at: setTestData.subtract(3, 'day').toDate() },
      { org_id: orgId, user_id: userId4, status: 'active', updated_at: setTestData.subtract(5, 'hour').toDate() },
      { org_id: orgId, user_id: userId5, status: 'unsubscribed', previous_status: 'active', updated_at: setTestData.subtract(7, 'day').toDate() },
      { org_id: orgId, email: 'some@email.com', status: 'active', updated_at: setTestData.subtract(4, 'day').toDate() },
    ])

    const r = await testUtils.fictionContact.queries.SubscriptionAnalytics.serve(refineParams({
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

    expect(r?.data?.main).toMatchInlineSnapshot(`
      [
        {
          "cleaned": 0,
          "date": "2024-05-11T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-05-12T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-05-13T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-05-14T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-05-15T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-05-16T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-05-17T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-05-18T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-05-19T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-05-20T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-05-21T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-05-22T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-05-23T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-05-24T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-05-25T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-05-26T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-05-27T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-05-28T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-05-29T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-05-30T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-05-31T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-06-01T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-06-02T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-06-03T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-06-04T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 1,
        },
        {
          "cleaned": 0,
          "date": "2024-06-05T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-06-06T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-06-07T00:00:00.000Z",
          "subscriptions": 1,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 1,
          "date": "2024-06-08T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-06-09T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 1,
        },
        {
          "cleaned": 0,
          "date": "2024-06-10T00:00:00.000Z",
          "subscriptions": 2,
          "tense": "past",
          "unsubscribes": 0,
        },
        {
          "cleaned": 0,
          "date": "2024-06-11T00:00:00.000Z",
          "subscriptions": 0,
          "tense": "past",
          "unsubscribes": 0,
        },
      ]
    `)
  })
})
