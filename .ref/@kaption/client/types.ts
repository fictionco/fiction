interface TrackingReferrerCampaign {
  name: string
  source: string
  medium: string
  term: string
  content: string
}

interface TrackingDevice {
  id: string
  advertisingId: string
  adTrackingEnabled: boolean
  manufacturer: string
  model: string
  name: string
  type: string
  token: string
}

interface TrackingNetwork {
  bluetooth: boolean
  carrier: string
  cellular: boolean
  wifi: boolean
}

interface TrackingLocation {
  city: string
  country: string
  latitude: number
  longitude: number
  speed: number
}

interface TrackingPage {
  path: string
  referrer: string
  search: string
  title: string
  url: string
}

interface TrackingLibrary {
  name: string
  version: string
  stage: 'local' | 'pre' | 'prod'
}

export interface TrackingScreen {
  width: number
  height: number
  density: number
}

interface TrackingApp {
  name: string
  version: string
  build: string
  namespace: string
}

interface TrackingOs {
  name: string
  version: string
}

interface TrackingReferrer {
  id: string
  type: string
}

type BasicTypes = string | number | string[] | Record<string, any>

export interface TrackingProperties {
  currency: string
  conversion: string
  originator: string
  category: string
  action: string
  label: string
  selector: string
  trace: string
  revenue: number
  value: number
  weight: number
  points: number
  scrollTotal: number
  keypressTotal: number
  moveTotal: number
  touchTotal: number
  clickTotal: number
  interactionTotal: number
  duration: number
  engageDuration: number
  replayDuration: number
  scrollDepth: number
  reason: string
  message: string
  [key: string]: BasicTypes
}

interface IdentifyAddress {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface IdentifyCompany {
  name: string
  id: string
  industry: string
  employee_count: number
  plan: string
}

interface IdentifyTraitsBase {
  address: IdentifyAddress
  website: string
  name: string
  email: string
  phone: string
  avatar: string
  createdAt: string
  description: string
  plan: string
}

export type IdentifyTraitsUser = IdentifyTraitsBase & {
  userId: string
  firstName: string
  lastName: string
  age: number
  birthday: string
  company: Partial<IdentifyCompany>
  title: string
  username: string
  gender: string
  lists: { id: string, status: string }[]
  [key: string]: any
}

type IdentifyTraitsGroup = IdentifyTraitsBase & {
  employees: number
  industry: string
  id: string
  [key: string]: any
}

export interface TrackingContext {
  ip: string
  rawIp: string
  active: boolean
  groupId: string
  timezone: string
  userAgent: string
  isFake: boolean
  locale: string
  app: Partial<TrackingApp>
  campaign: Partial<TrackingReferrerCampaign>
  device: Partial<TrackingDevice>
  library: Partial<TrackingLibrary>
  location: Partial<TrackingLocation>
  network: Partial<TrackingNetwork>
  os: Partial<TrackingOs>
  page: Partial<TrackingPage>
  referrer: Partial<TrackingReferrer>
  screen: Partial<TrackingScreen>
  origin: string
}

export interface KaptionEventBrowser {
  anonymousId: string
  projectId: string
  context?: Partial<TrackingContext>
  debug?: Record<string, unknown>
}

interface KaptionEventSendFields {
  sentAt?: string
  messageId?: string
  message?: string
}

type GenType = 'internal' | 'core' | 'user'
type ClientTrackType =
  | 'track'
  | 'page'
  | 'identify'
  | 'group'
  | 'session'
  | 'debug'
  | 'loop'
  | 'exit'
  | 'internal'
  | 'custom'

export interface KaptionEventUserDefined {
  name?: string
  channel?: string
  gen?: GenType
  type?: ClientTrackType
  event: string
  userId?: string
  anonymousId?: string
  groupId?: string
  properties?: Partial<TrackingProperties>
  traits?: Partial<IdentifyTraitsUser | IdentifyTraitsGroup>
  context?: Partial<TrackingContext>
}

/**
 * Standard event tracking (matches segment API)
 */
export type KaptionEvent = KaptionEventUserDefined &
  KaptionEventBrowser &
  KaptionEventSendFields &
  KaptionEventServer

export interface KaptionEventServer {
  eventId?: string
  receivedAt?: string // endpoint reception time
  timestamp?: string // endpoint reception time
  version?: string // endpoint version
  viewNo?: number
  eventNo?: number
  meta?: Record<string, unknown>
}
