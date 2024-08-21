/**
 * @vitest-environment happy-dom
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { vue, waitFor } from '@fiction/core'
import type { FrameMessage } from '../elBrowserFrameUtil.js'
import { FrameNavigator, FrameUtility } from '../elBrowserFrameUtil.js'

declare global {
  interface Window {
    testName?: string
  }
}

describe('frame messaging', () => {
  let childMessages: FrameMessage[] = []
  let parentMessages: FrameMessage[] = []

  const id = `testFrame`

  const frameEl = window.document.createElement('iframe')

  frameEl.id = id
  window.document.body.append(frameEl)

  const frameWindow = frameEl.contentWindow

  if (!frameWindow)
    throw new Error('no windowEl')

  window.testName = 'mainWindow'
  frameWindow.testName = 'frameWindow'

  const parentUtil = new FrameUtility({
    frameEl,
    src: vue.ref(`?id=1`),
    relation: 'parent',
    waitForReadySignal: true,
    isTest: true,
    onMessage: msg => parentMessages.push(msg),
    getWindow: () => window,
    getSendToWindow: () => frameWindow,
  })

  const childFrame = new FrameUtility({
    frameEl,
    relation: 'child',
    isTest: true,
    onMessage: msg => childMessages.push(msg),
    getWindow: () => frameWindow,
    getSendToWindow: () => window,
    hasKeyBoardEvents: true,
  })

  parentUtil.init()
  childFrame.init()

  afterEach(() => {
    childMessages = []
    parentMessages = []
  })

  it('sends messages', async () => {
    // test a non affiliated message
    window.postMessage('test', '*')

    parentUtil.sendMessage({
      message: { messageType: 'test', data: { foo: 'bar' } },
    })

    await waitFor(200)

    expect(parentUtil.messageBuffer.length).toBe(0)

    expect(childMessages.length).toBe(1)

    expect(childMessages.filter(m => m.messageType === 'test').length).toBe(1)

    expect(childMessages).toMatchInlineSnapshot(`
      [
        {
          "data": {
            "foo": "bar",
          },
          "from": "fiction",
          "messageType": "test",
          "url": undefined,
        },
      ]
    `)

    expect(parentMessages.length).toBe(1)

    expect(parentMessages.filter(m => m.messageType === 'frameReady').length).toBe(1)
  })

  // 2. Test Keyboard Event Handling
  it('handles keyboard events', async () => {
    // Simulate a keyboard event
    const event = new KeyboardEvent('keydown', { key: 'Alt' })
    frameWindow.dispatchEvent(event)

    await waitFor(200)

    expect(parentMessages).toMatchInlineSnapshot(`
      [
        {
          "data": {
            "direction": "down",
            "key": "Alt",
          },
          "from": "fiction",
          "messageType": "keypress",
          "url": "http://localhost:3000/?id=1",
        },
      ]
    `)

    expect(parentMessages.some(m => m.messageType === 'keypress')).toBe(true)
  })
})

describe('frameNavigator', () => {
  it('initializes with given settings', () => {
    const settings = {
      updateCallback: vi.fn(),
      urlOrPath: vue.computed(() => '/test-path'),
      displayUrl: vue.computed(() => 'http://www.test.com/test-display-url'),
    }
    const navigator = new FrameNavigator(settings)
    expect(navigator.settings, 'Settings should match').toEqual(settings)
    expect(navigator.typedPath.value, 'Initial typed path should match display URL').toBe('/test-display-url')
  })

  it('updates the URL correctly', async () => {
    const updateCallback = vi.fn()
    const navigator = new FrameNavigator({
      updateCallback,
      urlOrPath: vue.computed(() => '/initial-path'),
      displayUrl: vue.computed(() => 'http://www.test.com/initial-display-url'),
    })
    const newValue = '/new-path'
    navigator.update(newValue)
    expect(updateCallback, 'Update callback should be called with new value').toHaveBeenCalledWith(newValue)

    const newValue2 = 'http://www.foo.com/new-path-2'
    navigator.update(newValue2)
    expect(updateCallback, 'Update callback should be called with new URL').toHaveBeenCalledWith(newValue2)
  })

  it('handles displayUrl changes', async () => {
    const navigator = new FrameNavigator({
      updateCallback: vi.fn(),
      urlOrPath: vue.computed(() => '/initial-path'),
      displayUrl: vue.ref('http://www.test.com/initial-display-url'),
    })

    expect(navigator.typedPath.value, 'Initial typed path should match display URL').toBe('/initial-display-url')
    expect(navigator.displayUrlObject.value.origin, 'Display URL origin should match').toBe('http://www.test.com')
    expect(navigator.displayUrlObject.value.pathname, 'Display URL pathname should match').toBe('/initial-display-url')

    navigator.displayUrl.value = 'http://www.foo.com/new-display-url'

    await waitFor(30)

    expect(navigator.displayUrlObject.value.origin, 'Updated display URL origin should match').toBe('http://www.foo.com')
    expect(navigator.typedPath.value, 'Updated typed path should match new display URL').toBe('/new-display-url')
  })

  it('setNewPath updates history correctly', async () => {
    const navigator = new FrameNavigator({
      updateCallback: vi.fn(),
      urlOrPath: vue.computed(() => '/initial-path'),
      displayUrl: vue.computed(() => 'http://www.test.com/initial-display-url'),
    })

    await navigator.setNewPath({ fullPath: '/path1' })
    await navigator.setNewPath({ fullPath: '/path2' })
    await navigator.setNewPath({ fullPath: '/path3' })

    expect(navigator.getHistory(), 'History should contain all paths').toEqual(['/initial-display-url', '/path1', '/path2', '/path3'])
    expect(navigator.getCurrentPath(), 'Current path should be the last one set').toBe('/path3')
  })

  it('canGoBack and canGoForward work correctly', async () => {
    const navigator = new FrameNavigator({
      updateCallback: vi.fn(),
      urlOrPath: vue.computed(() => '/initial-path'),
      displayUrl: vue.computed(() => 'http://www.test.com/initial-display-url'),
    })

    expect(navigator.canGoBack(), 'Should not be able to go back initially').toBe(false)
    expect(navigator.canGoForward(), 'Should not be able to go forward initially').toBe(false)

    await navigator.setNewPath({ fullPath: '/path1' })
    await navigator.setNewPath({ fullPath: '/path2' })
    await navigator.setNewPath({ fullPath: '/path3' })

    expect(navigator.canGoBack(), 'Should be able to go back after navigation').toBe(true)
    expect(navigator.canGoForward(), 'Should not be able to go forward at the end of history').toBe(false)

    await navigator.navigateFrame('backward')

    expect(navigator.canGoBack(), 'Should be able to go back after going backward').toBe(true)
    expect(navigator.canGoForward(), 'Should be able to go forward after going backward').toBe(true)

    await navigator.navigateFrame('backward')
    await navigator.navigateFrame('backward')

    expect(navigator.canGoBack(), 'Should not be able to go back at the start of history').toBe(false)
    expect(navigator.canGoForward(), 'Should be able to go forward at the start of history').toBe(true)
  })

  it('navigateFrame updates current path correctly', async () => {
    const navigator = new FrameNavigator({
      updateCallback: vi.fn(),
      urlOrPath: vue.computed(() => '/initial-path'),
      displayUrl: vue.computed(() => 'http://www.test.com/initial-display-url'),
    })

    await navigator.setNewPath({ fullPath: '/path1' })
    await navigator.setNewPath({ fullPath: '/path2' })
    await navigator.setNewPath({ fullPath: '/path3' })

    expect(navigator.getCurrentPath(), 'Current path should be the last one set').toBe('/path3')

    await navigator.navigateFrame('backward')
    expect(navigator.getCurrentPath(), 'Current path should update after going backward').toBe('/path2')

    await navigator.navigateFrame('forward')
    expect(navigator.getCurrentPath(), 'Current path should update after going forward').toBe('/path3')

    // Test that it doesn't go past the bounds
    await navigator.navigateFrame('forward')
    expect(navigator.getCurrentPath(), 'Current path should not change when trying to go past the end').toBe('/path3')

    await navigator.navigateFrame('backward')
    await navigator.navigateFrame('backward')
    await navigator.navigateFrame('backward')
    expect(navigator.getCurrentPath(), 'Current path should be the first one when going back multiple times').toBe('/initial-display-url')
  })

  it('clears forward history when navigating from a back position', async () => {
    const navigator = new FrameNavigator({
      updateCallback: vi.fn(),
      urlOrPath: vue.computed(() => '/initial-path'),
      displayUrl: vue.computed(() => 'http://www.test.com/initial-display-url'),
    })

    await navigator.setNewPath({ fullPath: '/path1' })
    await navigator.setNewPath({ fullPath: '/path2' })
    await navigator.setNewPath({ fullPath: '/path3' })

    await navigator.navigateFrame('backward')
    await navigator.navigateFrame('backward')

    expect(navigator.getCurrentPath(), 'Should be at /path1').toBe('/path1')
    expect(navigator.canGoForward(), 'Should be able to go forward').toBe(true)

    await navigator.setNewPath({ fullPath: '/new-path' })

    expect(navigator.getCurrentPath(), 'Should be at /new-path').toBe('/new-path')
    expect(navigator.canGoForward(), 'Should not be able to go forward after new navigation').toBe(false)
    expect(navigator.getHistory(), 'History should only contain paths up to new-path').toEqual(['/initial-display-url', '/path1', '/new-path'])
  })
})
