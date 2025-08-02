/* eslint-disable no-console */
import process from 'node:process'

// Custom Vitest reporter for debugging hanging tests
export default class DebugReporter {
  constructor() {
    this.startTime = Date.now()
    this.runningTests = new Map()
    this.completedTests = new Set()
    this.failedTests = new Set()

    // Monitor for hanging tests every 30 seconds
    this.hangingTestsTimer = setInterval(() => {
      this.checkForHangingTests()
    }, 30000)

    // Log progress every 10 seconds
    this.progressTimer = setInterval(() => {
      this.logProgress()
    }, 10000)
  }

  onInit(ctx) {
    console.log(`🧪 Test debugging enabled - PID: ${process.pid}`)
    console.log(`📊 Max concurrency: ${ctx.config.maxConcurrency}`)
    console.log(`⏱️  Test timeout: ${ctx.config.testTimeout}ms`)
    console.log(`🔧 Hook timeout: ${ctx.config.hookTimeout}ms`)
  }

  onTaskUpdate(packs) {
    for (const p of packs) {
      const result = p[1]
      const task = result.task || result

      if (task.type === 'test') {
        if (task.mode === 'run' && task.result?.state === 'running') {
          this.runningTests.set(task.id, {
            name: task.name,
            file: task.file?.name || 'unknown',
            startTime: Date.now(),
          })
        }
        else if (task.result?.state === 'pass') {
          this.runningTests.delete(task.id)
          this.completedTests.add(task.id)
          console.log(`✅ ${task.file?.name}: ${task.name} (${task.result.duration}ms)`)
        }
        else if (task.result?.state === 'fail') {
          this.runningTests.delete(task.id)
          this.failedTests.add(task.id)
          console.log(`❌ ${task.file?.name}: ${task.name} - ${task.result.errors?.[0]?.message || 'Unknown error'}`)
        }
      }
    }
  }

  checkForHangingTests() {
    const now = Date.now()
    const hangingThreshold = 45000 // 45 seconds

    for (const x of this.runningTests.entries()) {
      const test = x[1]
      const runtime = now - test.startTime
      if (runtime > hangingThreshold) {
        console.log(`⚠️  POTENTIAL HANGING TEST (${Math.round(runtime / 1000)}s): ${test.file} -> ${test.name}`)

        // Show active handles/timers that might be keeping process alive
        if (process._getActiveHandles && process._getActiveRequests) {
          console.log(`🔍 Active handles: ${process._getActiveHandles().length}`)
          console.log(`🔍 Active requests: ${process._getActiveRequests().length}`)
        }
      }
    }
  }

  logProgress() {
    const totalRuntime = Math.round((Date.now() - this.startTime) / 1000)
    console.log(`📈 Progress: ${this.completedTests.size} passed, ${this.failedTests.size} failed, ${this.runningTests.size} running (${totalRuntime}s total)`)

    if (this.runningTests.size > 0) {
      console.log(`🏃 Currently running:`)
      for (const test of this.runningTests.values()) {
        const runtime = Math.round((Date.now() - test.startTime) / 1000)
        console.log(`   - ${test.file}: ${test.name} (${runtime}s)`)
      }
    }
  }

  onFinished(files, errors) {
    clearInterval(this.hangingTestsTimer)
    clearInterval(this.progressTimer)

    const totalTime = Math.round((Date.now() - this.startTime) / 1000)
    console.log(`🏁 Tests completed in ${totalTime}s`)

    if (this.runningTests.size > 0) {
      console.log(`⚠️  ${this.runningTests.size} tests were still running when suite finished:`)
      for (const test of this.runningTests.values()) {
        console.log(`   - ${test.file}: ${test.name}`)
      }
    }

    if (errors?.length > 0) {
      console.log(`💥 Suite errors:`, errors)
    }
  }
}
