/**
 * @vitest-environment happy-dom
 */

import { describe, expect, it } from 'vitest'

// Mock the functions
import { isBot, isKnownBot } from '../bot.js' // Adjust the import path as needed

describe('isKnownBot', () => {
  it('should return true for known bot user agents', () => {
    const botUserAgents = [
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
      'Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)',
    ]

    botUserAgents.forEach((userAgent) => {
      expect(isKnownBot(userAgent)).toBe(true)
    })
  })

  it('should return false for non-bot user agents', () => {
    const nonBotUserAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/602.3.12 (KHTML, like Gecko) Version/10.1.2 Safari/602.3.12',
    ]

    nonBotUserAgents.forEach((userAgent) => {
      expect(isKnownBot(userAgent)).toBe(false)
    })
  })
})

describe('isBot', () => {
  it('should return true and failed reasons for headless browser', () => {
    const clientNavigator = {
      webdriver: true,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) HeadlessChrome/58.0.3029.110 Safari/537.36',
    } as Navigator

    const result = isBot({ clientNavigator })
    expect(result.result).toBe(true)
    expect(result.failed).toContain('webdriver')
  })

  it('should return true and failed reasons for known bot user agents', () => {
    const clientNavigator = {
      webdriver: false,
      userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    } as Navigator

    const result = isBot({ clientNavigator })
    expect(result.result).toBe(true)
    expect(result.failed).toContain('knownBot')
  })

  it('should return true and failed reasons for phantom browser', () => {
    globalThis.window = Object.create(window)
    // @ts-expect-error test
    globalThis.window._phantom = {}

    const clientNavigator = {
      webdriver: false,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    } as Navigator

    const result = isBot({ clientNavigator })
    expect(result.result).toBe(true)
    expect(result.failed).toContain('phantom')
  })

  it('should return false for non-bot user agents', () => {
    // @ts-expect-error test
    delete globalThis.window._phantom
    const clientNavigator = {
      webdriver: false,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    } as Navigator

    const result = isBot({ clientNavigator })

    expect(result).toMatchInlineSnapshot(`
      {
        "failed": [],
        "result": false,
      }
    `)
    expect(result.result).toBe(false)
    expect(result.failed.length).toBe(0)
  })
})
