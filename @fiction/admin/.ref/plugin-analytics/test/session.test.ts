/**
 * @vitest-environment jsdom
 * https://vitest.dev/config/#environment
 */

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import type {
  KaptionTestUtils,
} from '@kaption/core/test-utils'
import {
  createKaptionTestUtils,
} from '@kaption/core/test-utils'
import { objectId, safeDirname, waitFor } from '@factor/api'
import type { KaptionEvent } from '@kaption/client'
import { SessionManager } from '@kaption/core/plugin-beacon/session'
import { getGeo } from '@kaption/core/plugin-beacon/utils'
import type { SessionEvent } from '@kaption/core/plugin-beacon'
import { createKaptionEvents } from '@kaption/core/test-utils/analytics'

let testUtils: KaptionTestUtils
let events = [] as KaptionEvent[]

describe('session', () => {
  beforeAll(async () => {
    testUtils = await createKaptionTestUtils({
      initialize: true,
      cwd: safeDirname(import.meta.url),
      testId: 'session',
    })

    events = await createKaptionEvents(testUtils)
  })
  afterAll(async () => {
    testUtils.close()
  })

  it('gets geo data for events by IP', async () => {
    const r = await getGeo(`1.1.1.1`)

    expect(r).toBeTruthy()
    expect(r?.countryCode).toBeTruthy()
    expect(r?.cityName).toBeTruthy()
    expect(r?.latitude).toBeTruthy()
    expect(r?.longitude).toBeTruthy()
    expect(r).toMatchInlineSnapshot(`
      {
        "cityName": "Sydney",
        "countryCode": "AU",
        "ip": "1.1.1.1",
        "ipIsCrawler": false,
        "ipIsProxy": false,
        "ipOrganization": undefined,
        "ipThreatLevel": "low",
        "latitude": -33.8688,
        "longitude": 151.209,
        "regionName": "New South Wales",
        "timezone": "Australia/Sydney",
      }
    `)
  })

  it('get standard fields for session', async () => {
    const sessionManager = new SessionManager({
      ...testUtils,
      bufferIntervalMs: 100,
      sessionExpireAfterMs: 3000,
      checkExpiredIntervalMs: 300,
    })
    const sessionId = objectId()
    const initialSession = await sessionManager.createSession(events, sessionId)

    if (!initialSession)
      throw new Error('no session')

    expect(initialSession.anonymousId).toBeTruthy()
    expect(initialSession.sessionId).toBe(sessionId)
    expect(initialSession.referralSource).toBe('testSource')
    expect(initialSession.isReturning).toBe(0)
    expect(initialSession.viewNo).toBe(3)
    expect(initialSession.eventNo).toBe(3)
    expect(initialSession.deviceType).toBe('laptop')
    expect(initialSession.referrer).toBe('https://www.twitter.com')

    expect(Object.keys(initialSession)).toMatchInlineSnapshot(`
      [
        "isOpened",
        "anonymousId",
        "sessionId",
        "projectId",
        "organizationId",
        "timestamp",
        "origin",
        "locale",
        "referrer",
        "os",
        "browser",
        "deviceType",
        "timezone",
        "ip",
        "countryCode",
        "regionName",
        "cityName",
        "latitude",
        "longitude",
        "ipIsCrawler",
        "ipIsProxy",
        "ipThreatLevel",
        "ipOrganization",
        "referralSource",
        "referralCampaign",
        "referralMedium",
        "referralTerm",
        "referralContent",
        "referralTitle",
        "referralDescription",
        "referralImage",
        "referralCanonicalUrl",
        "version",
        "entryPage",
        "exitPage",
        "startedAt",
        "endedAt",
        "viewNo",
        "eventNo",
        "isReturning",
        "sessionNo",
        "isFake",
        "duration",
      ]
    `)

    const spySaveEvents = vi.spyOn(sessionManager, 'getSaveEvents')

    const saveEvents = await sessionManager.processRawEvents(events)

    sessionManager.saveBuffer.batch(saveEvents)

    await waitFor(800)

    expect(spySaveEvents).toHaveBeenCalled()
    const ch = testUtils.kaptionClickHouse

    const anonymousId = events[0].anonymousId
    const query = `SELECT event FROM ${ch.tableEvents} WHERE anonymousId='${anonymousId}' FORMAT JSON`

    const r = await ch.clickHouseQuery<SessionEvent[]>({ query })

    expect(r?.data).toMatchInlineSnapshot(`
      [
        {
          "event": "init",
        },
        {
          "event": "view",
        },
        {
          "event": "view",
        },
      ]
    `)
  })

  it('saves data to clickhouse ', async () => {})
})
