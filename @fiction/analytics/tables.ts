import { type ColDefaultValue, dayjs, objectId } from '@fiction/core'
import { z } from 'zod'
import { FictionAnalyticsCol, FictionAnalyticsTable } from './plugin-clickhouse/utils.js'
import { standardUrl } from './plugin-beacon/utils/index.js'

export const t = {
  event: 'analytics_event',
  session: 'analytics_session',
}

const baseFields = [
  new FictionAnalyticsCol({
    key: 'event',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    description: 'the primary name for the event',
    indexOn: true,
    getValue: ({ event }) => event.event,
    sch: ({ z }) => z.string(),
  }),
  new FictionAnalyticsCol({
    key: 'gen',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'LowCardinality(String)',
    description: 'the source type of event (core, user)',
    getValue: ({ event }) => event.gen,
    sch: ({ z }) => z.enum(['core', 'user', 'internal']),
  }),
  new FictionAnalyticsCol({
    key: 'isCore',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt8',
    description: 'is an core event',
    sch: ({ z }) => z.boolean(),
    getValue: ({ event }) => {
      return event.gen === 'core' || event.gen === 'internal' ? 1 : 0
    },
  }),
  new FictionAnalyticsCol({
    key: 'isInternal',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt8',
    description: 'is an internal event (e.g. session, init)',
    sch: ({ z }) => z.boolean(),
    getValue: ({ event }) => (event.gen === 'internal' ? 1 : 0),
  }),
  new FictionAnalyticsCol({
    key: 'isCustom',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt8',
    description: 'is an custom user event',
    sch: () => z.string(),
    getValue: ({ event }) => (event.gen === 'user' || !event.gen ? 1 : 0),
  }),
  new FictionAnalyticsCol({
    key: 'type',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'LowCardinality(String)',
    description: 'the track type of event (track, page, identify, group, session, debug)',
    sch: () => z.string(),
    getValue: ({ event }) => event.type,
  }),

  new FictionAnalyticsCol({
    sch: () => z.string(),
    key: 'sessionId',
    indexOn: true,
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    sessionSelector: _ => `${_.key} as ${_.id}`,
    getValue: ({ session }) => session.sessionId,
  }),

  new FictionAnalyticsCol({
    key: 'anonymousId',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    sessionSelector: ({ key, id }) => `any(${key}) as ${id}`,
    description: 'random ID assigned to client and stored in cookie',
    indexOn: true,
    sch: () => z.string(),
    getValue: ({ session }) => session.anonymousId,
  }),
  new FictionAnalyticsCol({
    key: 'userId',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    sessionSelector: ({ key, id }) => `anyIf(${key}, event='session') as ${id}`,
    description: 'random ID assigned to client and stored in cookie',
    indexOn: true,
    sch: () => z.string(),
    getValue: ({ session }) => session.userId,
  }),
  new FictionAnalyticsCol({
    key: 'orgId',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    description: 'the orgId associated with this event',
    indexOn: true,
    sch: () => z.string(),
    getValue: ({ session }) => session.orgId,
  }),
  new FictionAnalyticsCol({
    sch: () => z.string(),
    key: 'sentAt',
    make: ({ s, col }) => s.dateTime(col.k),
    clickHouseType: 'DateTime',
    description: 'timestamp for event sent from client',
    getValue: ({ event }) => dayjs(event.sentAt).unix(),
  }),
  new FictionAnalyticsCol({
    key: 'receivedAt',
    make: ({ s, col }) => s.dateTime(col.k),
    clickHouseType: 'DateTime',
    description: 'timestamp for event received by server',
    sch: () => z.string(),
    getValue: ({ event }) => dayjs(event.receivedAt).unix(),
  }),
  new FictionAnalyticsCol({
    key: 'timestamp',
    make: ({ s, col }) => s.dateTime(col.k),
    clickHouseType: 'DateTime',
    sessionSelector: _ => `min(${_.key}) as ${_.id}`,
    description: 'timestamp for event or session',
    sch: () => z.union([z.string(), z.number()]),
    getValue: ({ event }) => dayjs(event.timestamp).unix(),
  }),
  new FictionAnalyticsCol({
    sch: () => z.string(),
    key: 'reason',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'LowCardinality(String)',
    description: 'why this event was thrown',
    getValue: ({ event }) => event.properties?.reason,
  }),
  new FictionAnalyticsCol({
    sch: () => z.string(),
    key: 'conversion',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'LowCardinality(String)',
    description: 'type of conversion',
    getValue: ({ event }) => event.properties?.conversion,
  }),
  new FictionAnalyticsCol({
    sch: () => z.string(),
    key: 'category',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    getValue: ({ event }) => event.properties?.category,
  }),
  new FictionAnalyticsCol({
    sch: () => z.string(),
    key: 'label',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    getValue: ({ event }) => event.properties?.label,
  }),
  new FictionAnalyticsCol({
    sch: () => z.string(),
    key: 'action',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    getValue: ({ event }) => event.properties?.action,
  }),
  new FictionAnalyticsCol({
    key: 'selector',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    description: 'selector (e.g. dom) that triggered event',
    sch: () => z.string(),
    getValue: ({ event }) => event.properties?.selector,
  }),

  new FictionAnalyticsCol({
    key: 'value',
    make: ({ s, col }) => s.float(col.k),
    clickHouseType: 'Float32',
    sch: () => z.number(),
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.value,
  }),
  new FictionAnalyticsCol({
    sch: () => z.record(z.string(), z.any()),
    key: 'context',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    description: 'context where event was triggered',
    getValue: ({ event }) => JSON.stringify(event.context || {}),
  }),
  new FictionAnalyticsCol({
    key: 'meta',
    make: ({ s, col }) => s.jsonb(col.k),
    clickHouseType: 'String',
    sch: () => z.record(z.string(), z.any()),
    getValue: ({ event }) => JSON.stringify(event.meta || {}),
  }),
  new FictionAnalyticsCol({
    key: 'debug',
    make: ({ s, col }) => s.jsonb(col.k),
    clickHouseType: 'String',
    sch: () => z.record(z.string(), z.string()),
    getValue: ({ event }) => JSON.stringify(event.debug || {}),
  }),

  new FictionAnalyticsCol({
    key: 'traits',
    make: ({ s, col }) => s.jsonb(col.k),
    clickHouseType: 'String',
    sch: () => z.record(z.string(), z.any()),
    getValue: ({ event }) => JSON.stringify(event.traits || {}),
  }),
  new FictionAnalyticsCol({
    key: 'trace',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    description: 'stack trace / reproduction trace',
    sch: () => z.string(),
    getValue: ({ event }) => event.properties?.trace,
  }),
  new FictionAnalyticsCol({
    key: 'pathname',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    description: 'url pathname',
    indexOn: true,
    sch: () => z.string(),
    getValue: ({ event }) => {
      const url = event.context?.page?.url
      return standardUrl({ url, part: 'pathname' })
    },
  }),
  new FictionAnalyticsCol({
    sch: () => z.string(),
    key: 'origin',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    description: 'url origin',
    getValue: ({ event }) => {
      const url = event.context?.page?.url
      return standardUrl({ url, part: 'origin' })
    },
  }),
  new FictionAnalyticsCol({
    sch: () => z.string(),
    key: 'url',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    description: 'url origin',
    getValue: ({ event }) => {
      const url = event.context?.page?.url ?? ''
      return url.replace(/\/$/, '')
    },
  }),
  new FictionAnalyticsCol({
    sch: () => z.string(),
    key: 'search',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    description: 'url search',
    getValue: ({ event }) => {
      const url = event.context?.page?.url
      return standardUrl({ url, part: 'search' })
    },
  }),
  new FictionAnalyticsCol({
    sch: () => z.string(),
    key: 'os',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'LowCardinality(String)',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    description: 'operating system',
    getValue: ({ session }) => session.os,
  }),
  new FictionAnalyticsCol({
    key: 'browser',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'LowCardinality(String)',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    sch: () => z.string(),
    getValue: ({ session }) => session.browser,
  }),
  new FictionAnalyticsCol({
    sch: () => z.string(),
    key: 'deviceType',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'LowCardinality(String)',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.deviceType,
  }),
  new FictionAnalyticsCol({
    sch: () => z.string(),
    key: 'locale',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'LowCardinality(String)',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.locale,
  }),

  new FictionAnalyticsCol({
    sch: () => z.string(),
    key: 'ip',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.ip,
  }),
  new FictionAnalyticsCol({
    key: 'isReturning',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt8',
    sch: () => z.number().int().min(0).max(1),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.isReturning,
  }),

  new FictionAnalyticsCol({
    key: 'isFake',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt8',
    sch: () => z.number().int().min(0).max(1),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.isFake,
  }),

  new FictionAnalyticsCol({
    key: 'timezone',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'LowCardinality(String)',
    sch: () => z.string(),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.timezone,
  }),
  new FictionAnalyticsCol({
    key: 'duration',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt16',
    description: 'total duration from start to end of session',
    sch: () => z.number(),
    sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`,
    getValue: ({ event, session }) => event.event === 'session' ? session.duration : undefined,
  }),
  new FictionAnalyticsCol({
    sch: () => z.union([z.string(), z.number()]),
    key: 'startedAt',
    make: ({ s, col }) => s.dateTime(col.k),
    clickHouseType: 'DateTime',
    sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`,
    getValue: ({ event, session }) => event.event === 'session'
      ? session.startedAt
      : dayjs(event.timestamp).unix(),
  }),
  new FictionAnalyticsCol({
    sch: () => z.union([z.string(), z.number()]),
    key: 'endedAt',
    make: ({ s, col }) => s.dateTime(col.k),
    clickHouseType: 'DateTime',
    sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`,
    getValue: ({ event, session }) => event.event === 'session' ? session.endedAt : dayjs(event.timestamp).unix(),
  }),
  new FictionAnalyticsCol({
    sch: () => z.string(),
    key: 'entryPage',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    description: 'first page viewed in session',
    sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`,
    getValue: ({ event, session }) => event.event === 'session' ? session.entryPage : undefined,
  }),
  new FictionAnalyticsCol({
    sch: () => z.string(),
    key: 'exitPage',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    description: 'last page viewed in session',
    sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`,
    getValue: ({ event, session }) => event.event === 'session' ? session.exitPage : undefined,
  }),

  new FictionAnalyticsCol({
    sch: () => z.string(),
    key: 'channel',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    description: 'source of the event (e.g. tag)',
    getValue: ({ event }) => event?.channel,
  }),
  new FictionAnalyticsCol({
    key: 'scrollTotal',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt16',
    description: 'scrolls at exit',
    sch: () => z.number(),
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event?.properties?.scrollTotal,
  }),
  new FictionAnalyticsCol({
    key: 'keypressTotal',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt16',
    description: 'presses at exit',
    sch: () => z.number(),
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.keypressTotal,
  }),
  new FictionAnalyticsCol({
    key: 'clickTotal',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt16',
    description: 'clicks at exit',
    sch: () => z.number(),
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.clickTotal,
  }),
  new FictionAnalyticsCol({
    key: 'touchTotal',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt16',
    description: 'touches at exit',
    sch: () => z.number(),
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.touchTotal,
  }),
  new FictionAnalyticsCol({
    key: 'moveTotal',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt16',
    description: 'moves at exit',
    sch: () => z.number(),
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.moveTotal,
  }),

  new FictionAnalyticsCol({
    key: 'engageDuration',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt16',
    description: 'seconds engaged and triggering events',
    sch: () => z.number(),
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.engageDuration,
  }),
  new FictionAnalyticsCol({
    key: 'replayDuration',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt16',
    description: 'recorded duration for replay',
    sch: () => z.number(),
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.replayDuration,
  }),
  new FictionAnalyticsCol({
    key: 'scrollDepth',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'Float32',
    description: 'percent of scrolled page at exit',
    sch: () => z.number(),
    sessionSelector: _ => `avgIf(${_.key}, event='view' AND isFinite(${_.key})) as ${_.id}`,
    getValue: ({ event }) => event.properties?.scrollDepth,
  }),
  new FictionAnalyticsCol({
    key: 'sessionNo',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt16',
    description: 'how many sessions this user has had',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    sch: () => z.number(),
    getValue: ({ session }) => session.sessionNo,
  }),
  new FictionAnalyticsCol({
    key: 'viewNo',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt16',
    description: 'which page view in session associated with',
    sch: () => z.number(),
    getValue: ({ event }) => event.viewNo,
  }),
  new FictionAnalyticsCol({
    key: 'eventNo',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt16',
    description: 'which incremental event number in session',
    sch: () => z.number(),
    getValue: ({ event }) => event.eventNo,
  }),
  new FictionAnalyticsCol({
    sch: () => z.string(),
    key: 'version',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    description: 'client version used',
    getValue: ({ session }) => session.version,
  }),
  new FictionAnalyticsCol({
    key: 'eventId',
    sch: () => z.string(),
    make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`generate_object_id()`)),
    clickHouseType: 'String',
    getValue: ({ event }) => event.eventId,
  }),
  new FictionAnalyticsCol({
    sch: () => z.string(),
    key: 'messageId',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    description: 'id for event batch where event arrived',
    getValue: ({ event }) => event?.messageId,
  }),
] as const

const geoFields = [
  new FictionAnalyticsCol({
    key: 'countryCode',
    make: ({ s, col }) => s.string(col.k),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    clickHouseType: 'LowCardinality(String)',
    sch: () => z.string(),
    getValue: ({ session }) => session.countryCode,
  }),
  new FictionAnalyticsCol({
    key: 'regionName',
    make: ({ s, col }) => s.string(col.k),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    clickHouseType: 'LowCardinality(String)',
    sch: () => z.string(),
    getValue: ({ session }) => session.regionName,
  }),
  new FictionAnalyticsCol({
    key: 'cityName',
    make: ({ s, col }) => s.string(col.k),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    clickHouseType: 'LowCardinality(String)',
    sch: () => z.string(),
    getValue: ({ session }) => session.cityName,
  }),
  new FictionAnalyticsCol({
    key: 'latitude',
    make: ({ s, col }) => s.string(col.k),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    clickHouseType: 'Float32',
    sch: () => z.number(),
    getValue: ({ session }) => session.latitude,
  }),
  new FictionAnalyticsCol({
    key: 'longitude',
    make: ({ s, col }) => s.string(col.k),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    clickHouseType: 'Float32',
    sch: () => z.number(),
    getValue: ({ session }) => session.longitude,
  }),
] as const

const referralFields = [
  new FictionAnalyticsCol({
    sch: () => z.string(),
    key: 'referrer',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.referrer,
  }),
  new FictionAnalyticsCol({
    key: 'referralSource',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    sch: () => z.string(),
    getValue: ({ session }) => session.referralSource,
  }),
  new FictionAnalyticsCol({
    key: 'referralCampaign',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    sch: () => z.string(),
    getValue: ({ session }) => session.referralCampaign,
  }),
  new FictionAnalyticsCol({
    key: 'referralMedium',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    sch: () => z.string(),
    getValue: ({ session }) => session.referralMedium,
  }),
  new FictionAnalyticsCol({
    key: 'referralTerm',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    sch: () => z.string(),
    getValue: ({ session }) => session.referralTerm,
  }),
  new FictionAnalyticsCol({
    key: 'referralContent',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    sch: () => z.string(),
    getValue: ({ session }) => session.referralContent,
  }),
  new FictionAnalyticsCol({
    key: 'referralTitle',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    sch: () => z.string(),
    getValue: ({ session }) => session.referralTitle,
  }),
  new FictionAnalyticsCol({
    key: 'referralDescription',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    sch: () => z.string(),
    getValue: ({ session }) => session.referralDescription,
  }),
  new FictionAnalyticsCol({
    key: 'referralCanonicalUrl',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    sch: () => z.string(),
    getValue: ({ session }) => session.referralCanonicalUrl,
  }),
  new FictionAnalyticsCol({
    key: 'referralImage',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    sch: () => z.string(),
    getValue: ({ session }) => session.referralImage,
  }),
] as const

const emailEventFields = [
  new FictionAnalyticsCol({
    key: 'emailId',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    description: 'Unique identifier for the email',
    indexOn: true,
    sch: () => z.string(),
    getValue: ({ event }) => event.email?.emailId,
  }),
  new FictionAnalyticsCol({
    key: 'campaignId',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    description: 'Unique identifier for the campaign',
    indexOn: true,
    sch: () => z.string(),
    getValue: ({ event }) => event.email?.campaignId,
  }),
  new FictionAnalyticsCol({
    key: 'emailEventType',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'LowCardinality(String)',
    description: 'Type of email event (open, click, delivered, etc.)',
    sch: () => z.string(),
    getValue: ({ event }) => event.email?.eventType,
  }),
  new FictionAnalyticsCol({
    key: 'emailSubject',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    description: 'Subject line of the email',
    sch: () => z.string(),
    getValue: ({ event }) => event.email?.subject,
  }),
  new FictionAnalyticsCol({
    key: 'emailTemplateId',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    description: 'Template identifier used for the email',
    sch: () => z.string(),
    getValue: ({ event }) => event.email?.templateId,
  }),
  new FictionAnalyticsCol({
    key: 'emailClickedUrl',
    make: ({ s, col }) => s.string(col.k),
    clickHouseType: 'String',
    description: 'URL clicked within the email',
    sch: () => z.string(),
    getValue: ({ event }) => event.email?.clickedUrl,
  }),
  new FictionAnalyticsCol({
    key: 'emailOpenedAt',
    make: ({ s, col }) => s.dateTime(col.k),
    clickHouseType: 'DateTime',
    description: 'Timestamp when the email was opened',
    getValue: ({ event }) => dayjs(event.email?.openedAt).unix(),
    sch: () => z.string(),
  }),
  new FictionAnalyticsCol({
    key: 'emailClickedAt',
    make: ({ s, col }) => s.dateTime(col.k),
    clickHouseType: 'DateTime',
    description: 'Timestamp when a link in the email was clicked',
    getValue: ({ event }) => dayjs(event.email?.clickedAt).unix(),
    sch: () => z.string(),
  }),
] as const

export const eventFields = [...baseFields, ...geoFields, ...referralFields, ...emailEventFields] as const

const sessionFields = [
  ...eventFields.filter(f => f.sessionSelector),
  new FictionAnalyticsCol({
    key: 'pageCount',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt16',
    sessionSelector: _ => `countIf(event='view') as ${_.id}`,
    sch: () => z.number(),
    getValue: ({ session }) => session.pageCount,
  }),

  new FictionAnalyticsCol({
    key: 'isClosed',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt8',
    sessionSelector: _ => `if(countIf(event='session') > 0, 1, 0) as ${_.id}`,
    sch: () => z.number().int().min(0).max(1),
    getValue: ({ session }) => session.isClosed,
  }),
  new FictionAnalyticsCol({
    key: 'isBounce',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt8',
    sessionSelector: _ => `if(session_pageCount > 1, 0, 1) as ${_.id}`,
    sch: () => z.number().int().min(0).max(1),
    getValue: ({ session }) => session.isBounce,
  }),
  new FictionAnalyticsCol({
    key: 'totalEvents',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt16',
    sessionSelector: _ => `count(*) as ${_.id}`,
    sch: () => z.number(),
    getValue: ({ session }) => session.totalEvents,
  }),
  new FictionAnalyticsCol({
    key: 'isRobot',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt8',
    sessionSelector: _ => `if(countIf(event='bot') > 0, 1, 0) as ${_.id}`,
    sch: () => z.number().int().min(0).max(1),
    getValue: ({ session }) => session.isRobot,
  }),
  new FictionAnalyticsCol({
    key: 'hasReplay',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt8',
    sessionSelector: _ => `if(countIf(event='replay') > 0, 1, 0) as ${_.id}`,
    sch: () => z.number().int().min(0).max(1),
    getValue: ({ session }) => session.hasReplay,
  }),
  new FictionAnalyticsCol({
    key: 'totalGoalConversion',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt16',
    sessionSelector: _ => `countIf(conversion='goal') as ${_.id}`,
    sch: () => z.number(),
    getValue: ({ session }) => session.totalGoalConversion,
  }),
  new FictionAnalyticsCol({
    key: 'totalConversion',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt16',
    sessionSelector: _ => `countIf(conversion='conversion') as ${_.id}`,
    sch: () => z.number(),
    getValue: ({ session }) => session.totalConversion,
  }),
  new FictionAnalyticsCol({
    key: 'hasGoalConversion',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt8',
    sessionSelector: _ => `if(session_totalGoalConversion > 0, 1, 0) as ${_.id}`,
    sch: () => z.number().int().min(0).max(1),
    getValue: ({ session }) => session.hasGoalConversion,
  }),
  new FictionAnalyticsCol({
    key: 'hasConversion',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt8' as const,
    sessionSelector: _ => `if(session_totalConversion > 0, 1, 0) as ${_.id}`,
    sch: () => z.number().int().min(0).max(1),
    getValue: ({ session }) => session.hasConversion,
  }),
  new FictionAnalyticsCol({
    key: 'eventCount',
    make: ({ s, col }) => s.integer(col.k),
    clickHouseType: 'UInt16',
    sessionSelector: _ => `uniq(eventId) as ${_.id}`,
    sch: () => z.number(),
    getValue: ({ session }) => session.eventCount,
  }),
] as const

export function getSessionQuerySelectors(): string[] {
  return sessionFields
    .map((_) => {
      return _.sessionSelector ? _.sessionSelector({ key: _.key, id: `session_${_.key}` }) : undefined
    })
    .filter(Boolean) as string[]
}

export const eventsTable = new FictionAnalyticsTable({ tableKey: t.event, cols: eventFields })

export const sessionsTable = new FictionAnalyticsTable({ tableKey: t.session, cols: sessionFields })

export function isSessionField(field: keyof EventParams) {
  const found = eventFields.find(f => f.key === field)
  return found?.sessionSelector ?? false
}

export const allTables = [eventsTable, sessionsTable]

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
