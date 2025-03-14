/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it, vi } from 'vitest'

import { csvToEmailList, csvToJson, parseAndValidateEmails } from '../utils.js' // Adjust the path accordingly

function createFile(content: string): File {
  const blob = new Blob([content], { type: 'text/csv' })
  return new File([blob], 'test.csv', { type: 'text/csv' })
}

describe('csvToJson', () => {
  it('parses CSV to email list', async () => {
    const file = createFile('Name,Email\nJohn Doe,john@test1.com\nJane Doe,jane@test2.com\nWhatever,not valid email')
    const result = await csvToEmailList(file)
    // Updated to match new return type with stats
    expect(result.emails).toContain('john@test1.com')
    expect(result.emails).toContain('jane@test2.com')
    expect(result.validCount).toBe(2)
    expect(result.invalidCount).toBe(1)
    expect(result.invalidReasons).toHaveProperty('missing_at_symbol')
  })

  it('parses CSV with headers and values correctly', async () => {
    const file = createFile('Name,Email\nJohn Doe,john@test1.com\nJane Doe,jane@test2.com')
    const result = await csvToJson(file)
    expect(result).toEqual([
      { name: 'John Doe', email: 'john@test1.com' },
      { name: 'Jane Doe', email: 'jane@test2.com' },
    ])
  })

  it('handles CSV with extra spaces correctly', async () => {
    const file = createFile(' Name , Email \n John Doe , john@test1.com \n Jane Doe , jane@test2.com ')
    const result = await csvToJson(file)
    expect(result).toEqual([
      { name: 'John Doe', email: 'john@test1.com' },
      { name: 'Jane Doe', email: 'jane@test2.com' },
    ])
  })

  it('handles missing values correctly', async () => {
    const file = createFile('Name,Email\nJohn Doe,\nJane Doe,jane@example.com')
    const result = await csvToJson(file)
    expect(result).toEqual([
      { name: 'John Doe', email: '' },
      { name: 'Jane Doe', email: 'jane@example.com' },
    ])
  })

  it('handles empty CSV file correctly', async () => {
    const file = createFile('')
    await expect(csvToJson(file)).rejects.toThrow('CSV file is empty or does not contain headers.')
  })

  it('handles file read error correctly', async () => {
    const mockFileReader = {
      onload: null,
      onerror: null,
      readAsText: vi.fn().mockImplementation(function () {
        // @ts-expect-error test
        const onError = this.onerror

        if (onError)
          onError(new Error('Error reading the file.'))
      }),
    }

    vi.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader as unknown as FileReader)

    const invalidFile = createFile('test')
    await expect(csvToJson(invalidFile)).rejects.toThrow('Error reading the file.')

    vi.restoreAllMocks()
  })
})

describe('parseAndValidateEmails', () => {
  it('returns valid email addresses with stats', () => {
    const input = 'test@example.com, user@domain.com\ninvalid-email,another@test.org'
    const result = parseAndValidateEmails(input)

    // Check the returned EmailStats structure
    expect(result.emails).toContain('user@domain.com')
    expect(result.emails).toContain('another@test.org')
    expect(result.validCount).toBe(2) // example.com is flagged as suspicious
    expect(result.invalidCount).toBe(2) // One invalid format, one suspicious domain
    expect(result.invalidReasons).toHaveProperty('missing_at_symbol')
    expect(result.invalidReasons).toHaveProperty('suspicious_domain')
  })

  it('handles extra spaces and capitalization correctly', () => {
    const input = '  Test@Example.Com , USER@domain.com \n Another@xxx.org '
    const result = parseAndValidateEmails(input)

    expect(result).toMatchInlineSnapshot(`
      {
        "emails": [
          "user@domain.com",
          "another@xxx.org",
        ],
        "invalidCount": 1,
        "invalidReasons": {
          "suspicious_domain": 1,
        },
        "suspiciousDomains": [
          "example.com",
        ],
        "validCount": 2,
      }
    `)

    expect(result.emails).toContain('user@domain.com')
    expect(result.emails).toContain('another@xxx.org')
    expect(result.validCount).toBe(2) // example.com is flagged as suspicious
    expect(result.invalidCount).toBe(1) // Suspicious domain
  })

  it('handles empty input correctly', () => {
    const input = ''
    const result = parseAndValidateEmails(input)

    expect(result.emails).toEqual([])
    expect(result.validCount).toBe(0)
    expect(result.invalidCount).toBe(0)
    expect(result.invalidReasons).toEqual({})
  })

  it('filters out invalid email addresses', () => {
    const input = 'valid@domain.com, invalid-email, another@valid.org'
    const result = parseAndValidateEmails(input)

    expect(result.emails).toContain('valid@domain.com')
    expect(result.emails).toContain('another@valid.org')
    expect(result.validCount).toBe(2)
    expect(result.invalidCount).toBe(1)
    expect(result.invalidReasons).toHaveProperty('missing_at_symbol')
  })

  it('handles multiple separators correctly', () => {
    const input = 'test1@domain.com, test2@domain.com\ntest3@domain.com test4@domain.com'
    const result = parseAndValidateEmails(input)

    expect(result.emails).toEqual([
      'test1@domain.com',
      'test2@domain.com',
      'test3@domain.com',
      'test4@domain.com',
    ])
    expect(result.validCount).toBe(4)
    expect(result.invalidCount).toBe(0)
  })

  it('handles single valid email correctly', () => {
    const input = 'single@domain.com'
    const result = parseAndValidateEmails(input)

    expect(result.emails).toEqual(['single@domain.com'])
    expect(result.validCount).toBe(1)
    expect(result.invalidCount).toBe(0)
  })

  it('handles single invalid email correctly', () => {
    const input = 'invalid-email'
    const result = parseAndValidateEmails(input)

    expect(result.emails).toEqual([])
    expect(result.validCount).toBe(0)
    expect(result.invalidCount).toBe(1)
    expect(result.invalidReasons).toHaveProperty('missing_at_symbol')
  })

  it('deduplicates repeated email addresses', () => {
    const input = 'repeat@domain.com, repeat@domain.com, another@domain.com'
    const result = parseAndValidateEmails(input)

    expect(result.emails).toEqual(['repeat@domain.com', 'another@domain.com'])
    expect(result.validCount).toBe(2)
    expect(result.emails.length).toBe(2) // Should only have unique emails
  })

  it('handles mixed case email duplicates', () => {
    const input = 'User@Domain.com, user@domain.com, USER@DOMAIN.COM'
    const result = parseAndValidateEmails(input)

    expect(result.emails).toEqual(['user@domain.com'])
    expect(result.validCount).toBe(1)
    expect(result.emails.length).toBe(1) // Should normalize and deduplicate
  })
})

describe('csvToEmailList with email detection', () => {
  it('detects email column when not explicitly named', async () => {
    const file = createFile('Name,Contact Information,Phone\nJohn Doe,john@domain.com,123-456-7890')
    const result = await csvToEmailList(file)

    expect(result.emails).toContain('john@domain.com')
    expect(result.validCount).toBe(1)
  })

  it('handles files with multiple potential email columns', async () => {
    const file = createFile('Name,Primary Email,Secondary Email\nJohn Doe,john@domain.com,john.work@domain.com')
    const result = await csvToEmailList(file)

    // Should choose column with explicit "email" in the name
    expect(result.emails).toContain('john@domain.com')
    expect(result.validCount).toBe(1)
  })

  it('provides statistics on suspicious domains', async () => {
    const file = createFile('Name,Email\nTest User,test@example.com\nAnother,another@temporary.com')
    const result = await csvToEmailList(file)

    expect(result.validCount).toBe(0)
    expect(result.invalidCount).toBe(2)
    expect(result.invalidReasons).toHaveProperty('suspicious_domain')
    expect(result.suspiciousDomains).toBeDefined()
    expect(result.suspiciousDomains).toContain('example.com')
    expect(result.suspiciousDomains).toContain('temporary.com')
  })
})

describe('email parsing edge cases', () => {
  it('handles quoted data in CSV files correctly', async () => {
    const file = createFile('Name,Email,Notes\n"John, Doe","john@domain.com","Has a, comma in name"\n"Jane Doe","jane@domain.com","Normal note"')
    const result = await csvToJson(file)

    expect(result).toEqual([
      { name: 'John, Doe', email: 'john@domain.com', notes: 'Has a, comma in name' },
      { name: 'Jane Doe', email: 'jane@domain.com', notes: 'Normal note' },
    ])

    const emailList = await csvToEmailList(file)
    expect(emailList.emails).toContain('john@domain.com')
    expect(emailList.emails).toContain('jane@domain.com')
    expect(emailList.validCount).toBe(2)
  })

  it('handles complex email addresses correctly', () => {
    const complexEmails = 'user+tag@domain.com, name.surname@company-name.co.uk, user_name@domain.net'
    const result = parseAndValidateEmails(complexEmails)

    expect(result.emails).toContain('user+tag@domain.com')
    expect(result.emails).toContain('name.surname@company-name.co.uk')
    expect(result.emails).toContain('user_name@domain.net')
    expect(result.validCount).toBe(3)
    expect(result.invalidCount).toBe(0)
  })

  it('handles international domain names properly', () => {
    const internationalEmails = 'user@例子.测试, person@société.fr, name@компания.рф'
    const result = parseAndValidateEmails(internationalEmails)

    // These should be valid addresses
    expect(result.emails).toHaveLength(3)
    expect(result.validCount).toBe(3)
  })

  it('identifies missing or invalid email columns properly', async () => {
    // No email-like column
    const noEmailFile = createFile('Name,Address,Phone\nJohn Doe,123 Main St,555-1234')
    const noEmailResult = await csvToEmailList(noEmailFile)

    expect(noEmailResult).toMatchInlineSnapshot(`
      {
        "emails": [],
        "invalidCount": 1,
        "invalidReasons": {
          "no_email_column": 1,
        },
        "validCount": 0,
      }
    `)

    expect(noEmailResult.validCount).toBe(0)
    expect(noEmailResult.invalidReasons).toHaveProperty('no_email_column')

    // Empty file with headers only
    const emptyDataFile = createFile('Name,Email\n')
    const emptyResult = await csvToEmailList(emptyDataFile)

    expect(emptyResult.validCount).toBe(0)
    expect(emptyResult.emails).toHaveLength(0)
  })

  it('handles very large inputs gracefully', async () => {
    // Generate a large number of valid emails
    const largeEmailList = Array.from({ length: 1000 }, (_, i) => `user${i}@domain.com`).join(', ')
    const result = parseAndValidateEmails(largeEmailList)

    expect(result.emails.length).toBe(1000)
    expect(result.validCount).toBe(1000)
    expect(result.invalidCount).toBe(0)
  })

  it('handles malformed CSV properly', async () => {
    // Missing delimiter in some rows
    const malformedFile = createFile('Name,Email\nJohn Doejohn@domain.com\nJane Doe,jane@domain.com')

    // Should still extract the valid email
    const emailResult = await csvToEmailList(malformedFile)
    expect(emailResult.validCount).toBeGreaterThanOrEqual(1)
    expect(emailResult.emails).toContain('jane@domain.com')
  })

  it('correctly validates emails with IP addresses', () => {
    const ipEmails = 'user@[127.0.0.1], admin@[255.255.255.255]'
    const result = parseAndValidateEmails(ipEmails)

    // These should be treated as valid by our validator
    expect(result.validCount).toBe(2)
    expect(result.emails).toHaveLength(2)
  })

  it('correctly processes mixed valid and invalid emails', () => {
    const mixedInput = `
      valid@domain.com
      not-an-email
      user@example.com
      @missing-local-part.com
      another-valid@company.org
      missing-domain@
      user@suspicious-domain.tempmail.com
    `
    const result = parseAndValidateEmails(mixedInput)

    // Check valid emails were extracted
    expect(result.emails).toContain('valid@domain.com')
    expect(result.emails).toContain('another-valid@company.org')

    // Check invalid counts
    expect(result.invalidCount).toBe(5) // 5 invalid emails

    expect(result.invalidReasons).toMatchInlineSnapshot(`
      {
        "empty_local_part": 1,
        "invalid_domain": 1,
        "missing_at_symbol": 1,
        "suspicious_domain": 2,
      }
    `)

    // Check specific error reasons
    expect(result.invalidReasons).toHaveProperty('missing_at_symbol')
    expect(result.invalidReasons).toHaveProperty('suspicious_domain')
    expect(result.invalidReasons).toHaveProperty('invalid_domain')
  })
})
