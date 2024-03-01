import type http from 'node:http'
import type {
  EndpointResponse,
  express,
  vue,
} from '@factor/api'
import {
  WriteBuffer,
  createExpressApp,
  deepMerge,
  getRequestIpAddress,
  log,
} from '@factor/api'
import type { KaptionEvent } from '@kaption/client/types'
import type { TSchema } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import type { KaptionPluginSettings } from '../utils'
import { KaptionPlugin } from '../utils'
import type { KaptionCache } from '../plugin-cache'
import type { KaptionClickHouse } from '../plugin-clickhouse'
import type { SessionTimers } from './session'
import { SessionManager } from './session'
import { eventsTable, sessionsTable } from './tables'
import type { KaptionEventOps } from './ops'

export * from './tables'

type KaptionBeaconSettings = {
  isLive?: vue.Ref<boolean>
  sessionPort: number
  sessionUrlLive?: string
  beaconPort: number
  beaconUrlLive?: string
  eventsPubSubId?: string
  kaptionEventOps: KaptionEventOps
  kaptionCache: KaptionCache
  kaptionClickHouse: KaptionClickHouse
} & KaptionPluginSettings &
SessionTimers

export class KaptionBeacon extends KaptionPlugin<KaptionBeaconSettings> {
  kaptionEventOps = this.settings.kaptionEventOps
  kaptionCache = this.settings.kaptionCache
  kaptionClickHouse = this.settings.kaptionClickHouse
  sessionPort = this.settings.sessionPort
  sessionUrlLocal = `http://localhost:${this.sessionPort}`
  sessionUrlLive = this.settings.sessionUrlLive || this.sessionUrlLocal
  sessionUrl = this.utils.vue.computed(() => {
    const isLive = this.settings.isLive?.value ?? false
    return isLive ? this.sessionUrlLive : this.sessionUrlLocal
  })

  beaconPort = this.settings.beaconPort
  beaconUrlLocal = `http://localhost:${this.beaconPort}`
  beaconUrlLive = this.settings.beaconUrlLive || this.beaconUrlLocal
  beaconUrl = this.utils.vue.computed(() => {
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
  trackingBuffer = new WriteBuffer<KaptionEvent>({
    flush: (events: KaptionEvent[]) => {
      this.log.info(`events`, { data: { events: events.length } })
      this.kaptionCache.publish(this.eventsPubSubId, events)
    },
    maxSeconds: 1,
  })

  constructor(settings: KaptionBeaconSettings) {
    super('beacon', settings)

    const tbls = [eventsTable, sessionsTable]
    this.factorDb.addTables(tbls)
    this.kaptionClickHouse.addTables([eventsTable, sessionsTable])
    this.addSchema()

    if (!this.factorEnv.isApp.value)
      this.sessionManager = new SessionManager(this.settings)
  }

  addSchema() {
    this.factorEnv?.addHook({
      hook: 'staticSchema',
      callback: async (existing) => {
        const list: Record<string, TSchema> = {}
        sessionsTable.columns.forEach((c) => {
          const numberSet = new Set([
            'UInt32',
            'Float32',
            'UInt16',
            'Int8',
            'UInt8',
            'Decimal(9,6)',
            'Decimal(8,6)',
          ])
          list[c.key] = numberSet.has(c.clickHouseType)
            ? Type.Number()
            : Type.String()
        })

        const sessionType = Type.Object(list)

        return {
          ...existing,
          sessionFields: sessionType,
        }
      },
    })
  }

  setup() {}
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

    this.kaptionEventOps.runJobs()

    this.sessionManager.runExpiryCheck()

    await this.kaptionCache.subscribe(
      this.eventsPubSubId,
      async (params): Promise<void> => {
        const { messageId, data } = params

        const handled = await this.kaptionCache.messageIsHandled(messageId)

        if (handled)
          return

        const events = data as KaptionEvent[]

        this.sessionManager?.processBuffer.batch(events)
      },
    )

    const app = createExpressApp()
    app.use('/', (request, response) => {
      response.status(200).send('ok').end()
    })

    this.beaconServer = app.listen(this.sessionPort, () => {
      this.log.info(`session manager @ ${this.sessionUrl.value}`, {
        port: this.sessionPort,
      })
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
          log.l({
            level: 'error',
            context: 'http:debug',
            description: `client error: ${message ?? 'no message'}`,
            data: properties,
          })
        })
      }
      catch (error) {
        this.log.error('debug tracking data', {
          data: { dataParam },
          error: error as Error,
        })
      }

      response.status(200).end()
    })

    app.use('/', (request, response) => {
      response.status(200).send('ok').end()
    })

    this.beaconServer = app
      .listen(this.beaconPort, () => {
        this.log.info(`beacon server @ ${this.beaconUrl.value}`, {
          port: this.beaconPort,
        })
      })
      .on('error', (error) => {
        this.log.error('listen error', { error })
      })
  }

  async close() {
    if (this.beaconServer)
      this.beaconServer.close()
  }

  parseRequestEvents = async (
    request: express.Request,
  ): Promise<KaptionEvent[]> => {
    const { headers } = request

    const dataParam = request.query.events as string
    const events = JSON.parse(dataParam) as KaptionEvent[]

    const { 'user-agent': userAgent = '' } = headers

    const { ip, rawIp } = await getRequestIpAddress(request, {})

    const timestampIso = this.utils.dayjs().toISOString()
    const serverData: Partial<KaptionEvent> = {
      context: { ip, rawIp, userAgent },
      timestamp: timestampIso,
      receivedAt: timestampIso,
    }

    const mergedEvents: KaptionEvent[] = events.map((d) => {
      const m = deepMerge<KaptionEvent>([serverData, d])
      m.event = m.event ?? m.type
      return m
    })

    return mergedEvents
  }

  saveNewRawEvents = (events: KaptionEvent[]) => {
    this.trackingBuffer.batch(events)
  }

  handleRequest = async (
    request: express.Request,
  ): Promise<EndpointResponse<KaptionEvent[]>> => {
    const dataParam = request.query.events as string

    let r: EndpointResponse<KaptionEvent[]> = {
      status: 'error',
      data: undefined,
    }
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
