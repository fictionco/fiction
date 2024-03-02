import { describe, expect, it } from 'vitest'
import { isUnixTimestamp, standardDate, timeAgo, timeUtil } from '../time'

describe('date and Time Utility Functions', () => {
  // Test for isUnixTimestamp
  describe('isUnixTimestamp', () => {
    it('should return true for valid Unix timestamps', () => {
      expect(isUnixTimestamp('1617694973')).toBe(true)
      expect(isUnixTimestamp(1617694973)).toBe(true)
    })

    it('should return false for invalid Unix timestamps', () => {
      expect(isUnixTimestamp('not a timestamp')).toBe(false)
      expect(isUnixTimestamp(undefined)).toBe(false)
    })
  })

  // Test for timeUtil
  describe('timeUtil', () => {
    it('should return a Dayjs object', () => {
      const time = '2021-04-06'
      expect(timeUtil(time).isValid()).toBe(true)
      expect(timeUtil(1617694973).isValid()).toBe(true)
    })
  })

  // Test for timeAgo
  describe('timeAgo', () => {
    it('should return an empty string for undefined input', () => {
      expect(timeAgo(undefined)).toBe('')
    })

    it('should return a time ago string for a valid date', () => {
      const time = new Date(Date.now() - 3600 * 1000).toISOString() // 1 hour ago
      expect(timeAgo(time)).toContain('hour ago')
    })
  })

  // Test for standardDate
  describe('standardDate', () => {
    it('should return an empty string for undefined input', () => {
      expect(standardDate(undefined)).toBe('')
    })

    it('should return a formatted date string for a valid date', () => {
      const time = new Date('2021-04-06')
      expect(standardDate(time)).toBe('Apr 06, 2021')
    })
  })

  // Additional tests can be added for different scenarios and edge cases
})
