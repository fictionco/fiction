/**
 * @vitest-environment happy-dom
 */

import type { IdentifyTraitsUser, TrackingProperties } from '../typesTracking'
import { objectId, waitFor } from '@fiction/core'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { FictionClient } from '../tag/client.js'
import { createAnalyticsTestUtils } from './helpers'

describe('tracking client', async () => {
  const testUtils = await createAnalyticsTestUtils()
  await testUtils.start()
  const beaconServerConfig = await testUtils.fictionBeacon?.createBeaconServer()
  const beaconUrl = testUtils.fictionBeacon?.beaconUrl.value

  const sessionManager = testUtils.fictionBeacon?.sessionManager

  sessionManager?.init()

  const orgId = objectId()
  const anonymousId = objectId()

  if (!beaconServerConfig || !sessionManager) {
    throw new Error('beaconServerConfig or sessionManager is undefined')
  }

  const client = new FictionClient({ orgId, beaconUrl, anonymousId, intervalSeconds: 0.01 })

  afterAll(async () => {
    await testUtils.close()
  })

  it('should create a tracking event with correct data', () => {
    const event = client.createTrackingEvent({ event: 'testEvent' })
    expect(event).toMatchObject({ event: 'testEvent', orgId, anonymousId })
  })

  it('should transmit event data synchronously', async () => {
    const event = client.createTrackingEvent({ event: 'syncEvent' })
    const spy = vi.spyOn(client as any, 'transmitSync')
    client.event({ event: 'syncEvent' }, { sync: true })
    await waitFor(20) // events are buffered
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ events: [
      expect.objectContaining({
        ...event,
        context: expect.any(Object),
        messageId: expect.any(String),
        sentAt: expect.any(String),
      }),
    ] }))
  })

  it('should transmit event data asynchronously', async () => {
    const event = client.createTrackingEvent({ event: 'asyncEvent' })
    const spy = vi.spyOn(client as any, 'transmit')
    await client.event({ event: 'asyncEvent' }, { sync: false })
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ events: [
      expect.objectContaining({
        ...event,
        context: expect.any(Object),
        messageId: expect.any(String),
        sentAt: expect.any(String),
      }),
    ] }))
  })

  it('should identify a user', async () => {
    const traits: Partial<IdentifyTraitsUser> = {
      userId: 'userId123',
      name: 'John Doe',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      birthday: '1993-01-01',
      company: { name: 'Fiction', id: 'companyId123' },
      title: 'Software Engineer',
      username: 'johndoe',
      gender: 'male',
      lists: [{ id: 'listId123', status: 'active' }],
    }
    const spy = vi.spyOn(client, 'event')
    await client.identify('userId123', traits)
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      event: 'identify',
      type: 'identify',
      userId: 'userId123',
      traits,
    }), expect.any(Object))
  })

  it('should track a group', async () => {
    const traits: Partial<IdentifyTraitsUser> = {
      name: 'Test Group',
      id: 'groupId123',
      employees: 50,
      industry: 'Software',
    }
    const spy = vi.spyOn(client, 'event')
    await client.group('groupId123', traits)
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      event: 'group',
      type: 'group',
      groupId: 'groupId123',
      traits,
    }), expect.any(Object))
  })

  it('should track an event', async () => {
    const properties: Partial<TrackingProperties> = {
      category: 'testCategory',
      label: 'testLabel',
      action: 'testAction',
      value: 100,
    }
    const spy = vi.spyOn(client, 'event')
    await client.track('testEvent', properties)
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      type: 'track',
      event: 'testEvent',
      properties,
    }), expect.any(Object))
  })

  it('should log a page view event', async () => {
    const properties: Partial<TrackingProperties> = {
      title: 'testPage',
      url: 'http://example.com',
    }
    const spy = vi.spyOn(client, 'event')
    await client.page(properties)
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      type: 'page',
      event: 'view',
      properties,
    }), expect.any(Object))
  })

  it('should handle debug events', async () => {
    const message = 'debug message'
    const properties = { key: 'value' }
    const spy = vi.spyOn(client, 'track')
    await client.debug(message, properties)
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith('debug', expect.objectContaining({
      message,
      properties,
    }))
  })

  it('should call flushBuffer on unload', () => {
    const spy = vi.spyOn(client as any, 'flushBuffer')
    client.unload()
    expect(spy).toHaveBeenCalled()
  })
})
