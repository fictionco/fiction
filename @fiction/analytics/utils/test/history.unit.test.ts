/**
 * @vitest-environment happy-dom
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { historyUtil } from '../history'

describe('historyPatcher', () => {
  let callback: () => void

  beforeEach(() => {
    callback = vi.fn()
  })

  it('should call callback on pushState', () => {
    historyUtil.onHistoryChange(callback)

    history.pushState({}, '', '/new-url')

    expect(callback).toHaveBeenCalled()
  })

  it('should call callback on popstate', () => {
    historyUtil.onHistoryChange(callback)

    const popStateEvent = new PopStateEvent('popstate', { state: {} })
    window.dispatchEvent(popStateEvent)

    expect(callback).toHaveBeenCalled()
  })
})
