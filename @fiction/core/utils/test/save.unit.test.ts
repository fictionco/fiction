import type { Mock } from 'vitest'
import type { AutosaveConfig } from '../save'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AutosaveUtility } from '../save'

describe('autosaveUtility', () => {
  let autosaveUtil: AutosaveUtility
  let onSaveMock: Mock
  let onErrorMock: Mock

  beforeEach(() => {
    vi.useFakeTimers()
    onSaveMock = vi.fn().mockResolvedValue(undefined)
    onErrorMock = vi.fn()

    const config: AutosaveConfig = {
      onSave: onSaveMock,
      debounceMs: 1000,
      onError: onErrorMock,
    }

    autosaveUtil = new AutosaveUtility(config)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('should not be dirty initially', () => {
    expect(autosaveUtil.isDirty.value).toBe(false)
  })

  it('should become dirty when autosave is called', () => {
    autosaveUtil.autosave({ caller: 'test' })
    expect(autosaveUtil.isDirty.value).toBe(true)
  })

  it('should call onSave after debounce time', async () => {
    autosaveUtil.autosave({ caller: 'test' })
    expect(onSaveMock).not.toHaveBeenCalled()

    await vi.runAllTimersAsync()

    expect(onSaveMock).toHaveBeenCalledTimes(1)
  })

  it('should reset dirty state after successful save', async () => {
    autosaveUtil.autosave({ caller: 'test' })
    await vi.runAllTimersAsync()

    expect(autosaveUtil.isDirty.value).toBe(false)
  })

  it('should debounce multiple calls', async () => {
    autosaveUtil.autosave({ caller: 'test' })
    autosaveUtil.autosave({ caller: 'test' })
    autosaveUtil.autosave({ caller: 'test' })

    await vi.advanceTimersByTimeAsync(500)
    autosaveUtil.autosave({ caller: 'test' })

    await vi.runAllTimersAsync()

    expect(onSaveMock).toHaveBeenCalledTimes(1)
  })

  it('should force sync immediately', async () => {
    await autosaveUtil.forceSync()

    expect(onSaveMock).toHaveBeenCalledTimes(1)
    expect(autosaveUtil.isDirty.value).toBe(false)
  })

  it('should clear pending autosave and dirty state', () => {
    autosaveUtil.autosave({ caller: 'test' })
    expect(autosaveUtil.isDirty.value).toBe(true)

    autosaveUtil.clear()

    expect(autosaveUtil.isDirty.value).toBe(false)
    vi.runAllTimers()
    expect(onSaveMock).not.toHaveBeenCalled()
  })

  it('should call onError when save fails', async () => {
    const error = new Error('Save failed')
    onSaveMock.mockRejectedValueOnce(error)

    autosaveUtil.autosave({ caller: 'test' })
    await vi.runAllTimersAsync()

    expect(onErrorMock).toHaveBeenCalledWith(error)
    expect(autosaveUtil.isDirty.value).toBe(true)
  })

  it('should use default debounce time if not provided', async () => {
    const defaultConfig: AutosaveConfig = {
      onSave: onSaveMock,
    }
    const defaultAutosaveUtil = new AutosaveUtility(defaultConfig)

    defaultAutosaveUtil.autosave({ caller: 'test' })

    await vi.advanceTimersByTimeAsync(1999)
    expect(onSaveMock).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    expect(onSaveMock).toHaveBeenCalledTimes(1)
  })
})
