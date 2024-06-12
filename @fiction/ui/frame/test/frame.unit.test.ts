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
    expect(navigator.settings).toEqual(settings)
    expect(navigator.typedPath.value).toBe('/test-display-url')
  })

  // Add more tests here...

  it('updates the URL correctly', async () => {
    const updateCallback = vi.fn()
    const navigator = new FrameNavigator({
      updateCallback,
      urlOrPath: vue.computed(() => '/initial-path'),
      displayUrl: vue.computed(() => 'http://www.test.com/initial-display-url'),
    })
    const newValue = '/new-path'
    navigator.update(newValue)
    expect(updateCallback).toHaveBeenCalledWith(newValue)

    const newValue2 = 'http://www.foo.com/new-path-2'

    navigator.update(newValue2)
    expect(updateCallback).toHaveBeenCalledWith(newValue2)
  })

  it('handles displayUrl changes', async () => {
    const navigator = new FrameNavigator({
      updateCallback: vi.fn(),
      urlOrPath: vue.computed(() => '/initial-path'),
      displayUrl: vue.ref('http://www.test.com/initial-display-url'),
    })

    expect(navigator.typedPath.value).toBe('/initial-display-url')

    expect(navigator.displayUrlObject.value.origin).toBe('http://www.test.com')
    expect(navigator.displayUrlObject.value.pathname).toBe('/initial-display-url')

    navigator.displayUrl.value = 'http://www.foo.com/new-display-url'

    await waitFor(30)

    expect(navigator.displayUrlObject.value.origin).toBe('http://www.foo.com')

    expect(navigator.typedPath.value).toBe('/new-display-url')
  })

  it('setNewPath updates activeHistory and navPointer correctly', async () => {
    const navigator = new FrameNavigator({
      updateCallback: vi.fn(),
      urlOrPath: vue.computed(() => '/initial-path'),
      displayUrl: vue.computed(() => 'http://www.test.com/initial-display-url'),
    })

    await navigator.setNewPath({ usingHistory: false, fullPath: '/new-path' })

    await waitFor(30)

    expect(navigator.typedPath.value).toBe('/new-path')

    expect(navigator.displayUrlObject.value.pathname).toBe('/new-path')

    expect(navigator.activeHistory.value.paths[0]).toBe('/new-path')
    expect(navigator.activeHistory.value.pointer).toBe(0)

    // Check if it handles the history flag correctly
    await navigator.setNewPath({ usingHistory: true, fullPath: '/another-path' })
    expect(navigator.activeHistory.value.pointer).toBe(0) // pointer should not reset if history is true
  })

  // Add tests for setNewPath and navigateFrame...

  // You can add more specific tests to handle edge cases, error handling, etc.
})
