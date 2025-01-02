import { describe, expect, it } from 'vitest'

import { formatBytes, numberFormatter } from '../number'

describe('numberFormatter', () => {
  it('should return original value for non-numeric inputs', () => {
    expect(numberFormatter('abc')).toBe('abc')
    expect(numberFormatter(Number.NaN)).toBe(Number.NaN)
    expect(numberFormatter(Infinity)).toBe(Infinity)
  })

  it('should handle numbers less than 100', () => {
    expect(numberFormatter(0)).toBe('0')
    expect(numberFormatter(50)).toBe('50.0')
    expect(numberFormatter(99.9)).toBe('99.9')
  })

  it('should format numbers between 100 and 999 without decimals', () => {
    expect(numberFormatter(100)).toBe(100)
    expect(numberFormatter(555)).toBe(555)
    expect(numberFormatter(999)).toBe(999)
  })

  it('should format thousands (k) with rules for 100s', () => {
    expect(numberFormatter(1000)).toBe('1.0k')
    expect(numberFormatter(1500)).toBe('1.5k')
    expect(numberFormatter(100000)).toBe('100k')
    expect(numberFormatter(150000)).toBe('150k')
    expect(numberFormatter(151000)).toBe('151k')
    expect(numberFormatter(99999)).toBe('100.0k')
  })

  it('should format millions (m) with rules for 100s', () => {
    expect(numberFormatter(1000000)).toBe('1.0m')
    expect(numberFormatter(1500000)).toBe('1.5m')
    expect(numberFormatter(100000000)).toBe('100m')
    expect(numberFormatter(150000000)).toBe('150m')
    expect(numberFormatter(151000000)).toBe('151m')
  })

  it('should format billions (b) with rules for 100s', () => {
    expect(numberFormatter(1000000000)).toBe('1.0b')
    expect(numberFormatter(1500000000)).toBe('1.5b')
    expect(numberFormatter(100000000000)).toBe('100b')
    expect(numberFormatter(150000000000)).toBe('150b')
    expect(numberFormatter(151000000000)).toBe('151b')
  })

  it('should format trillions (t) with rules for 100s', () => {
    expect(numberFormatter(1000000000000)).toBe('1.0t')
    expect(numberFormatter(1500000000000)).toBe('1.5t')
    expect(numberFormatter(100000000000000)).toBe('100t')
    expect(numberFormatter(150000000000000)).toBe('150t')
    expect(numberFormatter(151000000000000)).toBe('151t')
  })

  it('should handle decimal numbers correctly', () => {
    expect(numberFormatter(1234.56)).toBe('1.2k')
    expect(numberFormatter(1234567.89)).toBe('1.2m')
  })

  it('should respect forceDecimal option except for 100s', () => {
    expect(numberFormatter(1000, { fractionDigits: false })).toBe('1k')
    expect(numberFormatter(1500, { fractionDigits: false })).toBe('1.5k')
    expect(numberFormatter(100000, { fractionDigits: false })).toBe('100k')
    expect(numberFormatter(150000, { fractionDigits: false })).toBe('150k')
  })

  it('should handle string number inputs', () => {
    expect(numberFormatter('1000')).toBe('1.0k')
    expect(numberFormatter('1500.5')).toBe('1.5k')
    expect(numberFormatter('100000')).toBe('100k')
  })

  it('should handle negative numbers', () => {
    expect(numberFormatter(-1000)).toBe('-1.0k')
    expect(numberFormatter(-1500000)).toBe('-1.5m')
    expect(numberFormatter(-100000)).toBe('-100k')
  })
})

describe('formatBytes', () => {
  it('should return "0 Bytes" for 0 byte input', () => {
    expect(formatBytes(0)).toBe('0 Bytes')
  })

  it('should format bytes correctly without specifying decimals', () => {
    expect(formatBytes(1023)).toBe('1023 Bytes')
    expect(formatBytes(1024)).toBe('1 KB')
    expect(formatBytes(1024 * 1024)).toBe('1 MB')
  })

  it('should handle different decimal places', () => {
    expect(formatBytes(1023, 0)).toBe('1023 Bytes')
    expect(formatBytes(1023, 3)).toBe('1023 Bytes')
    expect(formatBytes(1586, 1)).toBe('1.5 KB')
    expect(formatBytes(1586, 0)).toBe('2 KB')
  })

  it('should handle large numbers', () => {
    expect(formatBytes(1024 ** 4)).toBe('1 TB') // Terabytes
    expect(formatBytes(1024 ** 5)).toBe('1 PB') // Petabytes
    expect(formatBytes(1024 ** 6)).toBe('1 EB') // Exabytes
    expect(formatBytes(1024 ** 7)).toBe('1 ZB') // Zettabytes
    expect(formatBytes(1024 ** 8)).toBe('1 YB') // Yottabytes
  })

  it('should round and not floor large numbers', () => {
    expect(formatBytes(1024 * 1024 + 512 * 1024)).toBe('1.5 MB')
    expect(formatBytes(1024 * 1024 * 1024 + 512 * 1024 * 1024)).toBe('1.5 GB')
  })

  it('should handle negative decimals by setting them to zero', () => {
    expect(formatBytes(1024, -1)).toBe('1 KB') // Negative decimals not allowed, defaults to 0 decimals
  })
})
