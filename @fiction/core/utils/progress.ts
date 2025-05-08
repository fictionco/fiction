import { FictionObject } from '../plugin.js'

export type ProgressStep = {
  percent: number
  message: string
}

export type ProgressTimerSettings = {
  steps?: ProgressStep[]
  totalTime?: number
  onProgress?: (percent: number, message: string) => void
  onComplete?: () => void
  onError?: (error?: string) => void
  completionMessage?: string
}

export class ProgressTimer extends FictionObject<ProgressTimerSettings> {
  private timer: ReturnType<typeof setInterval> | null = null
  private startTime = 0
  private elapsed = 0
  private failed = false
  isRunning = false
  private lastReportedPercent = 0
  private currentStepIndex = 0

  constructor(name = 'ProgressTimer', settings: ProgressTimerSettings = {}) {
    super(name, settings)
  }

  start(): this {
    // Clear any existing timer
    this.stop(false)

    const steps = this.settings.steps || [
      { percent: 25, message: 'Starting process...' },
      { percent: 50, message: 'Processing data...' },
      { percent: 75, message: 'Almost there...' },
      { percent: 100, message: 'Complete' },
    ]

    this.startTime = Date.now()
    this.elapsed = 0
    this.failed = false
    this.isRunning = true
    this.lastReportedPercent = 0
    this.currentStepIndex = 0

    // Report initial step immediately
    if (steps.length > 0) {
      this.updateProgress(0, steps[0].message)
    }

    const totalTime = this.settings.totalTime || 40000
    const interval = Math.max(50, totalTime / 100) // At least 50ms to avoid excessive updates

    // Create the timer to update progress
    this.timer = setInterval(() => {
      if (!this.isRunning)
        return

      this.elapsed += interval

      // Calculate current percentage based on elapsed time
      const percentComplete = Math.min(100, Math.floor((this.elapsed / totalTime) * 100))

      // Only update if percentage has changed
      if (percentComplete > this.lastReportedPercent) {
        // Find the appropriate message based on current percentage
        let message = steps[0].message

        // Check if we need to move to the next step
        while (this.currentStepIndex < steps.length - 1
          && percentComplete >= steps[this.currentStepIndex + 1].percent) {
          this.currentStepIndex++
        }

        message = steps[this.currentStepIndex].message

        // Report the actual percentage while keeping the message from the step
        this.updateProgress(percentComplete, message)
        this.lastReportedPercent = percentComplete

        // Check if complete
        if (percentComplete >= 100) {
          this.stop()
        }
      }
    }, interval)

    return this
  }

  stop(triggerCompletion = true): this {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }

    if (this.isRunning && triggerCompletion && !this.failed) {
      const completionMessage = this.settings.completionMessage || 'Complete'
      this.updateProgress(100, completionMessage)
      this.settings.onComplete?.()
    }

    this.isRunning = false
    return this
  }

  fail(message = 'Process failed'): this {
    this.failed = true

    // Calculate current percent
    const totalTime = this.settings.totalTime || 40000
    const percentComplete = Math.min(95, Math.floor((this.elapsed / totalTime) * 100))

    this.updateProgress(percentComplete, message)
    this.settings.onError?.(message)
    this.stop(false)
    return this
  }

  private updateProgress(percent: number, message: string): void {
    if (this.settings.onProgress) {
      this.settings.onProgress(percent, message)
    }
  }
}
