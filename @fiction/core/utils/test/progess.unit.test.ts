// ProgressTimer.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ProgressTimer } from '../progress'

describe('progressTimer', () => {
  // Setup and teardown
  beforeEach(() => {
    // Mock timers
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with default settings', () => {
    const timer = new ProgressTimer()
    expect(timer.isRunning).toBe(false)
    expect(timer.timer).toBeNull()
    expect(timer.startTime).toBe(0)
    expect(timer.elapsed).toBe(0)
    expect(timer.failed).toBe(false)
  })

  it('should initialize with custom settings', () => {
    const customSteps = [
      { percent: 20, message: 'Custom step 1' },
      { percent: 80, message: 'Custom step 2' },
    ]
    const timer = new ProgressTimer('CustomTimer', { steps: customSteps, totalTime: 5000 })
    expect(timer.settings.steps).toEqual(customSteps)
    expect(timer.settings.totalTime).toBe(5000)
  })

  it('should start the timer and update progress', () => {
    const onProgress = vi.fn()
    const timer = new ProgressTimer('TestTimer', {
      onProgress,
      totalTime: 1000,
    })

    timer.start()

    // Initial update should happen immediately
    expect(timer.isRunning).toBe(true)
    expect(onProgress).toHaveBeenCalledWith(25, 'Starting process...')

    // Advance 500ms (50% of total time)
    vi.advanceTimersByTime(500)
    expect(onProgress).toHaveBeenCalledWith(50, 'Processing data...')

    // Advance another 250ms (75% of total time)
    vi.advanceTimersByTime(350)
    expect(onProgress).toHaveBeenCalledWith(75, 'Almost there...')

    // Advance to completion
    vi.advanceTimersByTime(650)
    expect(onProgress).toHaveBeenCalledWith(100, 'Complete')
    expect(timer.isRunning).toBe(false)
  })

  it('should handle custom steps correctly', () => {
    const onProgress = vi.fn()
    const steps = [
      { percent: 10, message: 'Step 1' },
      { percent: 60, message: 'Step 2' },
      { percent: 90, message: 'Step 3' },
    ]

    const timer = new ProgressTimer('CustomSteps', {
      steps,
      onProgress,
      totalTime: 1000,
    })

    timer.start()

    // Initial update should happen with first step
    expect(onProgress).toHaveBeenCalledWith(10, 'Step 1')

    // Advance to 60%
    vi.advanceTimersByTime(600)
    expect(onProgress).toHaveBeenCalledWith(60, 'Step 2')

    // Advance to 90%
    vi.advanceTimersByTime(300)
    expect(onProgress).toHaveBeenCalledWith(90, 'Step 3')
  })

  it('should call onComplete when timer completes', () => {
    const onComplete = vi.fn()
    const onProgress = vi.fn()

    const timer = new ProgressTimer('CompletionTest', {
      onComplete,
      onProgress,
      totalTime: 1000,
    })

    timer.start()
    vi.advanceTimersByTime(1000)

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(timer.isRunning).toBe(false)
  })

  it('should use custom completion message when provided', () => {
    const onProgress = vi.fn()
    const completionMessage = 'Custom completion message'

    const timer = new ProgressTimer('CustomMessage', {
      onProgress,
      completionMessage,
      totalTime: 1000,
    })

    timer.start()
    vi.advanceTimersByTime(1000)

    expect(onProgress).toHaveBeenCalledWith(100, completionMessage)
  })

  it('should handle stop without triggering completion', () => {
    const onComplete = vi.fn()
    const onProgress = vi.fn()

    const timer = new ProgressTimer('StopTest', {
      onComplete,
      onProgress,
      totalTime: 1000,
    })

    timer.start()
    vi.advanceTimersByTime(500)
    timer.stop(false)

    expect(onComplete).not.toHaveBeenCalled()
    expect(timer.isRunning).toBe(false)
    expect(timer.timer).toBeNull()
  })

  it('should handle stop with triggering completion', () => {
    const onComplete = vi.fn()
    const onProgress = vi.fn()

    const timer = new ProgressTimer('StopWithCompletionTest', {
      onComplete,
      onProgress,
      totalTime: 1000,
    })

    timer.start()
    vi.advanceTimersByTime(500)
    timer.stop(true)

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onProgress).toHaveBeenCalledWith(100, 'Complete')
    expect(timer.isRunning).toBe(false)
  })

  it('should handle fail state correctly', () => {
    const onError = vi.fn()
    const onProgress = vi.fn()
    const onComplete = vi.fn()

    const timer = new ProgressTimer('FailTest', {
      onError,
      onProgress,
      onComplete,
      totalTime: 1000,
    })

    timer.start()
    vi.advanceTimersByTime(300)
    const errorMessage = 'Custom error message'
    timer.fail(errorMessage)

    expect(onError).toHaveBeenCalledWith(errorMessage)
    expect(onProgress).toHaveBeenCalledWith(30, errorMessage)
    expect(onComplete).not.toHaveBeenCalled()
    expect(timer.isRunning).toBe(false)
    expect(timer.failed).toBe(true)
  })

  it('should not exceed 100% progress', () => {
    const onProgress = vi.fn()

    const timer = new ProgressTimer('MaxProgressTest', {
      onProgress,
      totalTime: 1000,
    })

    timer.start()
    vi.advanceTimersByTime(1500) // Advance beyond total time

    // Progress should be capped at 100%
    const lastCall = onProgress.mock.calls[onProgress.mock.calls.length - 2]
    expect(lastCall[0]).toBe(100)
  })

  it('should allow chaining of methods', () => {
    const timer = new ProgressTimer()

    const result = timer.start().stop().fail('Error').start()

    expect(result).toBe(timer)
  })

  it('should handle multiple start-stop cycles', () => {
    const onProgress = vi.fn()

    const timer = new ProgressTimer('CycleTest', {
      onProgress,
      totalTime: 1000,
    })

    // First cycle
    timer.start()
    vi.advanceTimersByTime(300)
    timer.stop()

    // Second cycle
    timer.start()
    vi.advanceTimersByTime(200)

    // Progress should have reset
    expect(timer.elapsed).toBe(200)
    expect(timer.isRunning).toBe(true)
  })

  it('should not update progress after stopping', () => {
    const onProgress = vi.fn()

    const timer = new ProgressTimer('StopUpdateTest', {
      onProgress,
      totalTime: 1000,
    })

    timer.start()
    const initialCallCount = onProgress.mock.calls.length

    timer.stop()
    vi.advanceTimersByTime(500)

    // Only one more call for the completion
    expect(onProgress.mock.calls.length).toBe(initialCallCount + 1)
  })
})
