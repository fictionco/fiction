// import { ProjectPrivate } from "@kaption/core"
// import { ClickOffsetPosition } from "@factor/api"

interface EventFieldParams {
  description?: string
  session?: boolean
}
class EventField<T> {
  readonly type?: T
  readonly description?: string
  readonly session?: boolean
  constructor(params?: EventFieldParams) {
    const { description, session = false } = params || {}
    this.description = description
    this.session = session
  }
}

const GeoFieldMap = {
  countryCode: new EventField<string>({ session: true }),
  regionCode: new EventField<string>({ session: true }),
  regionName: new EventField<string>({ session: true }),
  city: new EventField<string>({ session: true }),
  latitude: new EventField<number>({ session: true }),
  longitude: new EventField<number>({ session: true }),
  timezone: new EventField<string>({ session: true }),
}

const ReferralFieldMap = {
  referralSource: new EventField<string>({ session: true }),
  referralCampaign: new EventField<string>({ session: true }),
  referralMedium: new EventField<string>({ session: true }),
  referralTerm: new EventField<string>({ session: true }),
  referralContent: new EventField<string>({ session: true }),
  referralTitle: new EventField<string>({ session: true }),
  referralDescription: new EventField<string>({ session: true }),
  referralCanonicalUrl: new EventField<string>({ session: true }),
  referralImage: new EventField<string>({ session: true }),
}

export const EventFieldMap = {
  eventId: new EventField<string>({}),
  sessionId: new EventField<string>({
    session: true,
    description: 'unique id for current session',
  }),
  clientId: new EventField<string>({ description: 'id from user client' }),
  messageId: new EventField<string>({
    description: 'id for event batch where event arrived',
  }),
  anonymousId: new EventField<string>({
    description: 'random id for user client',
  }),
  projectId: new EventField<string>({ session: true }),
  organizationId: new EventField<string>({ session: true }),
  sentAt: new EventField<string>({
    description: 'timestamp for event sent from client',
  }),
  receivedAt: new EventField<string>({
    description: 'timestamp for event received by server',
  }),
  timestamp: new EventField<string>({
    description: 'timestamp for session',
  }),
  eventName: new EventField<string>({}),
  eventType: new EventField<string>({
    description: 'conversion type / event',
  }),
  category: new EventField<string>(),
  label: new EventField<string>(),
  action: new EventField<string>(),
  value: new EventField<number>(),
  selector: new EventField<string>(),
  context: new EventField<string>(),
  meta: new EventField<Record<string, unknown> | string>(),
  properties: new EventField<Record<string, unknown> | string>(),
  traits: new EventField<Record<string, unknown> | string>(),
  trace: new EventField<string>(),

  pathname: new EventField<string>(),
  domain: new EventField<string>({ session: true }),
  signature: new EventField<number>({ session: true }),
  os: new EventField<string>({ session: true }),
  browser: new EventField<string>({ session: true }),
  deviceType: new EventField<string>({ session: true }),
  language: new EventField<string>({ session: true }),
  referrer: new EventField<string>({ session: true }),
  ip: new EventField<string>({ session: true }),
  isNew: new EventField<1 | 0>({ session: true }),
  isReturning: new EventField<1 | 0>({ session: true }),
  startTime: new EventField<string>({ session: true }),
  endTime: new EventField<string>({ session: true }),
  entryPage: new EventField<string>({ session: true }),
  exitPage: new EventField<string>({ session: true }),
  v: new EventField<string>({ session: true }),
  source: new EventField<string>({ session: true }),
  sign: new EventField<1 | -1>(),

  scrollTotal: new EventField<number>(),
  keypressTotal: new EventField<number>(),
  moveTotal: new EventField<number>(),
  touchTotal: new EventField<number>(),
  clickTotal: new EventField<number>(),
  engageDuration: new EventField<number>(),
  scrollDepth: new EventField<number>(),
  viewNo: new EventField<number>(),
  eventNo: new EventField<number>(),

  ...ReferralFieldMap,
  ...GeoFieldMap,
}

type CreateFieldType<T> = {
  [P in keyof T]: T[P] extends EventField<infer Q> ? Q : never
}

export type EventParams = CreateFieldType<typeof EventFieldMap>
export type GeoParams = CreateFieldType<typeof GeoFieldMap>
export type ReferralParams = CreateFieldType<typeof ReferralFieldMap>

export type EventData = {
  projectId: string
  eventName: string
} & Partial<EventParams>

// export interface ClientConfig {
//   clientId: string
//   projectId: string
//   width: number
//   height: number
//   referrer: string
//   language: string
//   url: string
//   stage: "local" | "pre" | "prod" | "dev"
//   v: string
//   returning: boolean
// }

// export type ClickEvent = EventParams & {
//   meta: { position: ClickOffsetPosition } | string
// }

// /**
//  * Connection
//  */
// interface ConnectionComponents {
//   config: ConnectionConfig
//   project?: ProjectPrivate
// }
// /**
//  * Socket Message Ingest
//  */
// export type ConditionalSocketMessage<T> = T extends SocketEvent.Ping
//   ? { reason: string }
//   : SocketMessageDataItem

// export type SocketMessage<T extends SocketEvent = SocketEvent> = [
//   T,
//   ConditionalSocketMessage<T>,
// ]

// export type SocketMessageDataItem = ConnectionComponents &
//   Partial<TrackingComponents>

// /**
//  * Event Tracking
//  */

// export type TrackingDataRecord = Record<string, TrackingComponents>

// export type TrackingComponents = {
//   events: EventConfig[]
//   debug?: { message: string; data: Record<string, any> }[]
// } & ConnectionComponents

// export type BeaconData = {
//   clientConfig: ClientConfig
// } & Partial<TrackingComponents>

// export type PageLoadType = "soft" | "hard"

// export enum SocketEvent {
//   Track = "track",
//   Ping = "ping",
// }

// export type TrackingResponseData = {
//   sessionId?: string
//   trackingEligible?: boolean
//   replayEligible?: boolean
//   details?: string[]
//   sessionStatus?: "begin" | "continue" | "expire"
//   timestamp?: string
// }

// /**
//  * Items in cookie must be less than 4kb
//  */

// export interface RequestHeaderConfig {
//   rawIp: string
//   ip: string
//   userAgent: string
//   origin: string
// }

// export type ConnectionConfig = RequestHeaderConfig & ClientConfig

// /**
//  * Information sent from the browser/client with each message
//  */
// export type SessionConfig = {
//   sessionId?: string
// } & ConnectionConfig

// /**
//  * Information about a specific web path
//  */
// export interface ClientPathInfo {
//   url: string
//   referrer: string
//   screen: { width: number; height: number }
// }

// export type EventConfig = {
//   eventName: string
// } & Partial<ClientPathInfo & EventFields>

// export type PostgresSessionFields = Omit<Partial<SessionFields>, "events"> & {
//   events: string
//   experiments: string
// }

// export type ClickhouseSessionFields = Omit<
//   Partial<SessionFields>,
//   "replay" | "events" | "timestamp" | "startTime" | "endTime"
// > & {
//   startTime: number
//   endTime: number
//   timestamp: number
// }

// export type ClickhouseEventFields = Omit<
//   PassedEventFields,
//   | "timestamp"
//   | "startTime"
//   | "endTime"
//   | "properties"
//   | "traits"
//   | "meta"
//   | "sentAt"
//   | "receivedAt"
// > & {
//   timestamp: number
//   startTime?: number
//   endTime?: number
//   properties?: string
//   traits?: string
//   meta?: string
//   sentAt: number
//   receivedAt: number
// }

// /**
//  * Ensure that no extra fields can be added to a type
//  * @reference
//  * https://stackoverflow.com/a/55361256/1858322
//  */
// export type NoExtraKeys<PASSED, BASE> = {
//   [K in keyof (PASSED & BASE)]: K extends keyof BASE ? BASE[K] : never
// }
