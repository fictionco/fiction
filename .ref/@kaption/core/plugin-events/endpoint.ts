import type { EndpointMeta, EndpointResponse } from '@factor/api'
import type { KaptionQueryOptions } from '../utils/extend'
import { KaptionQuery } from '../utils/extend'
import type { KaptionTag } from '../plugin-tag'
import type { CustomTrackEvent } from './types'
import type { KaptionEvents } from '.'

export type CustomEventQuerySettings = {
  kaptionTag: KaptionTag
  kaptionEvents: KaptionEvents
} & KaptionQueryOptions

export class QueryFindEvent extends KaptionQuery<CustomEventQuerySettings> {
  async run(
    params: {
      projectId: string
      event: string
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<CustomTrackEvent>> {
    const { projectId, event } = params

    const db = this.factorDb?.client()
    if (!db)
      throw new Error('No db connection')

    const r = await db
      .table(this.t.Event)
      .where({ projectId, event })
      .first<CustomTrackEvent | undefined>()

    return { status: r ? 'success' : 'error', data: r }
  }
}

export class QueryManageCustomEvent extends KaptionQuery<CustomEventQuerySettings> {
  factorUser = this.settings.factorUser
  factorDb = this.settings.factorDb
  kaptionCache = this.settings.kaptionCache
  kaptionTag = this.settings.kaptionTag
  kaptionEvents = this.settings.kaptionEvents
  tbl = 'kaption_custom_event'
  constructor(settings: CustomEventQuerySettings) {
    super(settings)
  }

  prepFields(
    type: 'settingsFields' | 'returnFields',
    customEvents?: (Partial<CustomTrackEvent> | undefined)[],
    meta?: EndpointMeta,
  ): CustomTrackEvent[] {
    if (!customEvents)
      return []
    if (!this.factorDb)
      throw this.stop('no db')

    const privateAccess = meta?.server || meta?.bearer?.userId

    const db = this.factorDb.client()

    const cols = this.factorDb.getColumns(this.tbl)

    const events = customEvents
      .map((customEvent) => {
        if (!customEvent)
          return
        const out: Record<string, unknown> = {}
        cols?.forEach(({ key, isSetting, isPrivate, isAuthority, prepare }) => {
          const k = key as keyof CustomTrackEvent

          switch (type) {
            case 'settingsFields': {
              if (isSetting && customEvent[k]) {
                const value = customEvent[k]
                out[k] = prepare ? prepare({ value, key, db }) : value
              }
              break
            }
            case 'returnFields': {
              if (
                customEvent[k]
                && (!isAuthority || meta?.returnAuthority?.includes(k))
                && (!isPrivate || privateAccess)
              )
                out[k] = customEvent[k]

              break
            }
          }
        })

        return out
      })
      .filter(Boolean)

    return events as CustomTrackEvent[]
  }

  async run(
    params: {
      _action: 'getIndex' | 'getSingle' | 'create' | 'update' | 'delete'
      customEvent?: Partial<CustomTrackEvent>
      eventId?: string
      projectId: string
    },
    meta: EndpointMeta,
  ): Promise<EndpointResponse<CustomTrackEvent[]>> {
    if (!this.factorDb)
      throw this.stop('no db')
    if (!params._action.includes('get') && !meta.bearer && !meta.server)
      throw this.stop('auth required')

    if (!params._action)
      throw this.stop('_action required')
    if (!params.projectId)
      throw this.stop('projectId required')

    const { _action, projectId, eventId, customEvent } = params

    const preppedCustomEvents = this.prepFields(
      'settingsFields',
      [customEvent],
      meta,
    )[0]

    let eventIndex: CustomTrackEvent[] = []

    const db = this.factorDb.client()

    let message: string | undefined

    if (_action === 'create') {
      if (!customEvent)
        throw this.stop('customEvent required')
      eventIndex = await db
        .insert({ ...preppedCustomEvents, projectId })
        .into(this.tbl)
        .returning<CustomTrackEvent[]>('*')

      message = 'event created'
    }
    else if (_action === 'update') {
      if (!eventId)
        throw this.stop({ message: 'eventId required' })

      eventIndex = await db
        .update({
          ...preppedCustomEvents,
          updatedAt: this.utils.dayjs().toISOString(),
        })
        .where({ projectId, eventId })
        .into(this.tbl)
        .returning<CustomTrackEvent[]>('*')

      message = 'event updated'
    }
    else if (_action === 'delete') {
      if (!eventId)
        throw this.stop({ message: 'eventId required' })

      await db.del().from(this.tbl).where({ eventId, projectId })
      message = 'event deleted'
    }
    else if (_action === 'getSingle') {
      if (!eventId)
        throw this.stop({ message: 'eventId required' })

      eventIndex = await db
        .table(this.tbl)
        .select<CustomTrackEvent[]>('*')
        .where({ projectId, eventId })
    }
    else if (_action === 'getIndex') {
      eventIndex = await db
        .table(this.tbl)
        .select<CustomTrackEvent[]>('*')
        .where({ projectId })
    }

    if (!_action.includes('get')) {
      await this.kaptionEvents.bustEventContext({ projectId })
      await this.kaptionTag.cacheTag({ _action: 'bust', projectId })
    }

    const preppedReturnFields = this.prepFields(
      'returnFields',
      eventIndex,
      meta,
    )

    return { status: 'success', data: preppedReturnFields, message }
  }
}
