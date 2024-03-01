/**
 * @vitest-environment jsdom
 * https://vitest.dev/config/#environment
 */

import { beforeAll, describe, expect, it } from 'vitest'
import type {
  KaptionTestUtils,
} from '@kaption/core/test-utils'
import {
  createKaptionTestUtils,
} from '@kaption/core/test-utils'
import { refineParams } from '../params'

let testUtils!: KaptionTestUtils

describe('dashboard engine', () => {
  beforeAll(async () => {
    testUtils = await createKaptionTestUtils()
    testUtils.initialized = await testUtils.init()
  })

  it('fills data points correctly', async () => {
    const params = refineParams({
      interval: 'day',
      timeEndAtIso: '2022-07-14T06:00:00.000Z',
      timeStartAtIso: '2022-07-06T07:00:00.000Z',
      timeZone: 'America/New_York',
      projectId: 'example',
      mode: 'realtime',
      compare: 'period',
      filters: [],
      page: 1,
      noCache: true,
      queryHandlerKey: 'activeConversions',
      isRealtime: true,
      period: 'hour',
    })
    expect(params.interval).toBe('minute')
    expect(params.timeEndAt.diff(params.timeStartAt, 'minute')).toBe(60)
    expect(params.timeZone).toBe('America/New_York')

    const params2 = refineParams({
      interval: 'day',
      timeEndAtIso: '2022-07-14T06:59:59.999Z',
      timeStartAtIso: '2022-07-06T07:00:00.000Z',
      timeZone: 'America/New_York',
      projectId: 'example',
      mode: 'realtime',
      compare: 'period',
      filters: [],
      page: 1,
      noCache: true,
      queryHandlerKey: 'activeConversions',
      isRealtime: true,
      period: 'today',
    })

    expect(params2.interval).toBe('hour')
    expect(params2.timeEndAt.diff(params2.timeStartAt, 'hour')).toBe(24)
    expect(params2.timeZone).toBe('America/New_York')

    expect(Object.keys(params2)).toMatchInlineSnapshot(`
      [
        "interval",
        "timeEndAtIso",
        "timeStartAtIso",
        "timeZone",
        "projectId",
        "mode",
        "compare",
        "filters",
        "page",
        "noCache",
        "queryHandlerKey",
        "isRealtime",
        "period",
        "compareEndAt",
        "compareStartAt",
        "timeEndAt",
        "timeStartAt",
      ]
    `)
  })
})
