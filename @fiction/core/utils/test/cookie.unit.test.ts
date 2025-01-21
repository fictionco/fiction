/**
 * @vitest-environment happy-dom
 * https://vitest.dev/config/#environment
 */
import Cookies from 'js-cookie'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  getCookie,
  getNakedDomain,
  removeCookie,
  removeCookieNakedDomain,
  setCookie,
  setCookieNakedDomain,
} from '../cookie'

describe('cookie', () => {
  // Mock window.location for different domain scenarios
  const mockWindowLocation = (hostname: string) => {
    Object.defineProperty(window.location, 'hostname', {
      writable: true,
      value: hostname,
    })
  }

  // Clear cookies before each test and reset the hostname
  beforeEach(() => {
    // Reset hostname to localhost for each test
    Object.defineProperty(window.location, 'hostname', {
      writable: true,
      value: 'localhost',
    })
  })

  describe('getNakedDomain', () => {
    it('should return the correct naked domain', () => {
      const cookieDomain = getNakedDomain()
      expect(window.location.hostname).toBe('localhost')
      expect(cookieDomain).toEqual('localhost')
    })

    it('should return the correct naked domain for a subdomain', () => {
      mockWindowLocation('sub.domain.example.com')
      expect(getNakedDomain()).toEqual('example.com')
    })

    it('should return the correct naked domain for a top-level domain', () => {
      mockWindowLocation('example.com')
      expect(getNakedDomain()).toEqual('example.com')
    })
  })

  describe('setCookie', () => {
    it('should set a basic cookie', () => {
      setCookie({ name: 'test', value: 'test', attributes: { expires: 14 } })
      expect(Cookies.get('test')).toBe('test')
      removeCookie({ name: 'test' })
    })
  })

  describe('getCookie', () => {
    it('should retrieve a set cookie', () => {
      Cookies.set('test', 'test')
      expect(getCookie('test')).toBe('test')
    })
  })

  describe('setCookieNakedDomain', () => {
    it('should set a cookie for the naked domain', () => {
      setCookieNakedDomain({ name: 'test2', value: 'test2', attributes: { expires: 14 } })
      expect(getCookie('test2')).toBe('test2')
      removeCookieNakedDomain({ name: 'test2' })
    })
  })

  describe('removeCookieNakedDomain', () => {
    it('should remove a cookie set for the naked domain', () => {
      setCookieNakedDomain({ name: 'test2', value: 'test2', attributes: { expires: 14 } })
      removeCookieNakedDomain({ name: 'test2' })
      expect(getCookie('test2')).toBeUndefined()
    })
  })

  describe('more Complex Cookie Handling', () => {
    it('should handle more complex cookie scenarios', () => {
      setCookie({ name: 'test3', value: 'test3', attributes: { expires: 14, domain: 'test.com' } })
      expect(getCookie('test3')).toBeUndefined()
      removeCookie({ name: 'test3' })
    })
  })

  // Additional tests as needed
})
