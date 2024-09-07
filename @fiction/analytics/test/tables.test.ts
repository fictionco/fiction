import { dayjs } from '@fiction/core'
import { describe, expect, it } from 'vitest'

import { getSessionQuerySelectors } from '../tables.js'
import { createAnalyticsTestUtils, saveFictionEvents } from './helpers.js'
import type { SessionParams } from '../plugin-beacon/index.js'

describe('standard tables', async () => {
  const testUtils = await createAnalyticsTestUtils()
  const initialized = await testUtils.start()
  const fictionClient = initialized.fictionClient
  it('creates sub query', () => {
    const sel = getSessionQuerySelectors()

    expect(sel).toMatchInlineSnapshot(`
      [
        "sessionId as session_sessionId",
        "any(anonymousId) as session_anonymousId",
        "anyIf(userId, event='session') as session_userId",
        "anyIf(projectId, event='init') as session_projectId",
        "anyIf(organizationId, event='init') as session_organizationId",
        "min(timestamp) as session_timestamp",
        "sum(value) as session_value",
        "anyIf(os, event='init') as session_os",
        "anyIf(browser, event='init') as session_browser",
        "anyIf(deviceType, event='init') as session_deviceType",
        "anyIf(locale, event='init') as session_locale",
        "anyIf(ip, event='init') as session_ip",
        "anyIf(isReturning, event='init') as session_isReturning",
        "anyIf(isFake, event='init') as session_isFake",
        "anyIf(timezone, event='init') as session_timezone",
        "anyIf(duration, event='session') as session_duration",
        "anyIf(startedAt, event='session') as session_startedAt",
        "anyIf(endedAt, event='session') as session_endedAt",
        "anyIf(entryPage, event='session') as session_entryPage",
        "anyIf(exitPage, event='session') as session_exitPage",
        "sum(scrollTotal) as session_scrollTotal",
        "sum(keypressTotal) as session_keypressTotal",
        "sum(clickTotal) as session_clickTotal",
        "sum(touchTotal) as session_touchTotal",
        "sum(moveTotal) as session_moveTotal",
        "sum(engageDuration) as session_engageDuration",
        "sum(replayDuration) as session_replayDuration",
        "avgIf(scrollDepth, event='view' AND isFinite(scrollDepth)) as session_scrollDepth",
        "anyIf(sessionNo, event='init') as session_sessionNo",
        "anyIf(version, event='init') as session_version",
        "anyIf(countryCode, event='init') as session_countryCode",
        "anyIf(regionName, event='init') as session_regionName",
        "anyIf(cityName, event='init') as session_cityName",
        "anyIf(latitude, event='init') as session_latitude",
        "anyIf(longitude, event='init') as session_longitude",
        "anyIf(referrer, event='init') as session_referrer",
        "anyIf(referralSource, event='init') as session_referralSource",
        "anyIf(referralCampaign, event='init') as session_referralCampaign",
        "anyIf(referralMedium, event='init') as session_referralMedium",
        "anyIf(referralTerm, event='init') as session_referralTerm",
        "anyIf(referralContent, event='init') as session_referralContent",
        "anyIf(referralTitle, event='init') as session_referralTitle",
        "anyIf(referralDescription, event='init') as session_referralDescription",
        "anyIf(referralCanonicalUrl, event='init') as session_referralCanonicalUrl",
        "anyIf(referralImage, event='init') as session_referralImage",
        "countIf(event='view') as session_pageCount",
        "if(countIf(event='session') > 0, 1, 0) as session_isClosed",
        "if(session_pageCount > 1, 0, 1) as session_isBounce",
        "count(*) as session_totalEvents",
        "if(countIf(event='bot') > 0, 1, 0) as session_isRobot",
        "if(countIf(event='replay') > 0, 1, 0) as session_hasReplay",
        "countIf(conversion='goal') as session_totalGoalConversion",
        "countIf(conversion='conversion') as session_totalConversion",
        "if(session_totalGoalConversion > 0, 1, 0) as session_hasGoalConversion",
        "if(session_totalConversion > 0, 1, 0) as session_hasConversion",
        "uniq(eventId) as session_eventCount",
      ]
    `)
  })

  it('runs correctly with subquery', async () => {
    const { fictionAnalytics } = testUtils

    const fictionClickhouse = fictionAnalytics.fictionClickhouse

    if (!fictionClickhouse)
      throw new Error('no clickhouse')

    await saveFictionEvents(testUtils, fictionClient)

    const cli = fictionClickhouse.client()

    const base = cli.from(fictionClickhouse.tableEvents)

    const query = fictionClickhouse
      .sessionTable({ base })
      .orderBy('session_endedAt', 'desc')
      .whereRaw(
        `toYYYYMMDDhhmmss(session_timestamp) > ${fictionClickhouse.formatTime(
          dayjs().subtract(8, 'hour'),
        )} `,
      )
      .andWhereRaw(`session_anonymousId = '${testUtils.anonymousId}'`)
      .limit(1)

    const { data } = await fictionClickhouse.clickHouseSelect<SessionParams[]>(query)

    expect(data.length).toBeGreaterThan(0)

    const sample = data[0]

    expect(Object.keys(sample)).toMatchInlineSnapshot(`
      [
        "sessionId",
        "anonymousId",
        "userId",
        "projectId",
        "organizationId",
        "timestamp",
        "value",
        "os",
        "browser",
        "deviceType",
        "locale",
        "ip",
        "isReturning",
        "isFake",
        "timezone",
        "duration",
        "startedAt",
        "endedAt",
        "entryPage",
        "exitPage",
        "scrollTotal",
        "keypressTotal",
        "clickTotal",
        "touchTotal",
        "moveTotal",
        "engageDuration",
        "replayDuration",
        "scrollDepth",
        "sessionNo",
        "version",
        "countryCode",
        "regionName",
        "cityName",
        "latitude",
        "longitude",
        "referrer",
        "referralSource",
        "referralCampaign",
        "referralMedium",
        "referralTerm",
        "referralContent",
        "referralTitle",
        "referralDescription",
        "referralCanonicalUrl",
        "referralImage",
        "pageCount",
        "isClosed",
        "isBounce",
        "totalEvents",
        "isRobot",
        "hasReplay",
        "totalGoalConversion",
        "totalConversion",
        "hasGoalConversion",
        "hasConversion",
        "eventCount",
      ]
    `)

    expect(+(sample.eventCount || 0)).toBeGreaterThan(0)
    expect(sample.orgId).toBeTruthy()
    expect(sample.deviceType).toBeTruthy()
  })
})
