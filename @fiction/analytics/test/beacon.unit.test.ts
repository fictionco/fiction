import type { FictionEvent } from '../typesTracking'
import { objectId, shortId, waitFor } from '@fiction/core'
import { afterAll, describe, expect, it } from 'vitest'
import { cacheSession, processAndSaveEvents, processRawEvents } from '../plugin-beacon/utils/session'
import { createAnalyticsTestUtils } from './helpers'

describe('beacon event saving', async () => {
  const testUtils = await createAnalyticsTestUtils()
  const orgId = objectId()
  const fictionAnalytics = testUtils.fictionAnalytics

  await testUtils.start()
  testUtils.fictionBeacon?.init()

  afterAll(async () => {
    await testUtils.close()
    testUtils.fictionBeacon?.close()
  })

  const makeViewEvent = (args: { anonymousId: string, path?: string }) => {
    const { anonymousId, path } = args
    return {
      event: 'view',
      anonymousId,
      orgId,
      timestamp: '2024-01-01T12:00:00Z',
      context: {
        page: { url: `https://www.example.com?${path}`, referrer: `https://google.com?${path}` },
        userAgent: 'test-agent',
      },
    }
  }

  const createSessionFromView = async (args: { anonymousId: string, views?: number }) => {
    const { anonymousId, views = 5 } = args
    const events = []
    for (let i = 0; i < views; i++) {
      const raw = makeViewEvent({ anonymousId, path: `v${i}` })
      events.push(raw)
    }
    await processAndSaveEvents({ events, fictionAnalytics })
  }

  it('should save view events to clickhouse and update session', async () => {
    const anonymousId = objectId()
    await createSessionFromView({ anonymousId })

    // Wait for buffer flush
    await waitFor(250)

    const ch = testUtils.fictionClickhouse
    const viewEvents = await ch.clickHouseSelect(
      ch.clickhouseBaseQuery({ orgId, table: 'event' })
        .where({ event: 'view', anonymousId })
        .orderBy('timestamp', 'desc')
        .limit(1),
      { caller: 'test' },
    )

    expect(viewEvents.data).toHaveLength(1)
    expect(viewEvents.data[0]).toMatchObject({
      event: 'view',
      anonymousId,
      orgId,
      pathname: '/',
      referrer: 'https://google.com?v0',
    })

    // Verify session was created
    const session = await cacheSession({ _action: 'get', anonymousId, fictionAnalytics })
    expect(session).toBeDefined()
    expect(session?.isOpened).toBe(true)
  }, { retry: 2 })

  it('should save session data when session expires', async () => {
    const anonymousId = objectId()
    await createSessionFromView({ anonymousId, views: 1 })

    // Wait for buffer flush
    await waitFor(1200)

    const ch = testUtils.fictionClickhouse
    const sessionEvents = await ch.clickHouseSelect(
      ch.clickhouseBaseQuerySession({ orgId })
        .where({ session__anonymousId: anonymousId })
        .orderBy('session__timestamp', 'desc')
        .limit(1),
      { caller: 'test' },
    )

    expect(sessionEvents.data.length).toBe(1)

    expect(sessionEvents.data[0]).toMatchObject({

      session__anonymousId: anonymousId,
      session__orgId: orgId,
      // Session metadata
      session__isReturning: 0,
      session__isBounce: 1,
      // Event counts
      session__pageCount: 1,
      session__eventCount: 3, // view, init, session events
    })
  })

  it('should batch multiple events in buffer before saving', async () => {
    const anonymousId = objectId()
    await createSessionFromView({ anonymousId, views: 3 })

    // Wait for buffer flush
    await waitFor(1200)

    const ch = testUtils.fictionClickhouse
    const savedEvents = await ch.clickHouseSelect(
      ch.clickhouseBaseQuery({ orgId, table: 'event' })
        .where({ anonymousId })
        .orderBy('timestamp', 'asc'),
      { caller: 'test' },
    )

    // Should have 6 events: 5 clicks + 1 init + 1 session
    expect(savedEvents.data).toHaveLength(5)
    expect(savedEvents.data.map(e => e.event).sort()).toEqual(['init', 'session', 'view', 'view', 'view'])
  })

  it('should create new session for inactive user returning', async () => {
    const anonymousId = objectId()
    await createSessionFromView({ anonymousId, views: 1 })
    await waitFor(1000)
    await createSessionFromView({ anonymousId, views: 1 })
    await waitFor(1000)

    const ch = testUtils.fictionClickhouse
    const sessions = await ch.clickHouseSelect(
      ch.clickhouseBaseQuerySession({ orgId })
        .where({ session__anonymousId: anonymousId })
        .orderBy('session__endedAt', 'desc'),
      { caller: 'test' },
    )

    // Should have created second session
    expect(sessions.data).toHaveLength(2)

    expect(sessions.data[0]).toMatchObject({
      session__sessionNo: 2,
      session__isReturning: 1,
    })
  })
})

describe('fictionBeacon', async () => {
  const testUtils = await createAnalyticsTestUtils()
  await testUtils.start()
  const beaconServerConfig = await testUtils.fictionBeacon?.init()
  const fictionAnalytics = testUtils.fictionAnalytics

  afterAll(async () => {
    await testUtils.close()
    testUtils.fictionBeacon?.close()
  })

  const orgId = objectId()
  const anonymousId = objectId()

  it('should create beacon server', async () => {
    expect(beaconServerConfig).toBeDefined()

    const health = await fetch(`${beaconServerConfig?.beaconUrl}/health`)
    const healthJson = await health.json()
    expect(healthJson.status).toBe('success')
    expect(Object.keys(healthJson)).toMatchInlineSnapshot(`
      [
        "id",
        "status",
        "message",
        "duration",
        "timestamp",
        "commit",
        "memoryUsage",
        "cpuUsage",
        "loadAverage",
        "environment",
        "requestCount",
        "activeConnections",
      ]
    `)
  })

  it('should parse raw events and save them correctly', async () => {
    const rawEvents: FictionEvent[] = [
      {
        event: 'view',
        anonymousId,
        properties: { key: 'value' },
        context: { ip: '127.0.0.1', userAgent: 'test-agent-t2' },
        timestamp: '2024-06-19T12:00:00Z',
        orgId,
      },
      {
        event: 'stat',
        anonymousId,
        properties: { key: 'value' },
        context: { ip: '127.0.0.1', userAgent: 'test-agent-t2x' },
        timestamp: '2024-06-19T12:03:00Z',
        orgId,
      },
    ]

    const saveEvents = await processRawEvents({ events: rawEvents, fictionAnalytics })

    expect(saveEvents).toBeDefined()
    expect(saveEvents.map(_ => _.event)).toMatchInlineSnapshot(`
      [
        "init",
      ]
    `)
    expect(saveEvents[0].event).toBe('init')
    expect(saveEvents[0].anonymousId).toBe(anonymousId)
  })

  it('should save events to ClickHouse', async () => {
    const anonymousId = objectId()
    const rawEvents: FictionEvent[] = [
      {
        event: 'click',
        anonymousId,
        properties: { key: 'value' },
        context: { ip: '127.0.0.1', userAgent: 'test-agent-test-3' },
        timestamp: '2024-06-19T12:00:00Z',
        orgId,
      },
    ]

    await processAndSaveEvents({ events: rawEvents, fictionAnalytics })

    await waitFor(300)
    const ch = testUtils.fictionClickhouse
    const query = ch.clickhouseBaseQuery({ orgId, table: 'event' })
      .select(ch.client().raw('count(anonymousId) as total, anonymousId'))
      .where({ anonymousId })
      .groupBy('anonymousId')

    const r = await ch.clickHouseSelect<{ total: number }>(query, { caller: 'saveEventsTest' })

    const data = r.data

    expect(+data[0].total).toBe(2)
  })

  it('should handle /pixel request and parse events correctly', async () => {
    expect(beaconServerConfig.beaconUrl).toBeDefined()
    const event = `pixel_event_${shortId()}`
    const sampleEvents = JSON.stringify([
      {
        event,
        anonymousId: objectId(),
        properties: { key: 'value' },
        context: { ip: '127.0.0.1', userAgent: 'pixel-agent' },
        orgId,
      },
    ])

    const response = await fetch(`${beaconServerConfig?.beaconUrl}/pixel?events=${encodeURIComponent(sampleEvents)}`, { method: 'GET' })

    expect(response.status).toBe(200)

    await waitFor(200)

    const q = testUtils.fictionClickhouse.clickhouseBaseQuery({ orgId, table: 'event' }).where({ event })
    const r = await testUtils.fictionClickhouse.clickHouseSelect(q, { caller: 'pixelTest' })

    expect(r.data).toHaveLength(1)
    expect(r.data[0]).toMatchObject({
      event,
    })
  })

  it('should handle /events request and parse events correctly', async () => {
    const sampleEvents = JSON.stringify([
      {
        event: 'test_event',
        properties: {
          key: 'value',
        },
        context: {
          ip: '127.0.0.1',
          userAgent: 'test-agent',
        },
      },
    ])

    const response = await fetch(`${beaconServerConfig?.beaconUrl}/events?events=${encodeURIComponent(sampleEvents)}`, { method: 'GET' })

    expect(response.status).toBe(200)
    const jsonResponse = await response.json()
    expect(jsonResponse.status).toBe('success')
    expect(jsonResponse.data).toBeDefined()
    expect(jsonResponse.data).toHaveLength(1)
    expect(jsonResponse.data[0]).toMatchObject({
      event: 'test_event',
      context: {
        ip: '127.0.0.1',
        userAgent: 'test-agent',
      },
    })
  })
})
