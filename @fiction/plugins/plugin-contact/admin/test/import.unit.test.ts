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
    const file = createFile('Name,Email\nJohn Doe,john@example.com\nJane Doe,jane@example.com\nWhatever,not valid email')
    const result = await csvToEmailList(file)
    expect(result).toEqual(['john@example.com', 'jane@example.com'])
  })
  it('parses CSV with headers and values correctly', async () => {
    const file = createFile('Name,Email\nJohn Doe,john@example.com\nJane Doe,jane@example.com')
    const result = await csvToJson(file)
    expect(result).toEqual([
      { name: 'john doe', email: 'john@example.com' },
      { name: 'jane doe', email: 'jane@example.com' },
    ])
  })

  it('handles CSV with extra spaces correctly', async () => {
    const file = createFile(' Name , Email \n John Doe , john@example.com \n Jane Doe , jane@example.com ')
    const result = await csvToJson(file)
    expect(result).toEqual([
      { name: 'john doe', email: 'john@example.com' },
      { name: 'jane doe', email: 'jane@example.com' },
    ])
  })

  it('handles missing values correctly', async () => {
    const file = createFile('Name,Email\nJohn Doe,\nJane Doe,jane@example.com')
    const result = await csvToJson(file)
    expect(result).toEqual([
      { name: 'john doe', email: '' },
      { name: 'jane doe', email: 'jane@example.com' },
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
  it('returns an array of valid email addresses', () => {
    const input = 'test@example.com, user@domain.com\ninvalid-email,another@test.org'
    const result = parseAndValidateEmails(input)
    expect(result).toEqual(['test@example.com', 'user@domain.com', 'another@test.org'])
  })

  it('handles extra spaces and capitalization correctly', () => {
    const input = '  Test@Example.Com , USER@domain.com \n Another@TEST.org '
    const result = parseAndValidateEmails(input)
    expect(result).toEqual(['test@example.com', 'user@domain.com', 'another@test.org'])
  })

  it('handles empty input correctly', () => {
    const input = ''
    const result = parseAndValidateEmails(input)
    expect(result).toEqual([])
  })

  it('filters out invalid email addresses', () => {
    const input = 'valid@example.com, invalid-email, another@valid.org'
    const result = parseAndValidateEmails(input)
    expect(result).toEqual(['valid@example.com', 'another@valid.org'])
  })

  it('handles multiple separators correctly', () => {
    const input = 'test1@example.com, test2@example.com\ntest3@example.com test4@example.com'
    const result = parseAndValidateEmails(input)
    expect(result).toEqual(['test1@example.com', 'test2@example.com', 'test3@example.com', 'test4@example.com'])
  })

  it('handles single valid email correctly', () => {
    const input = 'single@example.com'
    const result = parseAndValidateEmails(input)
    expect(result).toEqual(['single@example.com'])
  })

  it('handles single invalid email correctly', () => {
    const input = 'invalid-email'
    const result = parseAndValidateEmails(input)
    expect(result).toEqual([])
  })
})
