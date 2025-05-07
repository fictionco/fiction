// ProgressTimer.ts
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
  onError?: () => void
  completionMessage?: string
}

export class ProgressTimer extends FictionObject<ProgressTimerSettings> {
  private timer: ReturnType<typeof setInterval> | null = null
  private currentStep = 0
  private startTime = 0
  private failed = false
  isRunning = false

  constructor(name = 'ProgressTimer', settings: ProgressTimerSettings = {}) {
    super(name, settings)
  }

  start(): this {
    this.stop()

    const steps = this.settings.steps || [
      { percent: 25, message: 'Starting process...' },
      { percent: 50, message: 'Processing data...' },
      { percent: 75, message: 'Almost there...' },
      { percent: 95, message: 'Finalizing...' }
    ]

    const totalTime = this.settings.totalTime || 40000
    this.currentStep = 0
    this.startTime = Date.now()
    this.failed = false
    this.isRunning = true

    // Report initial progress
    this.updateProgress(steps[0].percent, steps[0].message)

    this.timer = setInterval(() => {
      const elapsed = Date.now() - this.startTime
      const percentComplete = Math.min(100, Math.floor((elapsed / totalTime) * 100))

      // Find the appropriate step based on elapsed percentage
      let stepIndex = 0
      for (let i = 0; i < steps.length; i++) {
        if (percentComplete >= steps[i].percent) {
          stepIndex = i
        } else {
          break
        }
      }

      // Update if we've moved to a new step
      if (stepIndex !== this.currentStep) {
        this.currentStep = stepIndex
        this.updateProgress(steps[stepIndex].percent, steps[stepIndex].message)
      }

      // Check if process is complete
      if (percentComplete >= 100 || elapsed >= totalTime) {
        this.stop()
      } else {
        // Update progress for intermediate points
        this.updateProgress(percentComplete, steps[this.currentStep].message)
      }
    }, 250)

    return this
  }

  stop(): this {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null

      if (!this.failed) {
        this.updateProgress(100, this.settings.completionMessage || 'Complete')
        this.settings.onComplete?.()
      }
      this.isRunning = false
    }
    return this
  }

  fail(message = 'Process failed'): this {
    this.failed = true
    this.updateProgress(
      Math.min(95, this.calculateCurrentPercent()),
      message
    )
    this.settings.onError?.()
    this.stop()
    return this
  }

  private updateProgress(percent: number, message: string): void {
    this.settings.onProgress?.(percent, message)
  }

  private calculateCurrentPercent(): number {
    const totalTime = this.settings.totalTime || 40000
    const elapsed = Date.now() - this.startTime
    return Math.min(100, Math.floor((elapsed / totalTime) * 100))
  }
}
