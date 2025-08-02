import type { SessionParams } from '../plugin-beacon/index.js'

import { dayjs } from '@fiction/core'
import { snap } from '@fiction/core/test-utils'
import { describe, expect, it } from 'vitest'
import { getSessionQuerySelectors } from '../tables.js'
import { createAnalyticsTestUtils, testSaveAnalyticsEvents } from './helpers.js'

describe('standard tables', async () => {
  const testUtils = await createAnalyticsTestUtils()
  const initialized = await testUtils.start()
  const fictionClient = initialized.fictionClient
  it('creates sub query', () => {
    const sel = getSessionQuerySelectors()

    expect(sel).toMatchInlineSnapshot(`
      [
        "sum(value) as session__value",
        "sessionId as session__sessionId",
        "anyIf(orgId, event='init') as session__orgId",
        "any(anonymousId) as session__anonymousId",
        "anyIf(userId, event='session') as session__userId",
        "anyIf(email, event='session') as session__email",
        "min(timestamp) as session__timestamp",
        "min(timeAt) as session__timeAt",
        "anyIf(startedAt, event='session') as session__startedAt",
        "anyIf(endedAt, event='session') as session__endedAt",
        "anyIf(duration, event='session') as session__duration",
        "anyIf(os, event='init') as session__os",
        "anyIf(browser, event='init') as session__browser",
        "anyIf(deviceType, event='init') as session__deviceType",
        "anyIf(locale, event='init') as session__locale",
        "anyIf(ip, event='init') as session__ip",
        "anyIf(timezone, event='init') as session__timezone",
        "anyIf(version, event='init') as session__version",
        "anyIf(entryPage, event='session') as session__entryPage",
        "anyIf(exitPage, event='session') as session__exitPage",
        "anyIf(isReturning, event='init') as session__isReturning",
        "anyIf(isFake, event='init') as session__isFake",
        "sum(scrollTotal) as session__scrollTotal",
        "sum(keypressTotal) as session__keypressTotal",
        "sum(clickTotal) as session__clickTotal",
        "sum(touchTotal) as session__touchTotal",
        "sum(moveTotal) as session__moveTotal",
        "sum(engageDuration) as session__engageDuration",
        "sum(replayDuration) as session__replayDuration",
        "avgIf(scrollDepth, event='view' AND isFinite(scrollDepth)) as session__scrollDepth",
        "toUInt16(anyIf(sessionNo, event='init')) as session__sessionNo",
        "anyIf(countryCode, event='init') as session__countryCode",
        "anyIf(regionName, event='init') as session__regionName",
        "anyIf(cityName, event='init') as session__cityName",
        "anyIf(latitude, event='init') as session__latitude",
        "anyIf(longitude, event='init') as session__longitude",
        "anyIf(referrer, event='init') as session__referrer",
        "anyIf(referralSource, event='init') as session__referralSource",
        "anyIf(referralMedium, event='init') as session__referralMedium",
        "anyIf(referralCampaign, event='init') as session__referralCampaign",
        "anyIf(referralTerm, event='init') as session__referralTerm",
        "anyIf(referralContent, event='init') as session__referralContent",
        "anyIf(referralTitle, event='init') as session__referralTitle",
        "anyIf(referralDescription, event='init') as session__referralDescription",
        "anyIf(referralCanonicalUrl, event='init') as session__referralCanonicalUrl",
        "anyIf(referralImage, event='init') as session__referralImage",
        "toInt16(countIf(event='view')) as session__pageCount",
        "toInt16(count(*)) as session__totalEvents",
        "toInt16(uniq(eventId)) as session__eventCount",
        "if(countIf(event='session') > 0, 1, 0) as session__isClosed",
        "if(session__pageCount > 1, 0, 1) as session__isBounce",
        "if(countIf(event='bot') > 0, 1, 0) as session__isRobot",
        "if(countIf(event='replay') > 0, 1, 0) as session__hasReplay",
        "countIf(conversion='goal') as session__totalGoalConversion",
        "countIf(conversion='conversion') as session__totalConversion",
        "if(session__totalGoalConversion > 0, 1, 0) as session__hasGoalConversion",
        "if(session__totalConversion > 0, 1, 0) as session__hasConversion",
      ]
    `)
  })

  it('runs correctly with subquery', async () => {
    const { fictionAnalytics } = testUtils

    const fictionClickhouse = fictionAnalytics.fictionClickhouse

    if (!fictionClickhouse)
      throw new Error('no clickhouse')

    await testSaveAnalyticsEvents(testUtils, fictionClient)

    const cli = fictionClickhouse.client()

    const base = cli.from(fictionClickhouse.tableEvents)

    const query = fictionClickhouse
      .sessionTable({ base })
      .orderBy('session__endedAt', 'desc')
      .whereRaw(
        `toYYYYMMDDhhmmss(session__timestamp) > ${fictionClickhouse.formatTime(
          dayjs().subtract(8, 'hour'),
        )} `,
      )
      .andWhereRaw(`session__anonymousId = '${testUtils.anonymousId}'`)
      .limit(1)

    const { data } = await fictionClickhouse.clickHouseSelect<SessionParams>(query, { caller: 'tablesTest' })

    expect(data.length).toBeGreaterThan(0)

    const sample = fictionClickhouse.cleanPrefixes(data).pop()

    expect(snap(sample)).toMatchInlineSnapshot(`
      {
        "anonymousId": "[id:TRUTHY]",
        "browser": "Chrome",
        "cityName": "[name:FALSY]",
        "clickTotal": "0",
        "countryCode": "",
        "deviceType": "unknown",
        "duration": "[datetime:TRUTHY]",
        "email": "[email:FALSY]",
        "endedAt": "[datetime:TRUTHY]",
        "engageDuration": "0",
        "entryPage": "",
        "eventCount": "6",
        "exitPage": "",
        "hasConversion": "0",
        "hasGoalConversion": "0",
        "hasReplay": "0",
        "ip": "[geo:TRUTHY]",
        "isBounce": "0",
        "isClosed": "1",
        "isFake": "0",
        "isReturning": "0",
        "isRobot": "0",
        "keypressTotal": "0",
        "latitude": "[geo:TRUTHY]",
        "locale": "",
        "longitude": "[geo:TRUTHY]",
        "moveTotal": "0",
        "orgId": "[id:TRUTHY]",
        "os": "macOS",
        "pageCount": "2",
        "referralCampaign": "",
        "referralCanonicalUrl": "[url:FALSY]",
        "referralContent": "",
        "referralDescription": "",
        "referralImage": "",
        "referralMedium": "",
        "referralSource": "",
        "referralTerm": "",
        "referralTitle": "",
        "referrer": "",
        "regionName": "[name:FALSY]",
        "replayDuration": "0",
        "scrollDepth": "0",
        "scrollTotal": "0",
        "sessionId": "[id:TRUTHY]",
        "sessionNo": "1",
        "startedAt": "[datetime:TRUTHY]",
        "timeAt": "[datetime:TRUTHY]",
        "timestamp": "[datetime:TRUTHY]",
        "timezone": "",
        "totalConversion": "0",
        "totalEvents": "6",
        "totalGoalConversion": "0",
        "touchTotal": "0",
        "userId": "[id:FALSY]",
        "value": "0",
        "version": "unknown",
      }
    `)

    expect(+(sample?.eventCount || 0)).toBeGreaterThan(0)
    expect(sample?.orgId).toBeTruthy()
    expect(sample?.deviceType).toBeTruthy()
  })
})
