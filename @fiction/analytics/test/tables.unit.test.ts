import type { SessionParams } from '../plugin-beacon/index.js'
import { dayjs } from '@fiction/core'

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
        "anyIf(sessionNo, event='init') as session__sessionNo",
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
        "countIf(event='view') as session__pageCount",
        "count(*) as session__totalEvents",
        "uniq(eventId) as session__eventCount",
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

    const sample = data[0]

    expect(Object.keys(sample)).toMatchInlineSnapshot(`
      [
        "session__value",
        "session__sessionId",
        "session__orgId",
        "session__anonymousId",
        "session__userId",
        "session__email",
        "session__timestamp",
        "session__timeAt",
        "session__startedAt",
        "session__endedAt",
        "session__duration",
        "session__os",
        "session__browser",
        "session__deviceType",
        "session__locale",
        "session__ip",
        "session__timezone",
        "session__version",
        "session__entryPage",
        "session__exitPage",
        "session__isReturning",
        "session__isFake",
        "session__scrollTotal",
        "session__keypressTotal",
        "session__clickTotal",
        "session__touchTotal",
        "session__moveTotal",
        "session__engageDuration",
        "session__replayDuration",
        "session__scrollDepth",
        "session__sessionNo",
        "session__countryCode",
        "session__regionName",
        "session__cityName",
        "session__latitude",
        "session__longitude",
        "session__referrer",
        "session__referralSource",
        "session__referralMedium",
        "session__referralCampaign",
        "session__referralTerm",
        "session__referralContent",
        "session__referralTitle",
        "session__referralDescription",
        "session__referralCanonicalUrl",
        "session__referralImage",
        "session__pageCount",
        "session__totalEvents",
        "session__eventCount",
        "session__isClosed",
        "session__isBounce",
        "session__isRobot",
        "session__hasReplay",
        "session__totalGoalConversion",
        "session__totalConversion",
        "session__hasGoalConversion",
        "session__hasConversion",
      ]
    `)

    expect(+(sample.eventCount || 0)).toBeGreaterThan(0)
    expect(sample.orgId).toBeTruthy()
    expect(sample.deviceType).toBeTruthy()
  })
})
