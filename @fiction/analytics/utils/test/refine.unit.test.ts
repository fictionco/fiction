import type { DataCompared, DataPointChart, QueryParams, QueryParamsRefined, TimeLineInterval } from '@fiction/analytics'
import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { refineComparedData, refineParams, refineTimelineData } from '../refine'

describe('refineComparedData', () => {
  const baseParams: QueryParamsRefined = {
    timeZone: 'UTC',
    nowIso: '2024-06-05T00:00:00.000Z',
    timeStartAtIso: '2024-06-01T00:00:00.000Z',
    timeEndAtIso: '2024-06-05T00:00:00.000Z',
    compareStartAtIso: '2024-05-25T00:00:00.000Z',
    compareEndAtIso: '2024-05-29T00:00:00.000Z',
    interval: 'day',
  }

  it('handles snapshot metrics properly in both main and compare periods', () => {
    const data: DataCompared<DataPointChart> = {
      main: [
        { date: '2024-06-01T00:00:00.000Z', followers: 100 },
        { date: '2024-06-03T00:00:00.000Z', followers: 150 },
      ],
      compare: [
        { date: '2024-05-25T00:00:00.000Z', followers: 50 },
        { date: '2024-05-27T00:00:00.000Z', followers: 75 },
      ],
      params: baseParams,
    }

    const result = refineComparedData({
      data,
      snapshotKeys: ['followers'],
    })

    // Main period should carry forward values
    expect(result.main?.map(d => ({ date: dayjs(d.date).utc().format('MM-DD'), value: d.followers }))).toEqual([
      { date: '06-01', value: 100 }, // Initial value
      { date: '06-02', value: 100 }, // Carried forward
      { date: '06-03', value: 150 }, // New value
      { date: '06-04', value: 150 }, // Carried forward
      { date: '06-05', value: 150 }, // Carried forward
    ])

    // Compare period should also carry forward values
    expect(result.compare?.map(d => ({ date: dayjs(d.date).utc().format('MM-DD'), value: d.followers }))).toEqual([
      { date: '05-25', value: 50 }, // Initial value
      { date: '05-26', value: 50 }, // Carried forward
      { date: '05-27', value: 75 }, // New value
      { date: '05-28', value: 75 }, // Carried forward
      { date: '05-29', value: 75 }, // Carried forward
    ])
  })

  it('handles mixed snapshot and increment metrics', () => {
    const data: DataCompared<DataPointChart> = {
      main: [
        { date: '2024-06-01T00:00:00.000Z', followers: 100, views: 50 },
        { date: '2024-06-03T00:00:00.000Z', followers: 150, views: 30 },
      ],
      compare: [
        { date: '2024-05-25T00:00:00.000Z', followers: 50, views: 20 },
        { date: '2024-05-27T00:00:00.000Z', followers: 75, views: 40 },
      ],
      params: baseParams,
    }

    const result = refineComparedData({
      data,
      snapshotKeys: ['followers'], // Only followers should carry forward
    })

    const mainPoints = result.main?.map(d => ({
      date: dayjs(d.date).utc().format('MM-DD'),
      followers: d.followers,
      views: d.views,
    }))

    expect(mainPoints).toMatchInlineSnapshot(`
      [
        {
          "date": "06-01",
          "followers": 100,
          "views": 50,
        },
        {
          "date": "06-02",
          "followers": 100,
          "views": 0,
        },
        {
          "date": "06-03",
          "followers": 150,
          "views": 30,
        },
        {
          "date": "06-04",
          "followers": 150,
          "views": 0,
        },
        {
          "date": "06-05",
          "followers": 150,
          "views": 0,
        },
      ]
    `)

    // Verify followers (snapshot) carries forward but views (increment) resets
    expect(mainPoints).toEqual([
      { date: '06-01', followers: 100, views: 50 }, // Initial values
      { date: '06-02', followers: 100, views: 0 }, // Followers carried, views reset
      { date: '06-03', followers: 150, views: 30 }, // New values
      { date: '06-04', followers: 150, views: 0 }, // Followers carried, views reset
      { date: '06-05', followers: 150, views: 0 }, // Followers carried, views reset
    ])
  })

  it('handles empty data sets', () => {
    const data: DataCompared<DataPointChart> = {
      main: [],
      compare: [],
      params: baseParams,
    }

    const result = refineComparedData({
      data,
      snapshotKeys: ['followers'],
    })

    expect(result.main).toHaveLength(5) // 5 days of empty data
    expect(result.compare).toHaveLength(5) // 5 days of empty data
    expect(result.main?.[0]).toEqual({
      date: '2024-06-01T00:00:00.000Z',
      tense: 'past',
    })
  })

  it('preserves non-timeline properties from input', () => {
    const data: DataCompared<DataPointChart> = {
      main: [{ date: '2024-06-01T00:00:00.000Z', followers: 100 }],
      compare: [{ date: '2024-05-25T00:00:00.000Z', followers: 50 }],
      params: baseParams,
      columns: [{ name: 'Test', value: 'test' }],
      sql: 'SELECT * FROM test',
    }

    const result = refineComparedData({
      data,
      snapshotKeys: ['followers'],
    })

    expect(result.columns).toEqual(data.columns)
    expect(result.sql).toEqual(data.sql)
  })

  it('throws error when params are missing', () => {
    const data: DataCompared<DataPointChart> = {
      main: [],
      compare: [],
    }

    expect(() => refineComparedData({
      data,
      snapshotKeys: ['followers'],
    })).toThrow('Missing params')
  })
})

describe('refineTimelineData', () => {
  it('correctly refines timeline data with daily interval', () => {
    const timeStartAtIso = '2024-06-01T00:00:00.000Z'
    const timeEndAtIso = '2024-06-11T00:00:00.000Z'
    const nowIso = '2024-06-11T00:00:00.000Z'
    const timeZone = 'UTC'
    const interval: TimeLineInterval = 'day'
    const now = dayjs(nowIso)
    const data: DataPointChart[] = [
      {
        cleaned: 1,
        date: '',
        subscriptions: 3,
        unsubscribes: 2,
      },
      {
        cleaned: 0,
        date: now.subtract(7, 'day').toISOString(),
        subscriptions: 0,
        unsubscribes: 1,
      },
      {
        cleaned: 0,
        date: now.subtract(4, 'day').toISOString(),
        subscriptions: 1,
        unsubscribes: 0,
      },
      {
        cleaned: 1,
        date: now.subtract(3, 'day').toISOString(),
        subscriptions: 0,
        unsubscribes: 0,
      },
      {
        cleaned: 0,
        date: now.subtract(2, 'day').toISOString(),
        subscriptions: 0,
        unsubscribes: 1,
      },
      {
        cleaned: 0,
        date: now.subtract(1, 'day').toISOString(),
        subscriptions: 2,
        unsubscribes: 0,
      },
    ]

    const refinedData = refineTimelineData({ timeZone, timeStartAtIso, timeEndAtIso, interval, data, withRollup: true, nowIso })

    expect(refinedData).toEqual([
      { date: '', subscriptions: 3, unsubscribes: 2, cleaned: 1, label: 'Totals', tense: 'past' },
      { date: '2024-06-01T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 0, tense: 'past' },
      { date: '2024-06-02T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 0, tense: 'past' },
      { date: '2024-06-03T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 0, tense: 'past' },
      { date: '2024-06-04T00:00:00.000Z', subscriptions: 0, unsubscribes: 1, cleaned: 0, tense: 'past' },
      { date: '2024-06-05T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 0, tense: 'past' },
      { date: '2024-06-06T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 0, tense: 'past' },
      { date: '2024-06-07T00:00:00.000Z', subscriptions: 1, unsubscribes: 0, cleaned: 0, tense: 'past' },
      { date: '2024-06-08T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 1, tense: 'past' },
      { date: '2024-06-09T00:00:00.000Z', subscriptions: 0, unsubscribes: 1, cleaned: 0, tense: 'past' },
      { date: '2024-06-10T00:00:00.000Z', subscriptions: 2, unsubscribes: 0, cleaned: 0, tense: 'past' },
      { date: '2024-06-11T00:00:00.000Z', subscriptions: 0, unsubscribes: 0, cleaned: 0, tense: 'present' },
    ])
  })

  it('handles empty data array', () => {
    const timeStartAtIso = '2024-06-01T00:00:00.000Z'
    const timeEndAtIso = '2024-06-11T00:00:00.000Z'
    const nowIso = '2024-06-11T00:00:00.000Z'
    const timeZone = 'UTC'
    const interval: TimeLineInterval = 'day'
    const data: DataPointChart[] = []

    const refinedData = refineTimelineData({ timeZone, timeStartAtIso, timeEndAtIso, interval, data, nowIso, withRollup: true })

    expect(refinedData.length).toBe(12)
    expect(refinedData[1]).toEqual({ date: '2024-06-01T00:00:00.000Z', tense: 'past' })
    expect(refinedData[11]).toEqual({ date: '2024-06-11T00:00:00.000Z', tense: 'present' })
  })

  it('correctly refines timeline data with hourly interval', () => {
    const timeStartAtIso = '2024-06-10T00:00:00.000Z'
    const timeEndAtIso = '2024-06-10T12:00:00.000Z'
    const nowIso = '2024-06-10T12:00:00.000Z'
    const timeZone = 'UTC'
    const interval: TimeLineInterval = 'hour'
    const data: DataPointChart[] = [
      { date: '2024-06-10T00:00:00.000Z', subscriptions: 2, unsubscribes: 0, cleaned: 0 },
    ]

    const refinedData = refineTimelineData({
      timeZone,
      timeStartAtIso,
      timeEndAtIso,
      interval,
      data,
      nowIso,
      withRollup: false,
    })

    expect(refinedData.length).toBe(13) // 12 hours + initial point
    expect(refinedData[0]).toEqual({
      date: '2024-06-10T00:00:00.000Z',
      subscriptions: 2,
      unsubscribes: 0,
      cleaned: 0,
      tense: 'past',
    })
    expect(refinedData[12]).toEqual({
      date: '2024-06-10T12:00:00.000Z',
      subscriptions: 0,
      unsubscribes: 0,
      cleaned: 0,
      tense: 'present',
    })
  })
})

describe('refineData snapshot', () => {
  const baseArgs = {
    timeStartAtIso: '2024-06-01T00:00:00.000Z',
    timeEndAtIso: '2024-06-05T00:00:00.000Z',
    nowIso: '2024-06-05T00:00:00.000Z',
    timeZone: 'UTC',
    interval: 'day' as TimeLineInterval,
  }

  it('handles snapshot mode with follower counts', () => {
    const data: DataPointChart[] = [
      { date: '2024-06-01T00:00:00.000Z', followers: 100, engagement: 50 },
      { date: '2024-06-03T00:00:00.000Z', followers: 150, engagement: 75 },
    ]

    const refinedData = refineTimelineData({
      ...baseArgs,
      data,
      snapshotKeys: ['followers', 'engagement'],
    })

    expect(refinedData).toEqual([
      {
        date: '2024-06-01T00:00:00.000Z',
        followers: 100,
        engagement: 50,
        tense: 'past',
      },
      {
        date: '2024-06-02T00:00:00.000Z',
        followers: 100, // Carried forward
        engagement: 50, // Carried forward
        tense: 'past',
      },
      {
        date: '2024-06-03T00:00:00.000Z',
        followers: 150, // Updated
        engagement: 75, // Updated
        tense: 'past',
      },
      {
        date: '2024-06-04T00:00:00.000Z',
        followers: 150, // Carried forward
        engagement: 75, // Carried forward
        tense: 'past',
      },
      {
        date: '2024-06-05T00:00:00.000Z',
        followers: 150, // Carried forward
        engagement: 75, // Carried forward
        tense: 'present',
      },
    ])
  })

  it('maintains increment mode behavior for activity metrics', () => {
    const data: DataPointChart[] = [
      { date: '2024-06-01T00:00:00.000Z', views: 100, likes: 50 },
      { date: '2024-06-03T00:00:00.000Z', views: 150, likes: 75 },
    ]

    const refinedData = refineTimelineData({
      ...baseArgs,
      data,
    })

    expect(refinedData).toEqual([
      {
        date: '2024-06-01T00:00:00.000Z',
        views: 100,
        likes: 50,
        tense: 'past',
      },
      {
        date: '2024-06-02T00:00:00.000Z',
        views: 0, // Reset to 0
        likes: 0, // Reset to 0
        tense: 'past',
      },
      {
        date: '2024-06-03T00:00:00.000Z',
        views: 150,
        likes: 75,
        tense: 'past',
      },
      {
        date: '2024-06-04T00:00:00.000Z',
        views: 0, // Reset to 0
        likes: 0, // Reset to 0
        tense: 'past',
      },
      {
        date: '2024-06-05T00:00:00.000Z',
        views: 0, // Reset to 0
        likes: 0, // Reset to 0
        tense: 'present',
      },
    ])
  })

  it('handles mixed snapshot and increment data when specified', () => {
    const data: DataPointChart[] = [
      {
        date: '2024-06-01T00:00:00.000Z',
        followers: 100, // Snapshot
        posts: 5, // Increment
      },
      {
        date: '2024-06-03T00:00:00.000Z',
        followers: 150, // Snapshot
        posts: 3, // Increment
      },
    ]

    const refinedData = refineTimelineData({
      ...baseArgs,
      data,
      snapshotKeys: ['followers'], // Specify which keys should use snapshot mode
    })

    expect(refinedData).toEqual([
      {
        date: '2024-06-01T00:00:00.000Z',
        followers: 100, // Initial snapshot value
        posts: 5, // Initial increment value
        tense: 'past',
      },
      {
        date: '2024-06-02T00:00:00.000Z',
        followers: 100, // Carried forward
        posts: 0, // Reset to 0
        tense: 'past',
      },
      {
        date: '2024-06-03T00:00:00.000Z',
        followers: 150, // Updated snapshot
        posts: 3, // New increment value
        tense: 'past',
      },
      {
        date: '2024-06-04T00:00:00.000Z',
        followers: 150, // Carried forward
        posts: 0, // Reset to 0
        tense: 'past',
      },
      {
        date: '2024-06-05T00:00:00.000Z',
        followers: 150, // Carried forward
        posts: 0, // Reset to 0
        tense: 'present',
      },
    ])
  })

  it('handles empty data in snapshot mode', () => {
    const refinedData = refineTimelineData({ ...baseArgs, data: [] })

    expect(refinedData).toHaveLength(5)
    expect(refinedData[0]).toEqual({
      date: '2024-06-01T00:00:00.000Z',
      tense: 'past',
    })

    const refinedData2 = refineTimelineData({
      data: [],
      timeStartAtIso: '2024-10-23T16:05:37.073Z',
      timeEndAtIso: '2024-11-22T16:05:37.073Z',
      timeZone: 'UTC',
      interval: 'hour',
      snapshotKeys: [],
    })

    expect(refinedData2).toHaveLength(721)
  })
})

describe('refineParams', () => {
  // Mock current date/time
  const mockNow = '2024-01-15T12:00:00.000Z'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(mockNow))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should use default period (month) when not specified', () => {
    const result = refineParams({})

    expect(result.timeEndAtIso).toBe(mockNow)
    expect(dayjs(result.timeStartAtIso).toISOString())
      .toBe(dayjs(mockNow).subtract(1, 'month').toISOString())
    expect(result.interval).toBe('day')
  })

  it('should handle hour period correctly', () => {
    const result = refineParams({ period: 'hour' })

    expect(dayjs(result.timeStartAtIso).toISOString())
      .toBe(dayjs(mockNow).subtract(1, 'hour').toISOString())
    expect(result.interval).toBe('minute')
  })

  it('should handle hour4 period correctly', () => {
    const result = refineParams({ period: 'hour4' })

    expect(dayjs(result.timeStartAtIso).toISOString())
      .toBe(dayjs(mockNow).subtract(4, 'hour').toISOString())
    expect(result.interval).toBe('minute')
  })

  it('should handle today period correctly', () => {
    const result = refineParams({ period: 'today' })

    expect(dayjs(result.timeStartAtIso).format('YYYY-MM-DD'))
      .toBe(dayjs(mockNow).format('YYYY-MM-DD'))
    expect(result.interval).toBe('hour')
  })

  it('should handle yesterday period correctly', () => {
    const result = refineParams({ period: 'yesterday' })

    expect(dayjs(result.timeStartAtIso).format('YYYY-MM-DD'))
      .toBe(dayjs(mockNow).subtract(1, 'day').format('YYYY-MM-DD'))
    expect(result.interval).toBe('hour')
  })

  it('should handle week period correctly', () => {
    const result = refineParams({ period: 'week' })

    expect(dayjs(result.timeStartAtIso).toISOString())
      .toBe(dayjs(mockNow).subtract(1, 'week').toISOString())
    expect(result.interval).toBe('day')
  })

  describe('comparison periods', () => {
    it('should handle year comparison correctly', () => {
      const result = refineParams({ compare: 'year' })

      expect(dayjs(result.compareStartAtIso).year())
        .toBe(dayjs(result.timeStartAtIso).year() - 1)
    })

    it('should handle quarter comparison correctly', () => {
      const result = refineParams({ compare: 'quarter' })

      expect(dayjs(result.compareEndAtIso).toISOString())
        .toBe(dayjs(result.timeEndAtIso).subtract(3, 'month').toISOString())
    })

    it('should handle month comparison correctly', () => {
      const result = refineParams({ compare: 'month' })

      expect(dayjs(result.compareEndAtIso).toISOString())
        .toBe(dayjs(result.timeEndAtIso).subtract(1, 'month').toISOString())
    })

    it('should handle week comparison correctly', () => {
      const result = refineParams({ compare: 'week' })

      expect(dayjs(result.compareEndAtIso).toISOString())
        .toBe(dayjs(result.timeEndAtIso).subtract(1, 'week').toISOString())
    })
  })

  it('should respect provided timezone', () => {
    const timeZone = 'America/New_York'
    const result = refineParams({ timeZone })

    expect(result.timeZone).toBe(timeZone)
  })

  it('should default to system timezone when not provided', () => {
    const systemTimeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone
    const result = refineParams({})

    expect(result.timeZone).toBe(systemTimeZone)
  })

  it('should preserve additional params', () => {
    const additionalParam = { customField: 'test' } as QueryParams & { customField: string }
    const result = refineParams(additionalParam)

    expect(result.customField).toBe('test')
  })
})
