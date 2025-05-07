// ProgressTimer.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ProgressTimer } from '../progress'

describe('ProgressTimer', () => {
  beforeEach(() => {
    // Mock Date.now to control time
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with default settings', () => {
    const timer = new ProgressTimer()
    expect(timer).toBeInstanceOf(ProgressTimer)
  })

  it('should use custom steps when provided', () => {
    const onProgress = vi.fn()
    const steps = [
      { percent: 10, message: 'Test step 1' },
      { percent: 90, message: 'Test step 2' }
    ]

    const timer = new ProgressTimer('test', {
      steps,
      onProgress
    }).start()

    // Should immediately report first step
    expect(onProgress).toHaveBeenCalledWith(10, 'Test step 1')

    timer.stop()
  })

  it('should progress based on elapsed time', () => {
    const onProgress = vi.fn()
    const timer = new ProgressTimer('test', {
      totalTime: 1000, // 1 second
      steps: [
        { percent: 10, message: 'Step 1' },
        { percent: 50, message: 'Step 2' },
        { percent: 90, message: 'Step 3' }
      ],
      onProgress
    }).start()

    // Initial step
    expect(onProgress).toHaveBeenCalledWith(10, 'Step 1')
    onProgress.mockClear()

    // Advance to 40% of time
    vi.advanceTimersByTime(400)
    expect(onProgress).toHaveBeenCalledWith(40, 'Step 1')
    onProgress.mockClear()

    // Advance to 60% of time - should trigger step 2
    vi.advanceTimersByTime(200)
    expect(onProgress).toHaveBeenCalledWith(60, 'Step 2')
    onProgress.mockClear()

    // Advance to 95% of time - should trigger step 3
    vi.advanceTimersByTime(350)
    expect(onProgress).toHaveBeenCalledWith(95, 'Step 3')
    onProgress.mockClear()

    // Complete the timer
    vi.advanceTimersByTime(50)
    expect(onProgress).toHaveBeenCalledWith(100, 'Complete')

    // Timer should stop automatically
    expect(timer.isRunning).toBeFalsy()
  })

  it('should call onComplete when finished', () => {
    const onComplete = vi.fn()
    const timer = new ProgressTimer('test', {
      totalTime: 1000,
      onComplete,
      completionMessage: 'All done!'
    }).start()

    vi.advanceTimersByTime(1000)

    expect(onComplete).toHaveBeenCalled()
  })

  it('should handle failure cases', () => {
    const onProgress = vi.fn()
    const onError = vi.fn()

    const timer = new ProgressTimer('test', {
      totalTime: 1000,
      onProgress,
      onError
    }).start()

    // Advance halfway
    vi.advanceTimersByTime(500)
    onProgress.mockClear()

    // Cause failure
    const errorMessage = 'Something went wrong'
    timer.fail(errorMessage)

    // Should report error
    expect(onProgress).toHaveBeenCalledWith(expect.any(Number), errorMessage)
    expect(onError).toHaveBeenCalled()

    // Timer should be stopped
    expect(timer.isRunning).toBeFalsy()
  })

  it('should be stoppable', () => {
    const onProgress = vi.fn()
    const onComplete = vi.fn()

    const timer = new ProgressTimer('test', {
      totalTime: 1000,
      onProgress,
      onComplete
    }).start()

    vi.advanceTimersByTime(500)
    onProgress.mockClear()

    // Stop manually
    timer.stop()

    // Should report completion
    expect(onProgress).toHaveBeenCalledWith(100, 'Complete')
    expect(onComplete).toHaveBeenCalled()

    // Timer should be stopped
    expect(timer.isRunning).toBeFalsy()

    // Advancing time further should not call progress again
    onProgress.mockClear()
    vi.advanceTimersByTime(1000)
    expect(onProgress).not.toHaveBeenCalled()
  })

  it('should handle multiple start calls gracefully', () => {
    // Setup spies for timeouts
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
    const setIntervalSpy = vi.spyOn(global, 'setInterval')

    const timer = new ProgressTimer('test')

    // First start
    timer.start()
    expect(setIntervalSpy).toHaveBeenCalledTimes(1)

    // Second start should clear previous interval
    timer.start()
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1)
    expect(setIntervalSpy).toHaveBeenCalledTimes(2)

    timer.stop()
  })

  it('should calculate percentages correctly', () => {
    const onProgress = vi.fn()

    // Create timer with uneven step distribution
    const timer = new ProgressTimer('test', {
      totalTime: 1000,
      steps: [
        { percent: 20, message: 'Step 1' },
        { percent: 80, message: 'Step 2' }
      ],
      onProgress
    }).start()

    onProgress.mockClear()

    // At 10% time, should report something close to 10%
    vi.advanceTimersByTime(100)
    expect(onProgress).toHaveBeenCalledWith(10, 'Step 1')
    onProgress.mockClear()

    // At 50% time, should report 50% but still on step 1
    vi.advanceTimersByTime(400)
    expect(onProgress).toHaveBeenCalledWith(50, 'Step 1')
    onProgress.mockClear()

    // At 85% time, should report 85% and be on step 2
    vi.advanceTimersByTime(350)
    expect(onProgress).toHaveBeenCalledWith(85, 'Step 2')

    timer.stop()
  })
})
