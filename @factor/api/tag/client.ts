import dayjs from 'dayjs'
import { emitEvent } from '../utils/event'
import type { EndpointResponse } from '../types'
import { objectId } from '../utils/id'
import { deepMerge } from '../utils/obj'
import { WriteBuffer } from '../utils/buffer'
import type { LogHelper } from '../plugin-log'
import { log } from '../plugin-log'
import { UnloadUtility } from '../utils-analytics/tracking'
import { getAnonymousId } from '../utils/anon'
import { baseBrowserEvent } from './utils'
import type { IdentifyTraitsUser, TrackingEvent, TrackingEventUserDefined, TrackingProperties } from './types'

export * from './types'

interface ClientRequestOptions {
  sync?: boolean
}

type KaptionResponse = EndpointResponse<TrackingEvent>

export type GenType = 'internal' | 'core' | 'user'

export interface FactorClientSettings {
  orgId: string
  namespace: string
  intervalSeconds?: number
  gen?: GenType
  beaconUrl?: string
}

export class FactorClient extends WriteBuffer<TrackingEvent> {
  orgId: string
  anonymousId = getAnonymousId().anonymousId
  beaconUrl?: string
  pixelPath = '/pixel'
  trackPath = '/events'
  namespace: string
  intervalSeconds: number
  log: LogHelper
  gen: GenType
  constructor(settings: FactorClientSettings) {
    super({ limit: 5, maxSeconds: settings.intervalSeconds })

    this.namespace = settings.namespace || 'FactorNamespace'
    this.orgId = settings.orgId
    this.gen = settings.gen || 'user'
    this.log = log.contextLogger(this.namespace)

    this.intervalSeconds = settings.intervalSeconds || 2
    this.beaconUrl = settings.beaconUrl
    this.log.debug('new client created', { data: this })

    // on page unload, clear events
    UnloadUtility.onUnload(() => this.unload())
  }

  // override of empty WriteBuffer function
  protected flush(events: TrackingEvent[]): void {
    return this.transmitSync({ events })
  }

  public unload(): void {
    this.flushBuffer()
  }

  getQueryArgs(params: { events: TrackingEvent[] }): string {
    const { events } = params
    const args = new URLSearchParams()
    args.set('events', JSON.stringify(events))
    args.set('orgId', this.orgId)

    if (typeof window !== 'undefined' && window.factorIsFake)
      args.set('isFake', '1')

    return args.toString()
  }

  private transmitSync(args: {
    events?: TrackingEvent[]
    endpoint?: string
    done?: () => void
    fail?: () => void
  }): void {
    const { events, done, fail, endpoint = this.pixelPath } = args
    const img = new Image()

    if (done)
      img.addEventListener('load', done)
    if (fail)
      img.addEventListener('error', fail)

    const baseUrl = `${this.beaconUrl}${endpoint}`

    if (events && events.length > 0) {
      const msg = `beacon(sync): ${events.length} events`
      const url = `${baseUrl}?${this.getQueryArgs({ events })}`
      img.src = url
      this.log.info(msg, { data: { url, events, baseUrl } })
    }
  }

  private async transmit(args: {
    events: TrackingEvent[]
    endpoint?: string
  }): Promise<KaptionResponse> {
    const { events } = args

    const baseUrl = `${this.beaconUrl}${this.trackPath}`

    if (events && events.length > 0) {
      const msg = `get(async): ${events.length} events`
      const url = `${baseUrl}?${this.getQueryArgs({ events })}`
      this.log.info(msg, { data: { url, events, baseUrl } })

      if (!fetch)
        throw new Error('FactorClient: fetch is not available')

      // methods and mode are same as default (GET/cors)
      // The keepalive option indicates that the request may “outlive” the webpage that initiated it.
      const r = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        keepalive: true,
      })

      const responseData = (await r.json()) as KaptionResponse

      return responseData
    }
    else { return { status: 'error', message: 'no response' } }
  }

  createTrackingEvent(eventData: TrackingEventUserDefined): TrackingEvent {
    const fullEventData = deepMerge([
      baseBrowserEvent({
        library: 'client',
        orgId: this.orgId,
      }),
      eventData,
      {
        sentAt: dayjs().toISOString(),
        messageId: objectId(),
        gen: this.gen,
      },
    ]) as TrackingEvent

    return fullEventData
  }

  event(
    userEvent: TrackingEventUserDefined,
    options?: ClientRequestOptions,
  ): Promise<KaptionResponse> | KaptionResponse {
    const { sync = false } = options || {}

    const fullEventData = this.createTrackingEvent(userEvent)

    this.emit('event', fullEventData, options)

    emitEvent('TrackingEvent', fullEventData)

    if (sync) {
      this.add(fullEventData)
      return { status: 'success' }
    }
    else {
      return this.transmit({ events: [fullEventData] })
    }
  }

  public async identify(
    traits: Partial<IdentifyTraitsUser>,
    options?: ClientRequestOptions,
  ): Promise<KaptionResponse>
  public async identify(
    userId: string,
    traits?: Partial<IdentifyTraitsUser>,
    options?: ClientRequestOptions,
  ): Promise<KaptionResponse>
  public async identify(
    userId: unknown,
    traits?: unknown,
    options?: ClientRequestOptions,
  ): Promise<KaptionResponse> {
    let _userId = ''
    let _options: ClientRequestOptions = {}
    let _traits: Partial<IdentifyTraitsUser> = {}
    if (typeof userId === 'string') {
      _traits = traits as Partial<IdentifyTraitsUser>
      _userId = userId
      _options = options as ClientRequestOptions
    }
    else {
      _traits = userId as Partial<IdentifyTraitsUser>
      _options = traits as ClientRequestOptions
      _userId = _traits.userId ?? ''
    }

    const { sync = false } = _options || {}
    const r = await this.event(
      {
        event: 'identify',
        type: 'identify',
        userId: _userId,
        traits: _traits as ClientRequestOptions,
      },
      { sync },
    )

    return r
  }

  public async group(
    groupId: string,
    traits?: Partial<IdentifyTraitsUser>,
    options?: ClientRequestOptions,
  ): Promise<KaptionResponse | void> {
    const { sync = false } = options || {}
    const r = await this.event(
      { event: 'group', type: 'group', groupId, traits },
      { sync },
    )

    return r
  }

  public async track(
    event: string,
    properties?: Partial<TrackingProperties>,
    options?: ClientRequestOptions,
  ): Promise<KaptionResponse | void> {
    const { sync = true } = options || {}
    const r = await this.event({ type: 'track', event, properties }, { sync })

    return r
  }

  public async capture(
    userEvent: TrackingEventUserDefined,
    options?: ClientRequestOptions,
  ): Promise<KaptionResponse | void> {
    const { sync = true } = options || {}
    const r = await this.event(userEvent, { sync })

    return r
  }

  public async page(
    properties?: Partial<TrackingProperties>,
    options?: ClientRequestOptions,
  ): Promise<KaptionResponse | void> {
    const { sync = true } = options || {}
    const r = await this.event(
      { type: 'page', event: 'view', properties },
      { sync },
    )

    return r
  }

  public async debug(
    message: string,
    properties?: Partial<TrackingProperties>,
  ): Promise<KaptionResponse | void> {
    const r = await this.track('debug', { message, properties })

    const fullEventData = this.createTrackingEvent({
      event: 'debug',
      type: 'debug',
      properties,
    })

    this.transmitSync({ events: [fullEventData], endpoint: '/debug' })

    return r
  }
}

export function createClient(args: {
  orgId: string
  namespace: string
}): FactorClient {
  const { orgId, namespace } = args
  return new FactorClient({ orgId, namespace })
}
