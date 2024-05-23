import { describe, expect, it } from 'vitest'

import { formatBytes } from '../number'

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
