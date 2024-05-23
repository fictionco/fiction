import { describe, expect, it } from 'vitest'

import { defaultOrgName } from './index.js'

describe('defaultOrgName', () => {
  it('should extract the username and remove special characters', () => {
    const email = 'user.name+123@gmail.com'
    const result = defaultOrgName(email)
    expect(result).toContain('UserName\'s Workspace')
  })

  it('should handle usernames ending with "s" correctly', () => {
    const email = 'chris@example.com'
    const result = defaultOrgName(email)
    expect(result).toBe('Chris\' Workspace')
  })

  it('should handle usernames not ending with "s" and add \'s correctly', () => {
    const email = 'robert123@example.com'
    const result = defaultOrgName(email)
    expect(result).toBe('Robert\'s Workspace')
  })

  it('should return correct organization name for emails without special characters', () => {
    const email = 'alice@example.com'
    const result = defaultOrgName(email)
    expect(result).toBe('Alice\'s Workspace')
  })

  it('should correctly handle email with underscores and periods', () => {
    const email = 'john_doe.senior@example.com'
    const result = defaultOrgName(email)
    expect(result).toBe('JohnDoeSenior\'s Workspace')
  })

  it('should handle email addresses with no username part', () => {
    const email = '@example.com'
    const result = defaultOrgName(email)
    expect(result).toBe('\'s Workspace')
  })

  it('should handle complex email with multiple special characters', () => {
    const email = 'first.last+category_123@example.com'
    const result = defaultOrgName(email)
    expect(result).toBe(`FirstLast's Workspace`)
  })
})
