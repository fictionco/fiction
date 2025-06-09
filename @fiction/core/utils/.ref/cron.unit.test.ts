// cronTool.test.ts
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { CronTool } from './cron.js' // Adjust the import path as needed

describe('cronTool', () => {
  let task: () => void
  let cronTool: CronTool
  let taskExecuted = false

  beforeEach(() => {
    taskExecuted = false
    task = () => {
      taskExecuted = true
    }
    cronTool = new CronTool('*/1 * * * * *', task) // Every 1 second
  })

  afterEach(() => {
    cronTool.close() // Ensure the cron job is stopped after each test
  })

  it('should execute the task when the cron job runs', async () => {
    await new Promise(resolve => setTimeout(resolve, 1500)) // Wait for 1.5 seconds
    expect(taskExecuted).toBe(true)
  })
})
