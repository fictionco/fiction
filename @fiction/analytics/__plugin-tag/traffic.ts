import type { FictionPluginSettings, vue } from '@fiction/core'
import { FictionPlugin, dayjs, objectId, randomBetween, waitFor } from '@fiction/core'
import type { Browser } from 'playwright'
import type { faker } from '@faker-js/faker'
import { ANON_ID_KEY } from '@fiction/core/utils/anon.js'
import type { FictionTestingApp } from '@fiction/core/plugin-testing-app'
import { ReferrerUtility } from '../plugin-beacon/utils/referrer'

type FictionTrafficGeneratorSettings = {
  factorTestingApp: FictionTestingApp
  isLive?: vue.Ref<boolean>
} & FictionPluginSettings

export class FictionTrafficGenerator extends FictionPlugin<FictionTrafficGeneratorSettings> {
  factorTestingApp = this.settings.factorTestingApp
  browser!: Browser
  faker!: typeof faker
  isLive? = this.settings.isLive
  initialized: Promise<void> = Promise.resolve()
  intervalId?: NodeJS.Timeout
  visitorId: number = 0
  referrer = new ReferrerUtility()
  dayOfWeek = dayjs().day()
  speed = this.dayOfWeek > 4 ? 30 : 50
  maxActions = this.dayOfWeek > 4 ? 14 : 20
  minActions = 1
  contextCount = 0
  lastRunAt?: dayjs.Dayjs
  constructor(settings: FictionTrafficGeneratorSettings) {
    super('traffic', settings)
  }

  async newFakeUser(params: { entryUrl: string }) {
    const visitingUrl = new URL(params.entryUrl)

    /**
     * Set cookies manually so we can simulate returning sessions
     */
    const maybeReturning = this.visitorId % 3 === 0
    const anonymousId = maybeReturning
      ? `returning-${randomBetween(1, 10)}`
      : objectId()

    const { context, userAgent, viewport, locale }
      = await this.factorTestingApp.newContext(
        { random: true },
        {
          storageState: {
            cookies: [
              {
                name: ANON_ID_KEY,
                value: anonymousId,
                path: '/',
                domain: visitingUrl.hostname,
                sameSite: 'Lax',
                expires: dayjs().add(365, 'day').unix(),
                secure: false,
                httpOnly: false,
              },
            ],
            origins: [
              {
                origin: visitingUrl.origin,
                localStorage: [{ name: ANON_ID_KEY, value: anonymousId }],
              },
            ],
          },
        },
      )
    this.contextCount++

    const page = await context.newPage()

    return {
      context,
      page,
      userAgent,
      anonymousId,
      viewport,
      locale,
    }
  }

  getFullUrl(entryUrl: string) {
    const url = new URL(entryUrl)

    let referrer = ''
    if (this.visitorId % 3 === 0) {
      referrer = this.referrer.getRandomReferrerDomain()
      url.searchParams.set('referrer', referrer)
    }

    let utmCampaign = ''
    if (this.visitorId % 4 === 0) {
      const c = ['campaign1', 'campaign2', 'sale1', 'sale2']
      utmCampaign = c[Math.floor(Math.random() * c.length)]
      url.searchParams.set('utm_campaign', utmCampaign)
    }

    let utmMedium = ''
    if (this.visitorId % 6 === 0) {
      const c = ['video', 'ppc', 'media', 'content']
      utmMedium = c[Math.floor(Math.random() * c.length)]
      url.searchParams.set('utm_medium', utmMedium)
    }

    return { url: url.toString(), referrer, utmCampaign, utmMedium }
  }

  async visit(params: { entryUrl: string }) {
    const { entryUrl } = params
    this.visitorId++

    const { url, referrer, utmCampaign, utmMedium } = this.getFullUrl(entryUrl)

    const { page, userAgent, anonymousId, viewport, locale, context }
      = await this.newFakeUser(params)

    const visitorProfile = {
      visitorId: this.visitorId,
      userAgent,
      anonymousId,
      viewport,
      locale,
      referrer,
      utmCampaign,
      utmMedium,
      nextVisitorIn: randomBetween(this.speed * 100, this.speed * 400),
    }

    try {
      this.log.info(
        `new generated visit (visitId: ${this.visitorId}/${this.contextCount})`,
        {
          data: { visitorProfile, goto: url },
        },
      )
      await page.goto(url)

      const times = randomBetween(this.minActions, this.maxActions)

      for (let i = 0; i < times; i++) {
        await waitFor(randomBetween(this.speed * 5, this.speed * 30))

        await page.evaluate(
          async (args) => {
            const els = document.querySelectorAll('a')

            const rand = Math.floor(Math.random() * els.length)
            const elId = els[rand].id

            if (!elId)
              return

            const sel = `#${elId}`
            const el = document.querySelector(sel)
            el?.scrollIntoView({ behavior: 'smooth' })

            const e = new Event('touchstart')
            el?.dispatchEvent(e)

            const rect = el?.getBoundingClientRect()

            const clk = args.i % 4 === 0

            const rando = (
              min: number,
              max: number,
              decimalPlaces = 0,
            ): number => {
              const rand = Math.random() * (max - min) + min
              const power = 10 ** decimalPlaces
              return Math.floor(rand * power) / power
            }

            const position = {
              x: rando(rect?.left || 0, rect?.right || 10),
              y: rando(rect?.top || 0, rect?.bottom || 10),
            }

            if (clk && el) {
              const ev = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                screenX: position.x,
                screenY: position.y,
              })

              const pel = document.elementFromPoint(position.x, position.y)

              pel?.dispatchEvent(ev)
            }

            return sel
          },
          { i },
        )
      }

      await context.close()

      this.contextCount--
      this.log.info(
        `closing context (visitId: ${this.visitorId}/${this.contextCount})`,
      )
      await this.factorTestingApp.browser?.close()
      this.lastRunAt = dayjs()
    }
    catch (error) {
      this.log.warn(
        `playwright activity warning (visitId: ${this.visitorId}/${this.contextCount})`,
        {
          error,
        },
      )

      await context.close()
      this.contextCount--
      await this.factorTestingApp.browser?.close()
    }

    return visitorProfile
  }

  async recursiveVisitLoop(params: { entryUrl: string }) {
    this.log.info('Playwright Loop')
    try {
      let waitForNext = 30_000
      if (this.contextCount <= 10) {
        const profile = await this.visit(params)
        waitForNext = profile.nextVisitorIn
      }

      await waitFor(waitForNext)

      this.recursiveVisitLoop(params).catch(console.error)
    }
    catch (error) {
      this.log.warn(
        `playwright error (visitId: ${this.visitorId}/${this.contextCount})`,
        {
          error,
        },
      )
    }
  }

  async run(params: { entryUrl: string }) {
    await this.initialized

    await this.recursiveVisitLoop(params)

    if (this.isLive?.value) {
      // close and trigger health check restart if it hasn't ran in over 5 minutes
      this.intervalId = setInterval(async () => {
        if (this.lastRunAt) {
          const diff = Math.abs(
            dayjs().diff(this.lastRunAt, 'minute'),
          )
          if (diff > 5) {
            this.log.error(
              'closing server to force restart, playwright has not run in over 5 minutes',
            )
            await this.factorTestingApp?.close()
          }
        }
      }, 30_000)
    }
  }

  async close() {
    if (this.browser)
      await this.browser.close()
    if (this.intervalId)
      clearInterval(this.intervalId)
  }
}
