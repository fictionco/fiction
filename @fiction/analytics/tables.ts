/* server-only-file */
import { dayjs } from '@fiction/core'
import { z } from 'zod'
import { standardUrl } from './plugin-beacon/utils/index.js'
import { FictionAnalyticsCol, FictionAnalyticsTable } from './plugin-clickhouse/utils.js'

export const t = {
  event: 'analytics_event',
  session: 'analytics_session',
  metrics: 'metrics',
}

const metricFields = [
  new FictionAnalyticsCol({ key: 'snapshotId', clickHouseType: 'String', description: 'unique snapshot identifier', indexOn: true, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'orgId', clickHouseType: 'String', description: 'organization identifier', indexOn: true, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'metric', clickHouseType: 'String', description: 'metric type', sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'count', clickHouseType: 'Float32', description: 'metric count', sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'timestamp', clickHouseType: 'DateTime', description: 'metric recorded timestamp', sch: () => z.union([z.string(), z.number()]) }),
] as const

const baseFields = [
  new FictionAnalyticsCol({ key: 'event', clickHouseType: 'String', description: 'Primary event name', indexOn: true, getValue: ({ event }) => event.event, sch: ({ z }) => z.string() }),
  new FictionAnalyticsCol({ key: 'type', clickHouseType: 'LowCardinality(String)', description: 'Event type (track/page/identify/group/session/debug)', getValue: ({ event }) => event.type, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'gen', clickHouseType: 'LowCardinality(String)', description: 'Event source type', getValue: ({ event }) => event.gen, sch: ({ z }) => z.enum(['core', 'user', 'internal']) }),
  new FictionAnalyticsCol({ key: 'channel', clickHouseType: 'String', description: 'Event source channel', getValue: ({ event }) => event?.channel, sch: () => z.string() }),

  // Event Type Flags
  new FictionAnalyticsCol({ key: 'isCore', clickHouseType: 'UInt8', description: 'Core/internal event flag', getValue: ({ event }) => event.gen === 'core' || event.gen === 'internal' ? 1 : 0, sch: ({ z }) => z.boolean() }),
  new FictionAnalyticsCol({ key: 'isInternal', clickHouseType: 'UInt8', description: 'Internal event flag', getValue: ({ event }) => event.gen === 'internal' ? 1 : 0, sch: ({ z }) => z.boolean() }),
  new FictionAnalyticsCol({ key: 'isCustom', clickHouseType: 'UInt8', description: 'Custom user event flag', getValue: ({ event }) => event.gen === 'user' || !event.gen ? 1 : 0, sch: () => z.string() }),

  // Identifiers
  new FictionAnalyticsCol({ key: 'eventId', clickHouseType: 'String', description: 'Unique event identifier', getValue: ({ event }) => event.eventId, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'messageId', clickHouseType: 'String', description: 'Event batch identifier', getValue: ({ event }) => event?.messageId, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'sessionId', clickHouseType: 'String', description: 'Session identifier', indexOn: true, sessionSelector: _ => `${_.key} as ${_.id}`, getValue: ({ session }) => session.sessionId, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'anonymousId', clickHouseType: 'String', description: 'Cookie-stored client ID', indexOn: true, sessionSelector: ({ key, id }) => `any(${key}) as ${id}`, getValue: ({ session }) => session.anonymousId, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'userId', clickHouseType: 'String', description: 'Authenticated user ID', indexOn: true, sessionSelector: ({ key, id }) => `anyIf(${key}, event='session') as ${id}`, getValue: ({ session }) => session.userId, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'orgId', clickHouseType: 'String', description: 'Organization identifier', indexOn: true, sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.orgId, sch: () => z.string() }),

  // Timestamps
  new FictionAnalyticsCol({ key: 'timestamp', clickHouseType: 'DateTime', description: 'Event/session timestamp', sessionSelector: _ => `min(${_.key}) as ${_.id}`, getValue: ({ event }) => dayjs(event.timestamp).unix(), sch: () => z.union([z.string(), z.number()]) }),
  new FictionAnalyticsCol({ key: 'sentAt', clickHouseType: 'DateTime', description: 'Client send timestamp', getValue: ({ event }) => dayjs(event.sentAt).unix(), sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'receivedAt', clickHouseType: 'DateTime', description: 'Server receive timestamp', getValue: ({ event }) => dayjs(event.receivedAt).unix(), sch: () => z.string() }),

  // Event Properties
  new FictionAnalyticsCol({ key: 'reason', clickHouseType: 'LowCardinality(String)', description: 'Event trigger reason', getValue: ({ event }) => event.properties?.reason, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'conversion', clickHouseType: 'LowCardinality(String)', description: 'Conversion type', getValue: ({ event }) => event.properties?.conversion, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'category', clickHouseType: 'String', description: 'Event category', getValue: ({ event }) => event.properties?.category, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'label', clickHouseType: 'String', description: 'Event label', getValue: ({ event }) => event.properties?.label, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'action', clickHouseType: 'String', description: 'Event action', getValue: ({ event }) => event.properties?.action, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'selector', clickHouseType: 'String', description: 'DOM trigger selector', getValue: ({ event }) => event.properties?.selector, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'value', clickHouseType: 'Float32', description: 'Event value', sessionSelector: _ => `sum(${_.key}) as ${_.id}`, getValue: ({ event }) => event.properties?.value, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'count', clickHouseType: 'Float32', description: 'Associated count', sessionSelector: _ => `sum(${_.key}) as ${_.id}`, getValue: ({ event }) => event.properties?.value, sch: () => z.number() }),

  // JSON Fields
  new FictionAnalyticsCol({ key: 'context', clickHouseType: 'String', description: 'Event context object', getValue: ({ event }) => JSON.stringify(event.context || {}), sch: () => z.record(z.string(), z.any()) }),
  new FictionAnalyticsCol({ key: 'meta', clickHouseType: 'String', description: 'Event metadata', getValue: ({ event }) => JSON.stringify(event.meta || {}), sch: () => z.record(z.string(), z.any()) }),
  new FictionAnalyticsCol({ key: 'debug', clickHouseType: 'String', description: 'Debug information', getValue: ({ event }) => JSON.stringify(event.debug || {}), sch: () => z.record(z.string(), z.string()) }),
  new FictionAnalyticsCol({ key: 'traits', clickHouseType: 'String', description: 'User traits', getValue: ({ event }) => JSON.stringify(event.traits || {}), sch: () => z.record(z.string(), z.any()) }),
  new FictionAnalyticsCol({ key: 'trace', clickHouseType: 'String', description: 'Stack/reproduction trace', getValue: ({ event }) => event.properties?.trace, sch: () => z.string() }),

  // URL Components
  new FictionAnalyticsCol({ key: 'url', clickHouseType: 'String', description: 'Full URL', getValue: ({ event }) => (event.context?.page?.url ?? '').replace(/\/$/, ''), sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'origin', clickHouseType: 'String', description: 'URL origin', getValue: ({ event }) => standardUrl({ url: event.context?.page?.url, part: 'origin' }), sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'pathname', clickHouseType: 'String', description: 'URL pathname', indexOn: true, getValue: ({ event }) => standardUrl({ url: event.context?.page?.url, part: 'pathname' }), sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'search', clickHouseType: 'String', description: 'URL search params', getValue: ({ event }) => standardUrl({ url: event.context?.page?.url, part: 'search' }), sch: () => z.string() }),

  // Client Info
  new FictionAnalyticsCol({ key: 'os', clickHouseType: 'LowCardinality(String)', description: 'Operating system', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.os, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'browser', clickHouseType: 'LowCardinality(String)', description: 'Browser name', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.browser, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'deviceType', clickHouseType: 'LowCardinality(String)', description: 'Device type', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.deviceType, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'locale', clickHouseType: 'LowCardinality(String)', description: 'User locale', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.locale, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'ip', clickHouseType: 'String', description: 'Client IP', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.ip, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'timezone', clickHouseType: 'LowCardinality(String)', description: 'User timezone', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.timezone, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'version', clickHouseType: 'String', description: 'Client version', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.version, sch: () => z.string() }),

  // Session Metrics
  new FictionAnalyticsCol({ key: 'duration', clickHouseType: 'UInt16', description: 'Total session duration', sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`, getValue: ({ event, session }) => event.event === 'session' ? session.duration : undefined, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'startedAt', clickHouseType: 'DateTime', description: 'Session start time', sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`, getValue: ({ event, session }) => event.event === 'session' ? session.startedAt : dayjs(event.timestamp).unix(), sch: () => z.union([z.string(), z.number()]) }),
  new FictionAnalyticsCol({ key: 'endedAt', clickHouseType: 'DateTime', description: 'Session end time', sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`, getValue: ({ event, session }) => event.event === 'session' ? session.endedAt : dayjs(event.timestamp).unix(), sch: () => z.union([z.string(), z.number()]) }),
  new FictionAnalyticsCol({ key: 'entryPage', clickHouseType: 'String', description: 'First page viewed', sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`, getValue: ({ event, session }) => event.event === 'session' ? session.entryPage : undefined, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'exitPage', clickHouseType: 'String', description: 'Last page viewed', sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`, getValue: ({ event, session }) => event.event === 'session' ? session.exitPage : undefined, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'isReturning', clickHouseType: 'UInt8', description: 'Returning user flag', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.isReturning, sch: () => z.number().int().min(0).max(1) }),
  new FictionAnalyticsCol({ key: 'isFake', clickHouseType: 'UInt8', description: 'Test/fake session flag', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.isFake, sch: () => z.number().int().min(0).max(1) }),

  // Engagement Metrics
  new FictionAnalyticsCol({ key: 'scrollTotal', clickHouseType: 'UInt16', description: 'Total scroll events', sessionSelector: _ => `sum(${_.key}) as ${_.id}`, getValue: ({ event }) => event?.properties?.scrollTotal, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'keypressTotal', clickHouseType: 'UInt16', description: 'Total keypress events', sessionSelector: _ => `sum(${_.key}) as ${_.id}`, getValue: ({ event }) => event.properties?.keypressTotal, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'clickTotal', clickHouseType: 'UInt16', description: 'Total click events', sessionSelector: _ => `sum(${_.key}) as ${_.id}`, getValue: ({ event }) => event.properties?.clickTotal, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'touchTotal', clickHouseType: 'UInt16', description: 'Total touch events', sessionSelector: _ => `sum(${_.key}) as ${_.id}`, getValue: ({ event }) => event.properties?.touchTotal, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'moveTotal', clickHouseType: 'UInt16', description: 'Total mouse move events', sessionSelector: _ => `sum(${_.key}) as ${_.id}`, getValue: ({ event }) => event.properties?.moveTotal, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'engageDuration', clickHouseType: 'UInt16', description: 'Active engagement duration', sessionSelector: _ => `sum(${_.key}) as ${_.id}`, getValue: ({ event }) => event.properties?.engageDuration, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'replayDuration', clickHouseType: 'UInt16', description: 'Session replay duration', sessionSelector: _ => `sum(${_.key}) as ${_.id}`, getValue: ({ event }) => event.properties?.replayDuration, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'scrollDepth', clickHouseType: 'Float32', description: 'Page scroll depth percentage', sessionSelector: _ => `avgIf(${_.key}, event='view' AND isFinite(${_.key})) as ${_.id}`, getValue: ({ event }) => event.properties?.scrollDepth, sch: () => z.number() }),

  // Sequence Tracking
  new FictionAnalyticsCol({ key: 'sessionNo', clickHouseType: 'UInt16', description: 'User session count', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.sessionNo, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'viewNo', clickHouseType: 'UInt16', description: 'Page view sequence number', getValue: ({ event }) => event.viewNo, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'eventNo', clickHouseType: 'UInt16', description: 'Event sequence number', getValue: ({ event }) => event.eventNo, sch: () => z.number() }),
] as const

// Geographic Location Fields
const geoFields = [
  new FictionAnalyticsCol({ key: 'countryCode', clickHouseType: 'LowCardinality(String)', description: 'Two-letter country code', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.countryCode, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'regionName', clickHouseType: 'LowCardinality(String)', description: 'State/province name', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.regionName, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'cityName', clickHouseType: 'LowCardinality(String)', description: 'City name', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.cityName, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'latitude', clickHouseType: 'Float32', description: 'Geographic latitude', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.latitude, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'longitude', clickHouseType: 'Float32', description: 'Geographic longitude', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.longitude, sch: () => z.number() }),
] as const

// Referral Attribution Fields
const referralFields = [
  // Core Referral Data
  new FictionAnalyticsCol({ key: 'referrer', clickHouseType: 'String', description: 'Full referrer URL', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.referrer, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'referralSource', clickHouseType: 'String', description: 'Traffic source (e.g. google, facebook)', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.referralSource, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'referralMedium', clickHouseType: 'String', description: 'Marketing medium (e.g. cpc, email)', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.referralMedium, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'referralCampaign', clickHouseType: 'String', description: 'Campaign identifier', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.referralCampaign, sch: () => z.string() }),

  // UTM Parameters
  new FictionAnalyticsCol({ key: 'referralTerm', clickHouseType: 'String', description: 'Campaign keywords', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.referralTerm, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'referralContent', clickHouseType: 'String', description: 'Content variant identifier', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.referralContent, sch: () => z.string() }),

  // Open Graph Metadata
  new FictionAnalyticsCol({ key: 'referralTitle', clickHouseType: 'String', description: 'Referrer page title', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.referralTitle, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'referralDescription', clickHouseType: 'String', description: 'Referrer meta description', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.referralDescription, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'referralCanonicalUrl', clickHouseType: 'String', description: 'Referrer canonical URL', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.referralCanonicalUrl, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'referralImage', clickHouseType: 'String', description: 'Referrer og:image URL', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.referralImage, sch: () => z.string() }),
] as const

// Email Event Fields
const emailEventFields = [
  // Email Identifiers
  new FictionAnalyticsCol({ key: 'emailId', clickHouseType: 'String', description: 'Unique email identifier', indexOn: true, getValue: ({ event }) => event.email?.emailId, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'campaignId', clickHouseType: 'String', description: 'Email campaign identifier', indexOn: true, getValue: ({ event }) => event.email?.campaignId, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'emailTemplateId', clickHouseType: 'String', description: 'Email template identifier', getValue: ({ event }) => event.email?.templateId, sch: () => z.string() }),

  // Email Content
  new FictionAnalyticsCol({ key: 'emailSubject', clickHouseType: 'String', description: 'Email subject line', getValue: ({ event }) => event.email?.subject, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'emailEventType', clickHouseType: 'LowCardinality(String)', description: 'Email event type (open/click/deliver)', getValue: ({ event }) => event.email?.eventType, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'emailClickedUrl', clickHouseType: 'String', description: 'Clicked URL in email', getValue: ({ event }) => event.email?.clickedUrl, sch: () => z.string() }),

  // Email Timestamps
  new FictionAnalyticsCol({ key: 'emailOpenedAt', clickHouseType: 'DateTime', description: 'Email open timestamp', getValue: ({ event }) => dayjs(event.email?.openedAt).unix(), sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'emailClickedAt', clickHouseType: 'DateTime', description: 'Email click timestamp', getValue: ({ event }) => dayjs(event.email?.clickedAt).unix(), sch: () => z.string() }),
] as const

export const eventFields = [...baseFields, ...geoFields, ...referralFields, ...emailEventFields] as const

// Session Analytics Fields
const sessionFields = [
  // Import Event Fields with Session Selectors
  ...eventFields.filter(f => f.sessionSelector),

  // Page and Event Counts
  new FictionAnalyticsCol({ key: 'pageCount', clickHouseType: 'UInt16', description: 'Total page views in session', sessionSelector: _ => `countIf(event='view') as ${_.id}`, getValue: ({ session }) => session.pageCount, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'totalEvents', clickHouseType: 'UInt16', description: 'Total events in session', sessionSelector: _ => `count(*) as ${_.id}`, getValue: ({ session }) => session.totalEvents, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'eventCount', clickHouseType: 'UInt16', description: 'Unique events in session', sessionSelector: _ => `uniq(eventId) as ${_.id}`, getValue: ({ session }) => session.eventCount, sch: () => z.number() }),

  // Session State Flags
  new FictionAnalyticsCol({ key: 'isClosed', clickHouseType: 'UInt8', description: 'Session properly closed', sessionSelector: _ => `if(countIf(event='session') > 0, 1, 0) as ${_.id}`, getValue: ({ session }) => session.isClosed, sch: () => z.number().int().min(0).max(1) }),
  new FictionAnalyticsCol({ key: 'isBounce', clickHouseType: 'UInt8', description: 'Single page session', sessionSelector: _ => `if(session_pageCount > 1, 0, 1) as ${_.id}`, getValue: ({ session }) => session.isBounce, sch: () => z.number().int().min(0).max(1) }),
  new FictionAnalyticsCol({ key: 'isRobot', clickHouseType: 'UInt8', description: 'Bot/crawler session', sessionSelector: _ => `if(countIf(event='bot') > 0, 1, 0) as ${_.id}`, getValue: ({ session }) => session.isRobot, sch: () => z.number().int().min(0).max(1) }),
  new FictionAnalyticsCol({ key: 'hasReplay', clickHouseType: 'UInt8', description: 'Session has replay data', sessionSelector: _ => `if(countIf(event='replay') > 0, 1, 0) as ${_.id}`, getValue: ({ session }) => session.hasReplay, sch: () => z.number().int().min(0).max(1) }),

  // Conversion Metrics
  new FictionAnalyticsCol({ key: 'totalGoalConversion', clickHouseType: 'UInt16', description: 'Count of goal conversions', sessionSelector: _ => `countIf(conversion='goal') as ${_.id}`, getValue: ({ session }) => session.totalGoalConversion, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'totalConversion', clickHouseType: 'UInt16', description: 'Count of all conversions', sessionSelector: _ => `countIf(conversion='conversion') as ${_.id}`, getValue: ({ session }) => session.totalConversion, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'hasGoalConversion', clickHouseType: 'UInt8', description: 'Has any goal conversion', sessionSelector: _ => `if(session_totalGoalConversion > 0, 1, 0) as ${_.id}`, getValue: ({ session }) => session.hasGoalConversion, sch: () => z.number().int().min(0).max(1) }),
  new FictionAnalyticsCol({ key: 'hasConversion', clickHouseType: 'UInt8', description: 'Has any conversion', sessionSelector: _ => `if(session_totalConversion > 0, 1, 0) as ${_.id}`, getValue: ({ session }) => session.hasConversion, sch: () => z.number().int().min(0).max(1) }),
] as const

export function getSessionQuerySelectors(): string[] {
  return sessionFields
    .map((_) => {
      return _.sessionSelector ? _.sessionSelector({ key: _.key, id: `session_${_.key}` }) : undefined
    })
    .filter(Boolean) as string[]
}

export function isSessionField(field: keyof EventParams) {
  const found = eventFields.find(f => f.key === field)
  return found?.sessionSelector ?? false
}

export const allTables = [
  new FictionAnalyticsTable({ tableKey: t.event, cols: eventFields }),
  new FictionAnalyticsTable({ tableKey: t.session, cols: sessionFields }),
  new FictionAnalyticsTable({ tableKey: t.metrics, cols: metricFields }),
]

type CreateTuple<T extends readonly FictionAnalyticsCol<any, any>[]> = {
  [P in keyof T]: T[P] extends FictionAnalyticsCol<infer X, infer Q> ? [X, Q] : never
}[number]

type TupleToObject<T extends [string, unknown]> = {
  [P in T[0]]: T extends [P, infer B] ? B : never
}

export type CreateAnalyticsObjectType<T extends readonly FictionAnalyticsCol<any, any>[]> = TupleToObject<CreateTuple<T>>

export type EventParams = CreateAnalyticsObjectType<typeof eventFields>

export type SessionEvent = Partial<EventParams> & {
  sessionId: string
  orgId: string
  anonymousId: string
  isOpened: boolean
}

export type SessionParams = CreateAnalyticsObjectType<typeof sessionFields | typeof eventFields>

export interface SessionStarted {
  sessionId: string
  anonymousId: string
  isOpened: boolean
}
export type ReferralParams = CreateAnalyticsObjectType<typeof referralFields>
