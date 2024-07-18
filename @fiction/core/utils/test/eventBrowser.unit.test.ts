/**
 * @vitest-environment happy-dom
 */

import type { Mock } from 'vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { onBrowserEvent } from '../eventBrowser'

describe('onBrowserEvent', () => {
  let callback: Mock

  beforeEach(() => {
    callback = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should add and remove a load event listener on window', () => {
    const remover = onBrowserEvent('load', callback)

    window.dispatchEvent(new Event('load'))
    expect(callback).toHaveBeenCalled()

    callback.mockClear()
    remover()
    window.dispatchEvent(new Event('load'))
    expect(callback).not.toHaveBeenCalled()
  })

  it('should add and remove a click event listener on window', () => {
    const remover = onBrowserEvent('click', callback)

    window.dispatchEvent(new MouseEvent('click'))
    expect(callback).toHaveBeenCalled()

    callback.mockClear()
    remover()
    window.dispatchEvent(new MouseEvent('click'))
    expect(callback).not.toHaveBeenCalled()
  })

  it('should add and remove a scroll event listener on document', () => {
    const remover = onBrowserEvent('scroll', callback)

    document.dispatchEvent(new Event('scroll'))
    expect(callback).toHaveBeenCalled()

    callback.mockClear()
    remover()
    document.dispatchEvent(new Event('scroll'))
    expect(callback).not.toHaveBeenCalled()
  })

  it('should add and remove a keypress event listener on window', () => {
    const remover = onBrowserEvent('keypress', callback)

    window.dispatchEvent(new KeyboardEvent('keypress'))
    expect(callback).toHaveBeenCalled()

    callback.mockClear()
    remover()
    window.dispatchEvent(new KeyboardEvent('keypress'))
    expect(callback).not.toHaveBeenCalled()
  })

  it('should add and remove a touchstart event listener on window', () => {
    const remover = onBrowserEvent('touchstart', callback)

    window.dispatchEvent(new TouchEvent('touchstart'))
    expect(callback).toHaveBeenCalled()

    callback.mockClear()
    remover()
    window.dispatchEvent(new TouchEvent('touchstart'))
    expect(callback).not.toHaveBeenCalled()
  })

  it('should add and remove a visibilitychange event listener on document', () => {
    const remover = onBrowserEvent('visibilitychange', callback, document)

    document.dispatchEvent(new Event('visibilitychange'))
    expect(callback).toHaveBeenCalled()

    callback.mockClear()
    remover()
    document.dispatchEvent(new Event('visibilitychange'))
    expect(callback).not.toHaveBeenCalled()
  })

  it('should add and remove an error event listener on window', () => {
    const remover = onBrowserEvent('error', callback)

    window.dispatchEvent(new ErrorEvent('error'))
    expect(callback).toHaveBeenCalled()

    callback.mockClear()
    remover()
    window.dispatchEvent(new ErrorEvent('error'))
    expect(callback).not.toHaveBeenCalled()
  })

  it('should add and remove an event listener on a custom target', () => {
    const customElement = document.createElement('div')
    const remover = onBrowserEvent('click', callback, customElement)

    customElement.dispatchEvent(new MouseEvent('click'))
    expect(callback).toHaveBeenCalled()

    callback.mockClear()
    remover()
    customElement.dispatchEvent(new MouseEvent('click'))
    expect(callback).not.toHaveBeenCalled()
  })

  it('should handle null or undefined target gracefully', () => {
    const remover = onBrowserEvent('click', callback, null as unknown as HTMLElement)

    window.dispatchEvent(new MouseEvent('click'))
    expect(callback).toHaveBeenCalled()

    callback.mockClear()
    remover()
    window.dispatchEvent(new MouseEvent('click'))
    expect(callback).not.toHaveBeenCalled()
  })

  it('should set event listener options correctly', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const remover = onBrowserEvent('click', callback)

    expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function), { capture: true, passive: true })

    remover()
  })
})
