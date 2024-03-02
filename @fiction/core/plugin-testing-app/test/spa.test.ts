import type http from 'node:http'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import type { Browser, Page } from 'playwright'
import { chromium } from 'playwright'
import { createTestUtilServices } from '../../test-utils/init'
import { FictionTestingApp } from '..'

let server: http.Server | undefined
let browser: Browser | undefined
let page: Page | undefined
const port = 1234
describe('spa test app server', () => {
  beforeAll(async () => {
    const testUtils = createTestUtilServices()
    const testingApp = new FictionTestingApp({
      fictionEnv: testUtils.fictionEnv,
      port,
      head: `<meta name="author" content="John Doe">`,
    })
    server = await testingApp.createApp()
    browser = await chromium.launch()
    page = await browser?.newPage()
  })
  afterAll(async () => {
    server?.close()
    await browser?.close()
  })
  it('runs server', async () => {
    await page?.goto(`http://localhost:${port}`)
    const ht = await page?.content()
    expect(server).toBeDefined()

    expect(ht).toContain('John Doe')
    expect(ht?.length).toBeGreaterThan(100)
  })
})
