/* server-only-file */
import { dayjs } from '@fiction/core'
import { z } from 'zod/v4'
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
  new FictionAnalyticsCol({ key: 'value', clickHouseType: 'Float32', description: 'metric count', sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'timestamp', clickHouseType: 'DateTime', description: 'metric recorded timestamp', sch: () => z.union([z.string(), z.number()]) }),
  new FictionAnalyticsCol({ key: 'sequence', clickHouseType: 'UInt64', description: 'Sequence number for fine ordering', sch: () => z.number() }),
] as const

const baseFields = [
  // Core Event Fields
  new FictionAnalyticsCol({ key: 'event', clickHouseType: 'String', description: 'Primary event identifier', indexOn: true, getValue: ({ event }) => event.event, sch: ({ z }) => z.string() }),
  new FictionAnalyticsCol({ key: 'type', clickHouseType: 'LowCardinality(String)', description: 'Event classification type (track/page/identify/group/session/debug)', getValue: ({ event }) => event.type, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'category', clickHouseType: 'String', description: 'Event grouping category', getValue: ({ event }) => event.properties?.category, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'action', clickHouseType: 'String', description: 'Event behavioral trigger', getValue: ({ event }) => event.properties?.action, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'label', clickHouseType: 'String', description: 'Event descriptive text', getValue: ({ event }) => event.properties?.label, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'value', clickHouseType: 'Float32', description: 'Event numerical measurement', sessionSelector: _ => `sum(${_.key}) as ${_.id}`, getValue: ({ event }) => event.properties?.value, sch: () => z.number() }),

  // Event Identifiers
  new FictionAnalyticsCol({ key: 'eventId', clickHouseType: 'String', description: 'Event unique identifier', getValue: ({ event }) => event.eventId, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'messageId', clickHouseType: 'String', description: 'Batch event identifier', getValue: ({ event }) => event?.messageId, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'sessionId', clickHouseType: 'String', description: 'Visit unique identifier', indexOn: true, sessionSelector: _ => `${_.key} as ${_.id}`, getValue: ({ session }) => session.sessionId, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'emailId', clickHouseType: 'String', description: 'Unique email identifier', indexOn: true, getValue: ({ event }) => event.email?.emailId, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'postId', clickHouseType: 'String', description: 'Email campaign identifier', indexOn: true, getValue: ({ event }) => event.email?.postId, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'formId', clickHouseType: 'String', description: 'Form identifier', indexOn: true, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'siteId', clickHouseType: 'String', description: 'Site identifier', indexOn: true, getValue: ({ event }) => event?.siteId, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'contactId', clickHouseType: 'String', description: 'Contact identifier', indexOn: true, sch: () => z.string() }),

  // Event Source Classification
  new FictionAnalyticsCol({ key: 'gen', clickHouseType: 'LowCardinality(String)', description: 'Event origin system', getValue: ({ event }) => event.gen, sch: ({ z }) => z.enum(['core', 'user', 'internal']) }),
  new FictionAnalyticsCol({ key: 'channel', clickHouseType: 'String', description: 'Event distribution path', getValue: ({ event }) => event?.channel, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'isCore', clickHouseType: 'UInt8', description: 'System event indicator', getValue: ({ event }) => event.gen === 'core' || event.gen === 'internal' ? 1 : 0, sch: ({ z }) => z.boolean() }),
  new FictionAnalyticsCol({ key: 'isInternal', clickHouseType: 'UInt8', description: 'Platform event indicator', getValue: ({ event }) => event.gen === 'internal' ? 1 : 0, sch: ({ z }) => z.boolean() }),
  new FictionAnalyticsCol({ key: 'isCustom', clickHouseType: 'UInt8', description: 'Custom event indicator', getValue: ({ event }) => event.gen === 'user' || !event.gen ? 1 : 0, sch: () => z.string() }),

  // Identity & Organization
  new FictionAnalyticsCol({ key: 'orgId', clickHouseType: 'String', description: 'Organization unique identifier', indexOn: true, sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.orgId, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'anonymousId', clickHouseType: 'String', description: 'Visitor cookie identifier', indexOn: true, sessionSelector: ({ key, id }) => `any(${key}) as ${id}`, getValue: ({ session }) => session.anonymousId, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'userId', clickHouseType: 'String', description: 'Known user identifier', indexOn: true, sessionSelector: ({ key, id }) => `anyIf(${key}, event='session') as ${id}`, getValue: ({ session }) => session.userId, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'email', clickHouseType: 'String', description: 'user email', indexOn: true, sessionSelector: ({ key, id }) => `anyIf(${key}, event='session') as ${id}`, getValue: ({ session }) => session.email, sch: () => z.string() }),

  // Timestamps
  new FictionAnalyticsCol({ key: 'timestamp', clickHouseType: 'DateTime', description: 'timestamp with second precision', sessionSelector: _ => `min(${_.key}) as ${_.id}`, getValue: ({ event }) => dayjs(event.timestamp).unix(), sch: () => z.union([z.string(), z.number()]) }),
  new FictionAnalyticsCol({ key: 'timeAt', clickHouseType: 'DateTime64(3)', description: 'Exact timestamp with ms precision', sessionSelector: _ => `min(${_.key}) as ${_.id}`, getValue: ({ event }) => dayjs(event.timestamp).valueOf(), sch: () => z.union([z.string(), z.number()]) }),
  new FictionAnalyticsCol({ key: 'sentAt', clickHouseType: 'DateTime64(3)', description: 'Client dispatch time', getValue: ({ event }) => dayjs(event.sentAt).unix(), sch: () => z.union([z.string(), z.number()]) }),
  new FictionAnalyticsCol({ key: 'receivedAt', clickHouseType: 'DateTime64(3)', description: 'Server ingestion time', getValue: ({ event }) => dayjs(event.receivedAt).unix(), sch: () => z.union([z.string(), z.number()]) }),

  // Session Timing
  new FictionAnalyticsCol({ key: 'startedAt', clickHouseType: 'DateTime64(3)', description: 'Visit start time', sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`, getValue: ({ event, session }) => event.event === 'session' ? session.startedAt : dayjs(event.timestamp).unix(), sch: () => z.union([z.string(), z.number()]) }),
  new FictionAnalyticsCol({ key: 'endedAt', clickHouseType: 'DateTime64(3)', description: 'Visit end time', sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`, getValue: ({ event, session }) => event.event === 'session' ? session.endedAt : dayjs(event.timestamp).unix(), sch: () => z.union([z.string(), z.number()]) }),
  new FictionAnalyticsCol({ key: 'duration', clickHouseType: 'UInt16', description: 'Visit length in seconds', sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`, getValue: ({ event, session }) => event.event === 'session' ? session.duration : undefined, sch: () => z.number() }),

  // URL Components
  new FictionAnalyticsCol({ key: 'url', clickHouseType: 'String', description: 'Complete page address', getValue: ({ event }) => (event.context?.page?.url ?? '').replace(/\/$/, ''), sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'origin', clickHouseType: 'String', description: 'Site domain source', getValue: ({ event }) => standardUrl({ url: event.context?.page?.url, part: 'origin' }), sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'pathname', clickHouseType: 'String', description: 'Page route path', indexOn: true, getValue: ({ event }) => standardUrl({ url: event.context?.page?.url, part: 'pathname' }), sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'search', clickHouseType: 'String', description: 'URL query parameters', getValue: ({ event }) => standardUrl({ url: event.context?.page?.url, part: 'search' }), sch: () => z.string() }),

  // Client Environment
  new FictionAnalyticsCol({ key: 'os', clickHouseType: 'LowCardinality(String)', description: 'Operating system name', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.os, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'browser', clickHouseType: 'LowCardinality(String)', description: 'Web browser name', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.browser, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'deviceType', clickHouseType: 'LowCardinality(String)', description: 'Device form factor', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.deviceType, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'locale', clickHouseType: 'LowCardinality(String)', description: 'User language setting', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.locale, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'ip', clickHouseType: 'String', description: 'Client network address', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.ip, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'timezone', clickHouseType: 'LowCardinality(String)', description: 'User time zone', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.timezone, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'version', clickHouseType: 'String', description: 'Analytics library version', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.version, sch: () => z.string() }),

  // Session Navigation
  new FictionAnalyticsCol({ key: 'entryPage', clickHouseType: 'String', description: 'First viewed page', sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`, getValue: ({ event, session }) => event.event === 'session' ? session.entryPage : undefined, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'exitPage', clickHouseType: 'String', description: 'Last viewed page', sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`, getValue: ({ event, session }) => event.event === 'session' ? session.exitPage : undefined, sch: () => z.string() }),

  // Session Metadata
  new FictionAnalyticsCol({ key: 'isReturning', clickHouseType: 'UInt8', description: 'Repeat visitor flag', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.isReturning, sch: () => z.number().int().min(0).max(1) }),
  new FictionAnalyticsCol({ key: 'isFake', clickHouseType: 'UInt8', description: 'Test data flag', sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`, getValue: ({ session }) => session.isFake, sch: () => z.number().int().min(0).max(1) }),

  // Engagement Metrics
  new FictionAnalyticsCol({ key: 'scrollTotal', clickHouseType: 'UInt16', description: 'Total scroll events count', sessionSelector: _ => `sum(${_.key}) as ${_.id}`, getValue: ({ event }) => event?.properties?.scrollTotal, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'keypressTotal', clickHouseType: 'UInt16', description: 'Total keypress events count', sessionSelector: _ => `sum(${_.key}) as ${_.id}`, getValue: ({ event }) => event.properties?.keypressTotal, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'clickTotal', clickHouseType: 'UInt16', description: 'Total click events count', sessionSelector: _ => `sum(${_.key}) as ${_.id}`, getValue: ({ event }) => event.properties?.clickTotal, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'touchTotal', clickHouseType: 'UInt16', description: 'Total touch events count', sessionSelector: _ => `sum(${_.key}) as ${_.id}`, getValue: ({ event }) => event.properties?.touchTotal, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'moveTotal', clickHouseType: 'UInt16', description: 'Total mouse events count', sessionSelector: _ => `sum(${_.key}) as ${_.id}`, getValue: ({ event }) => event.properties?.moveTotal, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'engageDuration', clickHouseType: 'UInt16', description: 'Active interaction time', sessionSelector: _ => `sum(${_.key}) as ${_.id}`, getValue: ({ event }) => event.properties?.engageDuration, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'replayDuration', clickHouseType: 'UInt16', description: 'Session recording length', sessionSelector: _ => `sum(${_.key}) as ${_.id}`, getValue: ({ event }) => event.properties?.replayDuration, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'scrollDepth', clickHouseType: 'Float32', description: 'Maximum scroll percentage reached', sessionSelector: _ => `avgIf(${_.key}, event='view' AND isFinite(${_.key})) as ${_.id}`, getValue: ({ event }) => event.properties?.scrollDepth, sch: () => z.number() }),

  // Event Properties
  new FictionAnalyticsCol({ key: 'reason', clickHouseType: 'LowCardinality(String)', description: 'Event trigger cause', getValue: ({ event }) => event.properties?.reason, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'conversion', clickHouseType: 'LowCardinality(String)', description: 'Event success type', getValue: ({ event }) => event.properties?.conversion, sch: () => z.string() }),
  new FictionAnalyticsCol({ key: 'selector', clickHouseType: 'String', description: 'DOM element target path', getValue: ({ event }) => event.properties?.selector, sch: () => z.string() }),

  // Extended Data
  new FictionAnalyticsCol({ key: 'context', clickHouseType: 'String', description: 'Event contextual data', getValue: ({ event }) => JSON.stringify(event.context || {}), sch: () => z.record(z.string(), z.any()) }),
  new FictionAnalyticsCol({ key: 'meta', clickHouseType: 'String', description: 'Event supplementary data', getValue: ({ event }) => JSON.stringify(event.meta || {}), sch: () => z.record(z.string(), z.any()) }),
  new FictionAnalyticsCol({ key: 'debug', clickHouseType: 'String', description: 'Event troubleshooting data', getValue: ({ event }) => JSON.stringify(event.debug || {}), sch: () => z.record(z.string(), z.string()) }),
  new FictionAnalyticsCol({ key: 'traits', clickHouseType: 'String', description: 'User profile data', getValue: ({ event }) => JSON.stringify(event.traits || {}), sch: () => z.record(z.string(), z.any()) }),
  new FictionAnalyticsCol({ key: 'trace', clickHouseType: 'String', description: 'Event reproduction steps', getValue: ({ event }) => event.properties?.trace, sch: () => z.string() }),

  // Sequence Tracking
  new FictionAnalyticsCol({ key: 'sessionNo', clickHouseType: 'UInt16', description: 'User visit count', sessionSelector: _ => `toUInt16(anyIf(${_.key}, event='init')) as ${_.id}`, getValue: ({ session }) => session.sessionNo, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'viewNo', clickHouseType: 'UInt16', description: 'Page view order number', getValue: ({ event }) => event.viewNo, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'eventNo', clickHouseType: 'UInt16', description: 'Event sequence order', getValue: ({ event }) => event.eventNo, sch: () => z.number() }),
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

export const eventFields = [
  ...baseFields,
  ...geoFields,
  ...referralFields,
] as const

// Session Analytics Fields
const sessionFields = [
  // Import Event Fields with Session Selectors
  ...eventFields.filter(f => f.sessionSelector),

  // Page and Event Counts
  new FictionAnalyticsCol({ key: 'pageCount', clickHouseType: 'UInt16', description: 'Total page views in session', sessionSelector: _ => `toInt16(countIf(event='view')) as ${_.id}`, getValue: ({ session }) => session.pageCount, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'totalEvents', clickHouseType: 'UInt16', description: 'Total events in session', sessionSelector: _ => `toInt16(count(*)) as ${_.id}`, getValue: ({ session }) => session.totalEvents, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'eventCount', clickHouseType: 'UInt16', description: 'Unique events in session', sessionSelector: _ => `toInt16(uniq(eventId)) as ${_.id}`, getValue: ({ session }) => session.eventCount, sch: () => z.number() }),

  // Session State Flags
  new FictionAnalyticsCol({ key: 'isClosed', clickHouseType: 'UInt8', description: 'Session properly closed', sessionSelector: _ => `if(countIf(event='session') > 0, 1, 0) as ${_.id}`, getValue: ({ session }) => session.isClosed, sch: () => z.number().int().min(0).max(1) }),
  new FictionAnalyticsCol({ key: 'isBounce', clickHouseType: 'UInt8', description: 'Single page session', sessionSelector: _ => `if(session__pageCount > 1, 0, 1) as ${_.id}`, getValue: ({ session }) => session.isBounce, sch: () => z.number().int().min(0).max(1) }),
  new FictionAnalyticsCol({ key: 'isRobot', clickHouseType: 'UInt8', description: 'Bot/crawler session', sessionSelector: _ => `if(countIf(event='bot') > 0, 1, 0) as ${_.id}`, getValue: ({ session }) => session.isRobot, sch: () => z.number().int().min(0).max(1) }),
  new FictionAnalyticsCol({ key: 'hasReplay', clickHouseType: 'UInt8', description: 'Session has replay data', sessionSelector: _ => `if(countIf(event='replay') > 0, 1, 0) as ${_.id}`, getValue: ({ session }) => session.hasReplay, sch: () => z.number().int().min(0).max(1) }),

  // Conversion Metrics
  new FictionAnalyticsCol({ key: 'totalGoalConversion', clickHouseType: 'UInt16', description: 'Count of goal conversions', sessionSelector: _ => `countIf(conversion='goal') as ${_.id}`, getValue: ({ session }) => session.totalGoalConversion, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'totalConversion', clickHouseType: 'UInt16', description: 'Count of all conversions', sessionSelector: _ => `countIf(conversion='conversion') as ${_.id}`, getValue: ({ session }) => session.totalConversion, sch: () => z.number() }),
  new FictionAnalyticsCol({ key: 'hasGoalConversion', clickHouseType: 'UInt8', description: 'Has any goal conversion', sessionSelector: _ => `if(session__totalGoalConversion > 0, 1, 0) as ${_.id}`, getValue: ({ session }) => session.hasGoalConversion, sch: () => z.number().int().min(0).max(1) }),
  new FictionAnalyticsCol({ key: 'hasConversion', clickHouseType: 'UInt8', description: 'Has any conversion', sessionSelector: _ => `if(session__totalConversion > 0, 1, 0) as ${_.id}`, getValue: ({ session }) => session.hasConversion, sch: () => z.number().int().min(0).max(1) }),
] as const

export function getSessionQuerySelectors(): string[] {
  return sessionFields
    .map((_) => {
      return _.sessionSelector ? _.sessionSelector({ key: _.key, id: `session__${_.key}` }) : undefined
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
