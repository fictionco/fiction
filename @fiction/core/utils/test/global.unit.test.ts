import type { DOMWindow } from 'jsdom'
import { JSDOM } from 'jsdom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getWindowKeys, populateGlobal } from '../globalUtils'

let dom
let window: DOMWindow
let document: Document

describe('global Utils', () => {
  beforeEach(() => {
    dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`, {
      url: 'http://localhost', // Set a URL to avoid "opaque" origin issues.
    })
    window = dom.window
    document = window.document
  })

  afterEach(() => {
    window.close()
  })

  describe('getWindowKeys', () => {
    it('returns correct keys from JSDOM window', () => {
      const global = {}
      const keys = getWindowKeys(global, window)
      // Assuming 'alert' and 'document' are in KEYS or are part of window but not in global
      expect(keys.has('alert')).toBe(true)
      expect(keys.has('document')).toBe(true)
    })
  })

  describe('populateGlobal', () => {
    it('integrates win into global with default options', () => {
      const globalEvent = vi.fn()
      const winEvent = vi.fn()
      const global = { Event: globalEvent }
      const win = { Event: winEvent }
      const { originals } = populateGlobal(global, win)
      expect(originals.get('Event')).toBe(globalEvent)
      expect(global.Event).toBe(winEvent) // win.Event should override global.Event
    })

    it('respects additionalKeys', () => {
      const additionalKey: string = 'extraKey'
      const global: Record<string, any> = {}
      const win = { [additionalKey]: 'extraValue' }
      populateGlobal(global, win, { additionalKeys: [additionalKey] })
      expect(global[additionalKey]).toBe('extraValue')
    })

    it('allows property override in global object', () => {
      const global = { prop: 'originalValue' }
      const win = { prop: 'newValue' }
      populateGlobal(global, win, { additionalKeys: ['prop'] })
      expect(global.prop).toBe('newValue')
      // Set new value to global.prop and check if it is reflected
      global.prop = 'overriddenValue'
      expect(global.prop).toBe('overriddenValue')
    })

    it('correctly integrates JSDOM window into global object', () => {
      const global = globalThis // or an empty object, depending on your setup
      populateGlobal(global, window, { bindFunctions: true })

      // Check if DOM-related objects are correctly integrated
      expect(global.document).toBe(document)

      expect(global.navigator).toBe(window.navigator)

      // Check if function binding works correctly (if necessary)
      const originalAddEventListener = window.addEventListener
      expect(global.addEventListener).not.toBe(originalAddEventListener) // should be bound version

      // Check if overriding works correctly
      const newFunction = vi.fn()
      global.alert = newFunction
      expect(global.alert).toBe(newFunction)
    })

    it('reverts overwritten properties to their original values', () => {
      const global: Record<string, any> = { originalProp: 'originalValue' }
      const win = { originalProp: 'newValue', newProp: 'newValue' }
      const { revert } = populateGlobal(global, win, { additionalKeys: ['newProp', 'originalProp'] })

      // Assert that the global object was modified
      expect(global.originalProp).toBe('newValue')
      expect(global.newProp).toBe('newValue')

      // Revert the global object to its original state
      revert()

      // Assert that the original value is restored
      expect(global.originalProp).toBe('originalValue')
      // Assert that new properties added are removed
      expect(global).not.toHaveProperty('newProp')

      expect(global.window).toBe(undefined)
    })

    it('removes properties added by populateGlobal', () => {
      const global: Record<string, any> = { untouchedProp: 'untouchedValue' }
      const win = { addedProp: 'addedValue' }
      const { revert } = populateGlobal(global, win)

      // Assert that the new property is added
      expect(global.addedProp).toBe('addedValue')

      // Revert the global object to its original state
      revert()

      // Assert that the added property is removed
      expect(global).not.toHaveProperty('addedProp')
      // Assert that untouched properties remain untouched
      expect(global.untouchedProp).toBe('untouchedValue')
    })
  })
})
