/**
 * @vitest-environment jsdom
 * https://vitest.dev/config/#environment
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type {
  KaptionTestUtils,
} from '@kaption/core/test-utils'
import {
  createKaptionTestUtils,
} from '@kaption/core/test-utils'
import { objectId, safeDirname } from '@factor/api'
import type { KaptionEvent } from '@kaption/client'
import { SessionManager } from '@kaption/core/plugin-beacon/session'
import { createKaptionEvents } from '@kaption/core/test-utils/analytics'

let testUtils: KaptionTestUtils
let events = [] as KaptionEvent[]

describe('session', () => {
  beforeAll(async () => {
    testUtils = await createKaptionTestUtils({
      initialize: true,
      cwd: safeDirname(import.meta.url),
      testId: 'notifyFlow',
    })

    events = await createKaptionEvents(testUtils)
  })
  afterAll(async () => {
    testUtils.close()
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

    const saveEvents = await sessionManager.processRawEvents(events)

    expect(saveEvents).toMatchInlineSnapshot(`
      [
        {
          "anonymousId": "63048d4709989a2742f86ae8",
          "browser": "WebKit",
          "cityName": "Irvine",
          "context": "{\\"ip\\":\\"::ffff:4465:77c8\\",\\"rawIp\\":\\"68.101.119.200\\",\\"userAgent\\":\\"Mozilla/5.0 (darwin) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/20.0.0\\",\\"screen\\":{\\"width\\":1024,\\"height\\":768},\\"locale\\":\\"en-us\\",\\"timezone\\":\\"America/Los_Angeles\\",\\"page\\":{\\"title\\":\\"Test Title\\",\\"referrer\\":\\"https://www.twitter.com/\\",\\"url\\":\\"https://localhost:10000/thepathname?q=example&utm_campaign=testCampaign&utm_medium=testMedium&utm_source=testSource\\"},\\"isFake\\":false,\\"library\\":{\\"name\\":\\"client\\",\\"version\\":\\"5.0.70\\"}}",
          "countryCode": "US",
          "debug": "{}",
          "deviceType": "laptop",
          "endedAt": 1661242696,
          "event": "custom",
          "eventId": "63048d48b6b79868f7e9efc2",
          "eventNo": 1,
          "gen": "user",
          "ip": "68.101.119.200",
          "isCore": 0,
          "isCustom": 1,
          "isFake": 0,
          "isInternal": 0,
          "isReturning": 0,
          "label": "test",
          "latitude": 33.6846,
          "locale": "en-us",
          "longitude": -117.827,
          "messageId": "63048d487324b187583853ac",
          "meta": "{}",
          "organizationId": "or63048d47001d431b3a3eaf2f",
          "origin": "https://localhost:10000",
          "pathname": "/thepathname",
          "projectId": "pr63048d47fbcf481b3a010798",
          "receivedAt": 1661242696,
          "referralCampaign": "testCampaign",
          "referralCanonicalUrl": "https://twitter.com/",
          "referralMedium": "testMedium",
          "referralSource": "testSource",
          "referrer": "https://www.twitter.com",
          "regionName": "California",
          "search": "?q=example&utm_campaign=testCampaign&utm_medium=testMedium&utm_source=testSource",
          "sentAt": 1661242696,
          "sessionId": "63048d485b43c6b4a5956714",
          "sessionNo": 1,
          "startedAt": 1661242696,
          "timestamp": 1661242696,
          "timezone": "America/Los_Angeles",
          "traits": "{}",
          "url": "https://localhost:10000/thepathname?q=example&utm_campaign=testCampaign&utm_medium=testMedium&utm_source=testSource",
          "version": "5.0.70",
          "viewNo": 1,
        },
        {
          "anonymousId": "63048d4709989a2742f86ae8",
          "browser": "WebKit",
          "cityName": "Irvine",
          "context": "{\\"ip\\":\\"::ffff:4465:77c8\\",\\"rawIp\\":\\"68.101.119.200\\",\\"userAgent\\":\\"Mozilla/5.0 (darwin) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/20.0.0\\",\\"screen\\":{\\"width\\":1024,\\"height\\":768},\\"locale\\":\\"en-us\\",\\"timezone\\":\\"America/Los_Angeles\\",\\"page\\":{\\"title\\":\\"Test Title\\",\\"referrer\\":\\"https://www.twitter.com/\\",\\"url\\":\\"https://localhost:10000/thepathname?q=example&utm_campaign=testCampaign&utm_medium=testMedium&utm_source=testSource\\"},\\"isFake\\":false,\\"library\\":{\\"name\\":\\"client\\",\\"version\\":\\"5.0.70\\"}}",
          "countryCode": "US",
          "debug": "{}",
          "deviceType": "laptop",
          "endedAt": 1661242696,
          "event": "identify",
          "eventId": "63048d48433180c1059c0581",
          "eventNo": 2,
          "gen": "user",
          "ip": "68.101.119.200",
          "isCore": 0,
          "isCustom": 1,
          "isFake": 0,
          "isInternal": 0,
          "isReturning": 0,
          "latitude": 33.6846,
          "locale": "en-us",
          "longitude": -117.827,
          "messageId": "63048d4840f59a913d6e7adc",
          "meta": "{}",
          "organizationId": "or63048d47001d431b3a3eaf2f",
          "origin": "https://localhost:10000",
          "pathname": "/thepathname",
          "projectId": "pr63048d47fbcf481b3a010798",
          "receivedAt": 1661242696,
          "referralCampaign": "testCampaign",
          "referralCanonicalUrl": "https://twitter.com/",
          "referralMedium": "testMedium",
          "referralSource": "testSource",
          "referrer": "https://www.twitter.com",
          "regionName": "California",
          "search": "?q=example&utm_campaign=testCampaign&utm_medium=testMedium&utm_source=testSource",
          "sentAt": 1661242696,
          "sessionId": "63048d485b43c6b4a5956714",
          "sessionNo": 1,
          "startedAt": 1661242696,
          "timestamp": 1661242696,
          "timezone": "America/Los_Angeles",
          "traits": "{\\"email\\":\\"em@ail.com\\"}",
          "type": "identify",
          "url": "https://localhost:10000/thepathname?q=example&utm_campaign=testCampaign&utm_medium=testMedium&utm_source=testSource",
          "version": "5.0.70",
          "viewNo": 1,
        },
        {
          "anonymousId": "63048d4709989a2742f86ae8",
          "browser": "WebKit",
          "cityName": "Irvine",
          "context": "{\\"ip\\":\\"::ffff:4465:77c8\\",\\"rawIp\\":\\"68.101.119.200\\",\\"userAgent\\":\\"Mozilla/5.0 (darwin) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/20.0.0\\",\\"screen\\":{\\"width\\":1024,\\"height\\":768},\\"locale\\":\\"en-us\\",\\"timezone\\":\\"America/Los_Angeles\\",\\"page\\":{\\"title\\":\\"Test Title\\",\\"referrer\\":\\"https://www.twitter.com/\\",\\"url\\":\\"https://localhost:10000/thepathname?q=example&utm_campaign=testCampaign&utm_medium=testMedium&utm_source=testSource\\"},\\"isFake\\":false,\\"library\\":{\\"name\\":\\"client\\",\\"version\\":\\"5.0.70\\"}}",
          "countryCode": "US",
          "debug": "{}",
          "deviceType": "laptop",
          "endedAt": 1661242696,
          "event": "view",
          "eventId": "63048d48e63ef62894adfe39",
          "eventNo": 3,
          "gen": "user",
          "ip": "68.101.119.200",
          "isCore": 0,
          "isCustom": 1,
          "isFake": 0,
          "isInternal": 0,
          "isReturning": 0,
          "latitude": 33.6846,
          "locale": "en-us",
          "longitude": -117.827,
          "messageId": "63048d48816da770b0d504bf",
          "meta": "{}",
          "organizationId": "or63048d47001d431b3a3eaf2f",
          "origin": "https://localhost:10000",
          "pathname": "/thepathname",
          "projectId": "pr63048d47fbcf481b3a010798",
          "receivedAt": 1661242696,
          "referralCampaign": "testCampaign",
          "referralCanonicalUrl": "https://twitter.com/",
          "referralMedium": "testMedium",
          "referralSource": "testSource",
          "referrer": "https://www.twitter.com",
          "regionName": "California",
          "search": "?q=example&utm_campaign=testCampaign&utm_medium=testMedium&utm_source=testSource",
          "sentAt": 1661242696,
          "sessionId": "63048d485b43c6b4a5956714",
          "sessionNo": 1,
          "startedAt": 1661242696,
          "timestamp": 1661242696,
          "timezone": "America/Los_Angeles",
          "traits": "{}",
          "type": "track",
          "url": "https://localhost:10000/thepathname?q=example&utm_campaign=testCampaign&utm_medium=testMedium&utm_source=testSource",
          "version": "5.0.70",
          "viewNo": 2,
        },
        {
          "anonymousId": "63048d4709989a2742f86ae8",
          "browser": "WebKit",
          "cityName": "Irvine",
          "context": "{\\"ip\\":\\"::ffff:4465:77c8\\",\\"rawIp\\":\\"68.101.119.200\\",\\"userAgent\\":\\"Mozilla/5.0 (darwin) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/20.0.0\\",\\"screen\\":{\\"width\\":1024,\\"height\\":768},\\"locale\\":\\"en-us\\",\\"timezone\\":\\"America/Los_Angeles\\",\\"page\\":{\\"title\\":\\"Test Title\\",\\"referrer\\":\\"https://www.twitter.com/\\",\\"url\\":\\"https://localhost:10000/thepathname?q=example&utm_campaign=testCampaign&utm_medium=testMedium&utm_source=testSource\\"},\\"isFake\\":false,\\"library\\":{\\"name\\":\\"client\\",\\"version\\":\\"5.0.70\\"}}",
          "countryCode": "US",
          "debug": "{}",
          "deviceType": "laptop",
          "endedAt": 1661242696,
          "event": "init",
          "eventId": "63048d483a077607125b6827",
          "eventNo": 4,
          "gen": "core",
          "ip": "68.101.119.200",
          "isCore": 1,
          "isCustom": 0,
          "isFake": 0,
          "isInternal": 0,
          "isReturning": 0,
          "latitude": 33.6846,
          "locale": "en-us",
          "longitude": -117.827,
          "messageId": "63048d48f322be157ea63c48",
          "meta": "{}",
          "organizationId": "or63048d47001d431b3a3eaf2f",
          "origin": "https://localhost:10000",
          "pathname": "/thepathname",
          "projectId": "pr63048d47fbcf481b3a010798",
          "receivedAt": 1661242696,
          "referralCampaign": "testCampaign",
          "referralCanonicalUrl": "https://twitter.com/",
          "referralMedium": "testMedium",
          "referralSource": "testSource",
          "referrer": "https://www.twitter.com",
          "regionName": "California",
          "search": "?q=example&utm_campaign=testCampaign&utm_medium=testMedium&utm_source=testSource",
          "sentAt": 1661242696,
          "sessionId": "63048d485b43c6b4a5956714",
          "sessionNo": 1,
          "startedAt": 1661242696,
          "timestamp": 1661242696,
          "timezone": "America/Los_Angeles",
          "traits": "{}",
          "type": "internal",
          "url": "https://localhost:10000/thepathname?q=example&utm_campaign=testCampaign&utm_medium=testMedium&utm_source=testSource",
          "version": "5.0.70",
          "viewNo": 2,
        },
      ]
    `)
  })
})
