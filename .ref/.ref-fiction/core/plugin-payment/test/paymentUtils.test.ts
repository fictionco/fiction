/**
 * @vitest-environment happy-dom
 * https://vitest.dev/config/#environment
 */

import { beforeAll, describe, expect, it } from 'vitest'
import { dayjs } from '@factor/api'
import { getCycleRange } from '../utils'

describe('cookie', () => {
  beforeAll(async () => {})
  it('gets correct start and end day', () => {
    const now = dayjs('2023-02-10').utc()

    const timestamp = dayjs('2023-01-02')
      .utc()
      .set('date', 30)
      .set('hour', 11)
      .set('minute', 12)

    const result1 = getCycleRange({ timestamp: timestamp.unix(), now })

    expect(result1).toMatchInlineSnapshot(`
      {
        "anchorDateUtc": 30,
        "timeEnd": "2023-02-28T03:00:00.000Z",
        "timeStart": "2023-01-30T03:00:00.000Z",
      }
    `)

    const timestamp2 = timestamp.clone().set('date', 2)

    const result2 = getCycleRange({ timestamp: timestamp2.unix(), now })

    expect(result2).toMatchInlineSnapshot(`
      {
        "anchorDateUtc": 2,
        "timeEnd": "2023-02-02T03:00:00.000Z",
        "timeStart": "2023-01-02T03:00:00.000Z",
      }
    `)
  })
})
