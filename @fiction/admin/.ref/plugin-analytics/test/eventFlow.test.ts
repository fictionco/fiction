import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type {
  KaptionTestUtils,
} from '@kaption/core/test-utils'
import {
  createKaptionTestUtils,
} from '@kaption/core/test-utils'
import { safeDirname, waitFor } from '@factor/api'
import type { KaptionEvent } from '@kaption/client'
import type { Browser, BrowserContext, Page } from 'playwright'
import { chromium } from 'playwright'

let browser: Browser | undefined
let page: Page | undefined
let browserContext: BrowserContext
let testUtils: KaptionTestUtils
const events = [] as KaptionEvent[]
const testId = 'eventFlow'
let projectId: string | undefined
describe('analytics event flow', () => {
  beforeAll(async () => {
    testUtils = await createKaptionTestUtils({
      initialize: true,
      cwd: safeDirname(import.meta.url),
      testId,
      headless: true,
    })

    projectId = testUtils.initialized?.project.projectId

    if (!projectId)
      throw new Error('no project id')
    const projectIds = [projectId]

    const promises = [
      testUtils.kaptionTag.tagStaticServer({
        tagSettings: { onlyTags: ['analytics'], throttleMs: 20 },
        projectIds,
      }),
      testUtils.kaptionTag.launchExampleApp(projectIds),
      testUtils.kaptionBeacon.createBeaconServer(),
    ]

    await Promise.all(promises)

    browser = await chromium.launch({ slowMo: 300, headless: true })
    browserContext = await browser.newContext()
    page = await browserContext?.newPage()
  }, 20_000)
  afterAll(async () => {
    testUtils.close()
    await browser?.close()
  })

  it('should send events to the beacon', async () => {
    const url = testUtils.kaptionTag.testAppUrl
    await testUtils.kaptionCache.subscribe(
      `events-${testId}`, // changed from 'events' in testUtils
      async (params): Promise<void> => {
        const { data } = params

        const newEvents = data as KaptionEvent[]

        events.push(...newEvents)
      },
    )

    const errorLogs: string[] = []
    page?.on('console', (message) => {
      if (message.type() === 'error')
        errorLogs.push(message.text())
    })

    page?.on('pageerror', (err) => {
      errorLogs.push(err.message)
    })

    console.log('going to', url.value)
    await page?.goto(url.value)

    const ht = await page?.content()
    expect(ht?.length).toBeGreaterThan(100)

    await page?.click('#wrap-5')
    await page?.click('#wrap-6')
    await page?.click('#wrap-7')
    await page?.click('#wrap-8')

    await page?.click('#link-tour')

    await waitFor(1000)

    await page?.click('#link-home')

    const strangeErrors = errorLogs.filter(_ => !_.includes('404'))

    if (strangeErrors.length) {
      console.error('errors', errorLogs)
      strangeErrors.forEach(e => console.error(e))
    }

    await page?.close({ runBeforeUnload: true })

    page = await browserContext?.newPage()

    await page?.goto(url.value)

    await waitFor(2000)

    expect(strangeErrors.length).toBe(0)

    await page?.click('#link-error')

    await waitFor(500)

    expect(events.map(e => e.event)).toEqual(
      expect.arrayContaining(['stat', 'view', 'click']),
    )

    const allSetEqual = (arr: string[]) => arr.every(v => v && v === arr[0])

    expect(allSetEqual(events.map(e => e.anonymousId))).toBeTruthy()

    const userAgentEqual = allSetEqual(
      events.map(e => e.context?.userAgent || ''),
    )
    expect(userAgentEqual).toBeTruthy()
  }, 20_000)
})
