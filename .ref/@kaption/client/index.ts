import { emitEvent } from '@factor/api/utils/event'
import type { EndpointResponse } from '@factor/api/types'
import { deepMerge, objectId } from '@factor/api/utils/utils'
import dayjs from 'dayjs'
import { WriteBuffer } from '@factor/api/utils/buffer'
import { log } from '@factor/api/plugin-log'
import { UnloadUtility } from '@factor/api/utils-analytics/tracking'
import { baseBrowserEvent, getAnonymousId } from './config'
import type {
  IdentifyTraitsUser,
  KaptionEvent,
  KaptionEventUserDefined,
  TrackingProperties,
} from './types'

export * from './types'

interface ClientRequestOptions {
  sync?: boolean
}

type KaptionResponse = EndpointResponse<KaptionEvent>

export type GenType = 'internal' | 'core' | 'user'

export interface KaptionClientSettings {
  projectId: string
  intervalSeconds?: number
  gen?: GenType
  beaconUrl?: string
}

export class KaptionClient extends WriteBuffer<KaptionEvent> {
  projectId: string
  anonymousId = getAnonymousId().anonymousId
  beaconUrl?: string
  pixelPath = '/pixel'
  trackPath = '/events'
  intervalSeconds: number
  log = log.contextLogger('KaptionClient')
  gen: GenType
  constructor(settings: KaptionClientSettings) {
    super({ limit: 5, maxSeconds: settings.intervalSeconds })

    this.projectId = settings.projectId
    this.gen = settings.gen || 'user'

    this.intervalSeconds = settings.intervalSeconds || 2
    this.beaconUrl = settings.beaconUrl || `https://beacon.kaption.co`

    if (!this.beaconUrl)
      throw new Error('KaptionClient: no beaconUrl')
    if (!this.projectId)
      throw new Error('KaptionClient: no projectId')

    this.log.debug('new client created', { data: this })

    // on page unload, clear events
    UnloadUtility.onUnload(() => this.unload())
  }

  // override of empty WriteBuffer function
  protected flush(events: KaptionEvent[]): void {
    return this.transmitSync({ events })
  }

  public unload(): void {
    this.flushBuffer()
  }

  getQueryArgs(params: { events: KaptionEvent[] }): string {
    const { events } = params
    const args = new URLSearchParams()
    args.set('events', JSON.stringify(events))
    args.set('projectId', this.projectId)

    if (typeof window !== 'undefined' && window.kaptionIsFake)
      args.set('isFake', '1')

    return args.toString()
  }

  private transmitSync(args: {
    events?: KaptionEvent[]
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
    events: KaptionEvent[]
    endpoint?: string
  }): Promise<KaptionResponse> {
    const { events } = args

    const baseUrl = `${this.beaconUrl}${this.trackPath}`

    if (events && events.length > 0) {
      const msg = `get(async): ${events.length} events`
      const url = `${baseUrl}?${this.getQueryArgs({ events })}`
      this.log.info(msg, { data: { url, events, baseUrl } })

      if (!fetch)
        throw new Error('KaptionClient: fetch is not available')

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

  createKaptionEvent(eventData: KaptionEventUserDefined): KaptionEvent {
    const fullEventData = deepMerge([
      baseBrowserEvent({ library: 'client', projectId: this.projectId }),
      eventData,
      {
        sentAt: dayjs().toISOString(),
        messageId: objectId(),
        gen: this.gen,
      },
    ]) as KaptionEvent

    return fullEventData
  }

  event(
    userEvent: KaptionEventUserDefined,
    options?: ClientRequestOptions,
  ): Promise<KaptionResponse> | KaptionResponse {
    const { sync = false } = options || {}

    const fullEventData = this.createKaptionEvent(userEvent)

    this.emit('event', fullEventData, options)

    emitEvent('kaptionEvent', fullEventData)

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
    userEvent: KaptionEventUserDefined,
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

    const fullEventData = this.createKaptionEvent({
      event: 'debug',
      type: 'debug',
      properties,
    })

    this.transmitSync({ events: [fullEventData], endpoint: '/debug' })

    return r
  }
}

export function createClient(projectId: string): KaptionClient {
  return new KaptionClient({ projectId })
}
