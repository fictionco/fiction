import { describe, expect, it } from 'vitest'
import { dayjs } from '@fiction/core'
import { fillData } from '../utils'

const data = [
  {
    date: '',
    uniqueVisitors: '232',
    returningVisitors: '99',
    engageDuration: 15.7,
    sessionDuration: 15.9,
    bounceRate: 42.5,
    uniqueSessions: '285',
    totalViews: '548',
    averageViews: 1.9,
    totalEvents: '1601',
    averageEvents: 5.6,
    totalScrolls: '1260',
    averageScrolls: 4.421_052_631_578_948,
    averageScrollDepth: 77.131_428_571_428_56,
    totalClicks: '282',
    averageClicks: 1,
    totalTouches: '2122',
    averageTouches: 7.4,
    totalGoalConversions: '0',
    goalConversionRate: 0,
    totalConversions: '0',
    conversionRate: 0,
    averageRobot: 0,
    totalRobot: '0',
  },
  {
    date: '2022-08-08T00:00:00.000Z',
    uniqueVisitors: '137',
    returningVisitors: '51',
    engageDuration: 16,
    sessionDuration: 16.9,
    bounceRate: 40.9,
    uniqueSessions: '149',
    totalViews: '287',
    averageViews: 1.9,
    totalEvents: '850',
    averageEvents: 5.7,
    totalScrolls: '633',
    averageScrolls: 4.248_322_147_651_007,
    averageScrollDepth: 76.791_034_482_758_62,
    totalClicks: '151',
    averageClicks: 1,
    totalTouches: '1074',
    averageTouches: 7.2,
    totalGoalConversions: '0',
    goalConversionRate: 0,
    totalConversions: '0',
    conversionRate: 0,
    averageRobot: 0,
    totalRobot: '0',
  },
  {
    date: '2022-08-15T00:00:00.000Z',
    uniqueVisitors: '97',
    returningVisitors: '48',
    engageDuration: 15.5,
    sessionDuration: 14.8,
    bounceRate: 44.1,
    uniqueSessions: '136',
    totalViews: '261',
    averageViews: 1.9,
    totalEvents: '751',
    averageEvents: 5.5,
    totalScrolls: '627',
    averageScrolls: 4.610_294_117_647_059,
    averageScrollDepth: 77.497_037_037_037_02,
    totalClicks: '131',
    averageClicks: 1,
    totalTouches: '1048',
    averageTouches: 7.7,
    totalGoalConversions: '0',
    goalConversionRate: 0,
    totalConversions: '0',
    conversionRate: 0,
    averageRobot: 0,
    totalRobot: '0',
  },
]

describe('fills data', () => {
  it('handles week interval', () => {
    const timeStartAt = dayjs('2022-08-11T07:00:00.000Z')
    const timeEndAt = dayjs('2022-08-19T06:59:59.999Z')
    const result = fillData({
      timeStartAt,
      timeEndAt,
      timeZone: 'America/Los_Angeles',
      interval: 'week',
      data,
      withRollup: true,
    })

    expect(result.length).toEqual(3)

    expect(result.map(_ => _.uniqueVisitors)).toStrictEqual([
      '232',
      '137',
      '97',
    ])

    expect(result.map(_ => _.date)).toStrictEqual([
      '',
      '2022-08-08T00:00:00.000Z',
      '2022-08-15T00:00:00.000Z',
    ])
  })

  // it("handles minutes interval", () => {
  //   const timeStartAt = dayjs("2022-08-11T07:00:00.000Z")
  //   const timeEndAt = dayjs("2022-08-19T06:59:59.999Z")
  //   const result = fillData({
  //     timeStartAt,
  //     timeEndAt,
  //     timeZone: "America/Los_Angeles",
  //     interval: "week",
  //     data,
  //     withRollup: true,
  //   })
  // })
})
