// setupTests.js
import process from 'node:process'
import { beforeAll, beforeEach } from 'vitest'

process.env.IS_TEST = '1'
process.env.TEST_ENV = 'unit'

const LOG_INTERVAL = 5 * 60 * 1000 // 5 minutes in milliseconds
const MAX_TEST_DURATION = 60 * 5 * 1000 // 1 hour max duration

beforeAll(async () => {
  process.env.TEST_RUN = '1'
  process.env.IS_TEST = '1'
  process.env.TEST_ENV = 'unit'
  process.env.POSTGRES_URL = 'http://test:test@localhost:5432/test'
  process.env.NODE_ENV = 'development'
  process.env.MODE = 'development'

  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true })
  }
})

beforeEach(async (testContext) => {
  const startTime = Date.now()

  // Function to check and log duration
  const checkDuration = () => {
    const elapsed = Date.now() - startTime
    const minutesElapsed = Math.floor(elapsed / 1000 / 60)

    if (elapsed >= LOG_INTERVAL && elapsed < MAX_TEST_DURATION) {
      console.warn(
        `[${new Date().toISOString()}] Test "${testContext.task.name}" has been running for ${minutesElapsed} minutes`,
      )
      // Schedule the next check
      const timeoutId = setTimeout(checkDuration, LOG_INTERVAL)
      timeoutId.unref() // Ensure this timer doesn’t keep the process alive
    }
    else if (elapsed >= MAX_TEST_DURATION) {
      console.warn(
        `[${new Date().toISOString()}] Test "${testContext.task.name}" exceeded ${MAX_TEST_DURATION / 60000} minutes!`,
      )
    }
  }

  // Start the first check after 5 minutes
  const timeoutId = setTimeout(checkDuration, LOG_INTERVAL)
  timeoutId.unref() // Unreference the initial timer
})
