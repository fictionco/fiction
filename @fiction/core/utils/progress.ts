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
  timer: ReturnType<typeof setInterval> | null = null
  startTime = 0
  elapsed = 0
  failed = false
  isRunning = false
  lastReportedPercent = 0
  currentStepIndex = 0
  steps = this.settings.steps || [
    { percent: 25, message: 'Starting process...' },
    { percent: 50, message: 'Processing data...' },
    { percent: 75, message: 'Almost there...' },
    { percent: 100, message: 'Complete' },
  ]

  totalTime = this.settings.totalTime || 40000

  constructor(name = 'ProgressTimer', settings: ProgressTimerSettings = {}) {
    super(name, settings)
  }

  start(args?: { steps?: ProgressStep[], totalTime?: number }): this {
    const { steps, totalTime } = args || {}
    this.steps = steps || this.steps
    this.totalTime = totalTime || this.totalTime

    // Clear any existing timer
    this.stop(false)

    this.startTime = Date.now()
    this.elapsed = 0
    this.failed = false
    this.isRunning = true
    this.lastReportedPercent = 0
    this.currentStepIndex = 0

    // Report initial step immediately with its configured percentage
    if (this.steps.length > 0) {
      this.updateProgress(this.steps[0].percent, this.steps[0].message)
      this.lastReportedPercent = this.steps[0].percent
    }

    const interval = Math.max(50, this.totalTime / 100) // At least 50ms to avoid excessive updates

    // Create the timer to update progress
    this.timer = setInterval(() => {
      if (!this.isRunning)
        return

      this.elapsed += interval

      // Calculate current percentage based on elapsed time
      const timePercent = Math.min(100, (this.elapsed / this.totalTime) * 100)

      // Find the appropriate step for current time percentage
      let targetStepIndex = 0
      for (let i = 0; i < this.steps.length; i++) {
        // Use the step percentage as the threshold
        if (timePercent >= this.steps[i].percent) {
          targetStepIndex = i
        }
      }

      // Update to new step if we've progressed
      if (targetStepIndex > this.currentStepIndex) {
        this.currentStepIndex = targetStepIndex
        const currentStep = this.steps[this.currentStepIndex]

        this.updateProgress(currentStep.percent, currentStep.message)
        this.lastReportedPercent = currentStep.percent
      }

      // Check if complete
      if (timePercent >= 100) {
        this.stop()
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

    // Calculate current percent based on elapsed time
    const timePercent = Math.min(95, (this.elapsed / this.totalTime) * 100)

    this.updateProgress(timePercent, message)
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
