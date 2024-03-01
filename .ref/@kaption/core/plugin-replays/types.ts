import type { EndpointResponse } from '@factor/api'
import type { eventWithTime } from 'rrweb/typings/types'
import type { EventParams, SessionEvent } from '../plugin-beacon'

interface Hash { key: string, value: string }

export type ReplayEvent = eventWithTime & {
  hashes?: Hash[]
}
export type ReplaySessionEvent = {
  eventList: EventParams[]
  interactionTotal: number
} & SessionEvent &
ReplayDataObject

export type SaveStatus = 'saving' | 'pending' | 'disabled' | 'local' | 'waiting'

export type WelcomeResponse = EndpointResponse<{
  sessionId?: string
  projectId?: string
}>
export interface WelcomeMessage {
  status: SaveStatus
  reason?: string
  sessionId?: string
}
export interface ReplayEventMap {
  welcome: {
    req: {}
    res: WelcomeResponse
  }
  replayDataObject: {
    req: ReplayDataObject
    res: 'ok'
  }
}

export interface ReplayDataObject {
  replayId?: string
  replayData: ReplayEvent[]
  projectId: string
  anonymousId: string
  sessionId?: string
  status: SaveStatus
  reason?: string
  meta?: Record<string, unknown>
}

export interface ReplayUserSettings {
  minimumDurationSeconds: number
  triggerEvents: string[]
}
