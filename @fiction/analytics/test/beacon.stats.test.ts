import { afterAll, describe, expect, it } from 'vitest'
import { objectId, waitFor } from '@fiction/core'
import type { FictionEvent } from '../typesTracking'
import { createAnalyticsTestUtils } from './helpers'

describe('fictionBeacon', async () => {
  const testUtils = await createAnalyticsTestUtils()
  await testUtils.start()
  const beaconServerConfig = await testUtils.fictionBeacon?.createBeaconServer()
  const sessionManager = testUtils.fictionBeacon?.sessionManager

  const orgId = objectId()
  const anonymousId = objectId()

  if (!beaconServerConfig || !sessionManager) {
    throw new Error('beaconServerConfig or sessionManager is undefined')
  }

  afterAll(async () => {
    await testUtils.close()
  })

  it('should create beacon server', async () => {
    expect(beaconServerConfig).toBeDefined()

    const health = await fetch(`${beaconServerConfig?.beaconUrl}/health`)
    const healthJson = await health.json()
    expect(healthJson.status).toBe('success')
    expect(Object.keys(healthJson)).toMatchInlineSnapshot(`
      [
        "status",
        "message",
        "duration",
        "timestamp",
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
        context: { ip: '127.0.0.1', userAgent: 'test-agent' },
        timestamp: '2024-06-19T12:00:00Z',
        orgId,
      },
      {
        event: 'stat',
        anonymousId,
        properties: { key: 'value' },
        context: { ip: '127.0.0.1', userAgent: 'test-agent' },
        timestamp: '2024-06-19T12:03:00Z',
        orgId,
      },
    ]

    const saveEvents = await sessionManager.processRawEvents(rawEvents)

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
    const rawEvents: FictionEvent[] = [
      {
        event: 'click',
        anonymousId,
        properties: { key: 'value' },
        context: { ip: '127.0.0.1', userAgent: 'test-agent' },
        timestamp: '2024-06-19T12:00:00Z',
        orgId,
      },
    ]

    await sessionManager.processRawEvents(rawEvents)

    await waitFor(300)
    const ch = testUtils.fictionClickhouse
    const query = ch.clickhouseBaseQuery({ orgId })
      .select(ch.client().raw('count(anonymousId) as total, anonymousId'))
      .where({ anonymousId })
      .groupBy('anonymousId')

    const { data } = await ch.clickHouseSelect<{ total: number }[]>(query)

    expect(+data[0].total).toBe(2)
  })

  it('should handle /pixel request and parse events correctly', async () => {
    expect(beaconServerConfig.beaconUrl).toBeDefined()

    const sampleEvents = JSON.stringify([
      {
        event: 'pixel_event',
        properties: { key: 'value' },
        context: { ip: '127.0.0.1', userAgent: 'pixel-agent' },
      },
    ])

    const response = await fetch(`${beaconServerConfig?.beaconUrl}/pixel?events=${encodeURIComponent(sampleEvents)}`, { method: 'GET' })

    expect(response.status).toBe(200)
    const buf = testUtils.fictionBeacon.trackingBuffer
    expect(buf.size()).toBeGreaterThan(0)
    expect(Object.keys(buf.items[0])).toMatchInlineSnapshot(`
      [
        "context",
        "timestamp",
        "receivedAt",
        "event",
        "properties",
      ]
    `)

    testUtils.fictionBeacon.trackingBuffer.flushBuffer()
  })

  it('should handle /events request and parse events correctly', async () => {
    const c = await testUtils.fictionBeacon?.createBeaconServer()
    expect(c).toBeDefined()

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

    const response = await fetch(`${c?.beaconUrl}/events?events=${encodeURIComponent(sampleEvents)}`, { method: 'GET' })

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
