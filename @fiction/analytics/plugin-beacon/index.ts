import type http from 'node:http'
import type { EndpointResponse, FictionPluginSettings } from '@fiction/core'
import { FictionPlugin, WriteBuffer, createExpressApp, dayjs, deepMerge, getRequestIpAddress, log, vue } from '@fiction/core'

import type express from 'express'
import type { FictionCache } from '@fiction/core/plugin-cache'
import type { FictionEvent } from '../tracking.js'
import type { FictionClickHouse } from '../plugin-clickhouse/index.js'
import { eventsTable, sessionsTable } from '../tables.js'
import type { SessionTimers } from './session.js'
import { SessionManager } from './session.js'

export * from '../tables.js'

type FictionBeaconSettings = {
  isLive?: vue.Ref<boolean>
  sessionPort: number
  sessionUrlLive?: string
  beaconPort: number
  beaconUrlLive?: string
  eventsPubSubId?: string
  fictionCache: FictionCache
  fictionClickHouse: FictionClickHouse
} & FictionPluginSettings & SessionTimers

export class FictionBeacon extends FictionPlugin<FictionBeaconSettings> {
  sessionUrlLocal = `http://localhost:${this.settings.sessionPort}`
  sessionUrlLive = this.settings.sessionUrlLive || this.sessionUrlLocal
  sessionUrl = vue.computed(() => {
    const isLive = this.settings.isLive?.value ?? false
    return isLive ? this.sessionUrlLive : this.sessionUrlLocal
  })

  beaconPort = this.settings.beaconPort
  beaconUrlLocal = `http://localhost:${this.beaconPort}`
  beaconUrlLive = this.settings.beaconUrlLive || this.beaconUrlLocal
  beaconUrl = vue.computed(() => {
    const isLive = this.settings.isLive?.value ?? false
    return isLive ? this.beaconUrlLive : this.beaconUrlLocal
  })

  beaconServer?: http.Server
  /**
   * Compiles and orchestrates session data from raw events
   */
  sessionManager?: SessionManager

  eventsPubSubId = this.settings.eventsPubSubId || 'events'
  /**
   * Buffer events picked up in http server
   */
  trackingBuffer = new WriteBuffer<FictionEvent>({
    flush: (events: FictionEvent[]) => {
      this.log.info(`events`, { data: { events: events.length } })
      this.sessionManager?.processBuffer.batch(events)
    },
    maxSeconds: 1,
  })

  constructor(settings: FictionBeaconSettings) {
    super('beacon', settings)

    this.settings.fictionClickHouse.tables.push(eventsTable, sessionsTable)

    if (!this.fictionEnv.isApp.value)
      this.sessionManager = new SessionManager(this.settings)
  }

  /**
   * Run both endpoint and event stream manager
   * Should restart servers/subs if run multiple times
   */
  async dev() {
    await this.runSessionManager()
    await this.createBeaconServer()
  }

  /**
   * Run the session manager which listens to process events
   * Allow for settings so session duration, etc can be configured based
   * on command
   */
  async runSessionManager() {
    if (!this.sessionManager)
      throw new Error('no session manager')

    this.sessionManager.runExpiryCheck()

    const app = createExpressApp()
    app.use('/', (request, response) => response.status(200).send('ok').end())

    this.beaconServer = app.listen(this.settings.sessionPort, () => {
      this.log.info(`session manager @ ${this.sessionUrl.value}`, { port: this.settings.sessionPort })
    })
  }

  async createBeaconServer() {
    if (this.beaconServer)
      this.beaconServer.close()

    const app = createExpressApp()

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

    app.use('/', (request, response) => (response.status(200).send('ok').end()))

    this.beaconServer = app
      .listen(this.beaconPort, () => (this.log.info(`beacon server @ ${this.beaconUrl.value}`, { port: this.beaconPort })))
      .on('error', error => (this.log.error('listen error', { error })))
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

  saveNewRawEvents = (events: FictionEvent[]) => {
    this.trackingBuffer.batch(events)
  }

  handleRequest = async (
    request: express.Request,
  ): Promise<EndpointResponse<FictionEvent[]>> => {
    const dataParam = request.query.events as string

    let r: EndpointResponse<FictionEvent[]> = { status: 'error', data: undefined }
    if (dataParam) {
      try {
        const events = await this.parseRequestEvents(request)

        if (events) {
          this.saveNewRawEvents(events)

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
