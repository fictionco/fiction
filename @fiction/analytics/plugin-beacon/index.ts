import type { EndpointResponse } from '@fiction/core'
import type express from 'express'
import type http from 'node:http'
import type { FictionAnalytics, FictionAnalyticsSettings } from '../index.js'
import type { FictionClickHouse } from '../plugin-clickhouse/index.js'
import type { FictionEvent } from '../typesTracking.js'
import { createExpressApp, dayjs, deepMerge, FictionPlugin, getRequestIpAddress, vue } from '@fiction/core'
import { addExpressHealthCheck } from '@fiction/core/utils/serverHealth.js'

import { checkForExpiredSessions, processAndSaveEvents } from './utils/session.js'

export * from '../tables.js'

export type FictionBeaconSettings = {
  fictionAnalytics: FictionAnalytics
  fictionClickHouse: FictionClickHouse
} & FictionAnalyticsSettings

export class FictionBeacon extends FictionPlugin<FictionBeaconSettings> {
  beaconPort = this.settings.beaconPort
  beaconUrlLocal = `http://localhost:${this.beaconPort}`
  beaconUrlLive = this.settings.beaconUrlLive || this.beaconUrlLocal
  beaconUrl = vue.computed(() => {
    const isLive = this.settings.fictionEnv.isProd?.value ?? false
    return isLive ? this.beaconUrlLive : this.beaconUrlLocal
  })

  beaconServer?: http.Server

  constructor(settings: FictionBeaconSettings) {
    super('beacon', settings)
  }

  /**
   * Run both endpoint and event stream manager
   * Should restart servers/subs if run multiple times
   */
  async init() {
    if (this.fictionEnv.isProd?.value) {
      if (!this.beaconUrl.value.includes('https')) {
        throw new Error(`Beacon server should be running on https in live mode (${this.beaconUrl.value})`)
      }
    }

    this.sessionExpiryInit()
    return await this.createBeaconServer()
  }

  sessionExpiryInit() {
    if (this.fictionEnv.isApp.value)
      return

    const fictionAnalytics = this.settings.fictionAnalytics

    const inter = setInterval(async () => (checkForExpiredSessions({ fictionAnalytics })), fictionAnalytics.checkExpiredIntervalMs)

    inter.unref() // don't keep process alive

    this.fictionEnv.events.on('cleanup', () => clearInterval(inter))
  }

  async createBeaconServer() {
    if (this.beaconServer)
      this.beaconServer.close()

    const id = 'beaconServer'

    const app = createExpressApp({ id })

    app.use('/events', async (request, response) => {
      const r = await this.handleRequest(request)

      response.status(200).json(r).end()
    })

    /**
     * Sent from image/pixel, don't return data as it will create errors in client
     */
    app.use('/pixel', async (request, response) => {
      await this.handleRequest(request)
      response.status(200).end()
    })
    /**
     * Endpoint for debug telemetry from client browsers
     */
    app.use('/debug', async (request, response) => {
      const dataParam = request.query.events as string
      try {
        const events = await this.parseRequestEvents(request)

        events.forEach((event) => {
          const { properties, message } = event
          this.log.error(`client error: ${message ?? 'no message'}`, { data: properties })
        })
      }
      catch (error) {
        this.log.error('debug tracking data', { data: { dataParam }, error: error as Error })
      }

      response.status(200).end()
    })

    addExpressHealthCheck({ expressApp: app, id })

    app.use('/', (request, response) => { response.status(200).send('ok').end() })

    this.beaconServer = await new Promise(async (resolve, reject) => {
      const s = app.listen(this.beaconPort, () => resolve(s)).on('error', error => reject(error))
    })

    const beaconUrl = this.beaconUrl.value
    const port = this.beaconPort

    const config = { beaconUrl, port, health: `${beaconUrl}/health` }
    this.log.info(`[start] Beacon Event Server`, { data: config })

    return { ...config, server: this.beaconServer }
  }

  async close() {
    if (this.beaconServer)
      this.beaconServer.close()
  }

  parseRequestEvents = async (request: express.Request): Promise<FictionEvent[]> => {
    const { headers } = request

    const dataParam = request.query.events as string
    const events = JSON.parse(dataParam) as FictionEvent[]

    const { 'user-agent': userAgent = '' } = headers

    const { ip, rawIp } = await getRequestIpAddress(request, {})

    const timestampIso = dayjs().toISOString()
    const serverData: Partial<FictionEvent> = { context: { ip, rawIp, userAgent }, timestamp: timestampIso, receivedAt: timestampIso }

    const mergedEvents: FictionEvent[] = events.map((d) => {
      const m = deepMerge<FictionEvent>([serverData, d])
      m.event = m.event ?? m.type
      return m
    })

    return mergedEvents
  }

  handleRequest = async (request: express.Request): Promise<EndpointResponse<FictionEvent[]>> => {
    const dataParam = request.query.events as string

    let r: EndpointResponse<FictionEvent[]> = { status: 'error', data: undefined }
    if (dataParam) {
      try {
        const events = await this.parseRequestEvents(request)

        if (events) {
          await processAndSaveEvents({ events, fictionAnalytics: this.settings.fictionAnalytics })

          r = { status: 'success', data: events }
        }
      }
      catch (error: unknown) {
        this.log.error('batch tracking data', { data: dataParam, error })
      }
    }

    return r
  }
}
