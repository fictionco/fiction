import { dayjs, objectId } from '@fiction/core'

import type { CreateObjectType } from '@fiction/core'
import { FictionAnalyticsCol, FictionAnalyticsTable } from './plugin-clickhouse/utils'
import { standardUrl } from './plugin-beacon/utils'

const baseFields = [
  new FictionAnalyticsCol({
    key: 'event',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'the primary name for the event',
    indexOn: true,
    default: () => '' as string,
    getValue: ({ event }) => event.event,
  }),
  new FictionAnalyticsCol({
    key: 'gen',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'LowCardinality(String)',
    description: 'the source type of event (core, user)',
    default: () => '' as 'core' | 'user' | 'internal',
    getValue: ({ event }) => event.gen,
  }),
  new FictionAnalyticsCol({
    key: 'isCore',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    description: 'is an core event',
    default: () => '' as string,
    getValue: ({ event }) => {
      return event.gen === 'core' || event.gen === 'internal' ? 1 : 0
    },
  }),
  new FictionAnalyticsCol({
    key: 'isInternal',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    description: 'is an internal event (e.g. session, init)',
    default: () => '' as string,
    getValue: ({ event }) => (event.gen === 'internal' ? 1 : 0),
  }),
  new FictionAnalyticsCol({
    key: 'isCustom',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    description: 'is an custom user event',
    default: () => '' as string,
    getValue: ({ event }) => (event.gen === 'user' || !event.gen ? 1 : 0),
  }),
  new FictionAnalyticsCol({
    key: 'type',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'LowCardinality(String)',
    description: 'the track type of event (track, page, identify, group, session, debug)',
    default: () => '' as string,
    getValue: ({ event }) => event.type,
  }),

  new FictionAnalyticsCol({
    default: () => '' as string,
    key: 'sessionId',
    indexOn: true,
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    sessionSelector: _ => `${_.key} as ${_.id}`,
    getValue: ({ session }) => session.sessionId,
  }),

  new FictionAnalyticsCol({
    key: 'anonymousId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    sessionSelector: ({ key, id }) => `any(${key}) as ${id}`,
    description: 'random ID assigned to client and stored in cookie',
    indexOn: true,
    default: () => '' as string,
    getValue: ({ session }) => session.anonymousId,
  }),
  new FictionAnalyticsCol({
    key: 'userId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    sessionSelector: ({ key, id }) => `anyIf(${key}, event='session') as ${id}`,
    description: 'random ID assigned to client and stored in cookie',
    indexOn: true,
    default: () => '' as string,
    getValue: ({ session }) => session.userId,
  }),
  new FictionAnalyticsCol({
    key: 'projectId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    description: 'the projectId associated with this event',
    indexOn: true,
    default: () => '' as string,
    getValue: ({ session }) => session.projectId,
  }),
  new FictionAnalyticsCol({
    default: () => '' as string,
    key: 'organizationId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    description: 'the organizationId associated with this event',
    indexOn: true,
    getValue: ({ session }) => session.organizationId,
  }),
  new FictionAnalyticsCol({
    default: () => Date.now(),
    key: 'sentAt',
    create: ({ schema, column }) => schema.dateTime(column.pgKey),
    clickHouseType: 'DateTime',
    description: 'timestamp for event sent from client',
    getValue: ({ event }) => dayjs(event.sentAt).unix(),
  }),
  new FictionAnalyticsCol({
    key: 'receivedAt',
    create: ({ schema, column }) => schema.dateTime(column.pgKey),
    clickHouseType: 'DateTime',
    description: 'timestamp for event received by server',
    default: () => Date.now(),
    getValue: ({ event }) => dayjs(event.receivedAt).unix(),
  }),
  new FictionAnalyticsCol({
    key: 'timestamp',
    create: ({ schema, column }) => schema.dateTime(column.pgKey),
    clickHouseType: 'DateTime',
    sessionSelector: _ => `min(${_.key}) as ${_.id}`,
    description: 'timestamp for event or session',
    default: () => Date.now() as number | string,
    getValue: ({ event }) => dayjs(event.timestamp).unix(),
  }),
  new FictionAnalyticsCol({
    default: () => '' as string,
    key: 'reason',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'LowCardinality(String)',
    description: 'why this event was thrown',
    getValue: ({ event }) => event.properties?.reason,
  }),
  new FictionAnalyticsCol({
    default: () => '' as string,
    key: 'conversion',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'LowCardinality(String)',
    description: 'type of conversion',
    getValue: ({ event }) => event.properties?.conversion,
  }),
  new FictionAnalyticsCol({
    default: () => '' as string,
    key: 'category',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    getValue: ({ event }) => event.properties?.category,
  }),
  new FictionAnalyticsCol({
    default: () => '' as string,
    key: 'label',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    getValue: ({ event }) => event.properties?.label,
  }),
  new FictionAnalyticsCol({
    default: () => '' as string,
    key: 'action',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    getValue: ({ event }) => event.properties?.action,
  }),
  new FictionAnalyticsCol({
    key: 'selector',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'selector (e.g. dom) that triggered event',
    default: () => '' as string,
    getValue: ({ event }) => event.properties?.selector,
  }),

  new FictionAnalyticsCol({
    key: 'value',
    create: ({ schema, column }) => schema.float(column.pgKey),
    clickHouseType: 'Float32',
    default: () => 0 as number,
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.value,
  }),
  new FictionAnalyticsCol({
    default: () => ({} as Record<string, unknown> | string),
    key: 'context',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'context where event was triggered',
    getValue: ({ event }) => JSON.stringify(event.context || {}),
  }),
  new FictionAnalyticsCol({
    key: 'meta',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    clickHouseType: 'String',
    default: () => ({} as Record<string, unknown> | string),
    getValue: ({ event }) => JSON.stringify(event.meta || {}),
  }),
  new FictionAnalyticsCol({
    key: 'debug',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    clickHouseType: 'String',
    default: () => ({} as Record<string, unknown> | string),
    getValue: ({ event }) => JSON.stringify(event.debug || {}),
  }),

  new FictionAnalyticsCol({
    key: 'traits',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    clickHouseType: 'String',
    default: () => ({} as Record<string, unknown> | string),
    getValue: ({ event }) => JSON.stringify(event.traits || {}),
  }),
  new FictionAnalyticsCol({
    key: 'trace',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'stack trace / reproduction trace',
    default: () => '' as string,
    getValue: ({ event }) => event.properties?.trace,
  }),
  new FictionAnalyticsCol({
    key: 'pathname',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'url pathname',
    indexOn: true,
    default: () => '' as string,
    getValue: ({ event }) => {
      const url = event.context?.page?.url
      return standardUrl({ url, part: 'pathname' })
    },
  }),
  new FictionAnalyticsCol({
    default: () => '' as string,
    key: 'origin',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'url origin',
    getValue: ({ event }) => {
      const url = event.context?.page?.url
      return standardUrl({ url, part: 'origin' })
    },
  }),
  new FictionAnalyticsCol({
    default: () => '' as string,
    key: 'url',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'url origin',
    getValue: ({ event }) => {
      const url = event.context?.page?.url ?? ''
      return url.replace(/\/$/, '')
    },
  }),
  new FictionAnalyticsCol({
    default: () => '' as string,
    key: 'search',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'url search',
    getValue: ({ event }) => {
      const url = event.context?.page?.url
      return standardUrl({ url, part: 'search' })
    },
  }),
  new FictionAnalyticsCol({
    default: () => '' as string,
    key: 'os',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'LowCardinality(String)',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    description: 'operating system',
    getValue: ({ session }) => session.os,
  }),
  new FictionAnalyticsCol({
    key: 'browser',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'LowCardinality(String)',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => '' as string,
    getValue: ({ session }) => session.browser,
  }),
  new FictionAnalyticsCol({
    default: () => '' as string,
    key: 'deviceType',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'LowCardinality(String)',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.deviceType,
  }),
  new FictionAnalyticsCol({
    default: () => '' as string,
    key: 'locale',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'LowCardinality(String)',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.locale,
  }),

  new FictionAnalyticsCol({
    default: () => '' as string,
    key: 'ip',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.ip,
  }),
  new FictionAnalyticsCol({
    key: 'isReturning',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    default: () => 0 as 1 | 0,
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.isReturning,
  }),

  new FictionAnalyticsCol({
    key: 'isFake',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    default: () => 0 as 1 | 0,
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.isFake,
  }),

  new FictionAnalyticsCol({
    key: 'timezone',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'LowCardinality(String)',
    default: () => '' as string,
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.timezone,
  }),
  new FictionAnalyticsCol({
    key: 'duration',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'total duration from start to end of session',
    default: () => 0 as number,
    sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`,
    getValue: ({ event, session }) =>
      event.event === 'session' ? session.duration : undefined,
  }),
  new FictionAnalyticsCol({
    default: () => Date.now(),
    key: 'startedAt',
    create: ({ schema, column }) => schema.dateTime(column.pgKey),
    clickHouseType: 'DateTime',
    sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`,
    getValue: ({ event, session }) =>
      event.event === 'session'
        ? session.startedAt
        : dayjs(event.timestamp).unix(),
  }),
  new FictionAnalyticsCol({
    default: () => Date.now(),
    key: 'endedAt',
    create: ({ schema, column }) => schema.dateTime(column.pgKey),
    clickHouseType: 'DateTime',
    sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`,
    getValue: ({ event, session }) =>
      event.event === 'session'
        ? session.endedAt
        : dayjs(event.timestamp).unix(),
  }),
  new FictionAnalyticsCol({
    default: () => '' as string,
    key: 'entryPage',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'first page viewed in session',
    sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`,
    getValue: ({ event, session }) =>
      event.event === 'session' ? session.entryPage : undefined,
  }),
  new FictionAnalyticsCol({
    default: () => '' as string,
    key: 'exitPage',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'last page viewed in session',
    sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`,
    getValue: ({ event, session }) =>
      event.event === 'session' ? session.exitPage : undefined,
  }),

  new FictionAnalyticsCol({
    default: () => '' as string,
    key: 'channel',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'source of the event (e.g. tag)',
    getValue: ({ event }) => event?.channel,
  }),
  new FictionAnalyticsCol({
    key: 'scrollTotal',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'scrolls at exit',
    default: () => 0 as number,
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event?.properties?.scrollTotal,
  }),
  new FictionAnalyticsCol({
    key: 'keypressTotal',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'presses at exit',
    default: () => 0 as number,
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.keypressTotal,
  }),
  new FictionAnalyticsCol({
    key: 'clickTotal',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'clicks at exit',
    default: () => 0 as number,
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.clickTotal,
  }),
  new FictionAnalyticsCol({
    key: 'touchTotal',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'touches at exit',
    default: () => 0 as number,
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.touchTotal,
  }),
  new FictionAnalyticsCol({
    key: 'moveTotal',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'moves at exit',
    default: () => 0 as number,
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.moveTotal,
  }),

  new FictionAnalyticsCol({
    key: 'engageDuration',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'seconds engaged and triggering events',
    default: () => 0 as number,
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.engageDuration,
  }),
  new FictionAnalyticsCol({
    key: 'replayDuration',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'recorded duration for replay',
    default: () => 0 as number,
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.replayDuration,
  }),
  new FictionAnalyticsCol({
    key: 'scrollDepth',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'Float32',
    description: 'percent of scrolled page at exit',
    default: () => 0 as number,
    sessionSelector: _ =>
      `avgIf(${_.key}, event='view' AND isFinite(${_.key})) as ${_.id}`,
    getValue: ({ event }) => event.properties?.scrollDepth,
  }),
  new FictionAnalyticsCol({
    key: 'sessionNo',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'how many sessions this user has had',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => 0 as number,
    getValue: ({ session }) => session.sessionNo,
  }),
  new FictionAnalyticsCol({
    key: 'viewNo',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'which page view in session associated with',
    default: () => 0 as number,
    getValue: ({ event }) => event.viewNo,
  }),
  new FictionAnalyticsCol({
    key: 'eventNo',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'which incremental event number in session',
    default: () => 0 as number,
    getValue: ({ event }) => event.eventNo,
  }),
  new FictionAnalyticsCol({
    default: () => '' as string,
    key: 'version',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    description: 'client version used',
    getValue: ({ session }) => session.version,
  }),
  new FictionAnalyticsCol({
    key: 'eventId',
    default: () => objectId(),
    create: ({ schema, column, db }) => schema.string(column.pgKey).primary().defaultTo(db.raw(`generate_object_id()`)),
    clickHouseType: 'String',
    getValue: ({ event }) => event.eventId,
  }),
  new FictionAnalyticsCol({
    default: () => '' as string,
    key: 'messageId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'id for event batch where event arrived',
    getValue: ({ event }) => event?.messageId,
  }),
] as const

const geoFields = [
  new FictionAnalyticsCol({
    key: 'countryCode',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    clickHouseType: 'LowCardinality(String)',
    default: () => '' as string,
    getValue: ({ session }) => session.countryCode,
  }),
  new FictionAnalyticsCol({
    key: 'regionName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    clickHouseType: 'LowCardinality(String)',
    default: () => '' as string,
    getValue: ({ session }) => session.regionName,
  }),
  new FictionAnalyticsCol({
    key: 'cityName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    clickHouseType: 'LowCardinality(String)',
    default: () => '' as string,
    getValue: ({ session }) => session.cityName,
  }),
  new FictionAnalyticsCol({
    key: 'latitude',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    clickHouseType: 'Float32',
    default: () => 0 as number,
    getValue: ({ session }) => session.latitude,
  }),
  new FictionAnalyticsCol({
    key: 'longitude',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    clickHouseType: 'Float32',
    default: () => 0 as number,
    getValue: ({ session }) => session.longitude,
  }),
] as const

const referralFields = [
  new FictionAnalyticsCol({
    default: () => '' as string,
    key: 'referrer',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.referrer,
  }),
  new FictionAnalyticsCol({
    key: 'referralSource',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => '' as string,
    getValue: ({ session }) => session.referralSource,
  }),
  new FictionAnalyticsCol({
    key: 'referralCampaign',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => '' as string,
    getValue: ({ session }) => session.referralCampaign,
  }),
  new FictionAnalyticsCol({
    key: 'referralMedium',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => '' as string,
    getValue: ({ session }) => session.referralMedium,
  }),
  new FictionAnalyticsCol({
    key: 'referralTerm',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => '' as string,
    getValue: ({ session }) => session.referralTerm,
  }),
  new FictionAnalyticsCol({
    key: 'referralContent',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => '' as string,
    getValue: ({ session }) => session.referralContent,
  }),
  new FictionAnalyticsCol({
    key: 'referralTitle',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => '' as string,
    getValue: ({ session }) => session.referralTitle,
  }),
  new FictionAnalyticsCol({
    key: 'referralDescription',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => '' as string,
    getValue: ({ session }) => session.referralDescription,
  }),
  new FictionAnalyticsCol({
    key: 'referralCanonicalUrl',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => '' as string,
    getValue: ({ session }) => session.referralCanonicalUrl,
  }),
  new FictionAnalyticsCol({
    key: 'referralImage',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => '' as string,
    getValue: ({ session }) => session.referralImage,
  }),
] as const

export const eventFields = [...baseFields, ...geoFields, ...referralFields] as const

const sessionFields = [
  ...eventFields.filter(f => f.sessionSelector),
  new FictionAnalyticsCol({
    key: 'pageCount',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    sessionSelector: _ => `countIf(event='view') as ${_.id}`,
    default: () => 0 as number,
    getValue: ({ session }) => session.pageCount,
  }),

  new FictionAnalyticsCol({
    key: 'isClosed',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    sessionSelector: _ => `if(countIf(event='session') > 0, 1, 0) as ${_.id}`,
    default: () => 0 as 1 | 0,
    getValue: ({ session }) => session.isClosed,
  }),
  new FictionAnalyticsCol({
    key: 'isBounce',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    sessionSelector: _ => `if(session_pageCount > 1, 0, 1) as ${_.id}`,
    default: () => 0 as 1 | 0,
    getValue: ({ session }) => session.isBounce,
  }),
  new FictionAnalyticsCol({
    key: 'totalEvents',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    sessionSelector: _ => `count(*) as ${_.id}`,
    default: () => 0 as number,
    getValue: ({ session }) => session.totalEvents,
  }),
  new FictionAnalyticsCol({
    key: 'isRobot',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    sessionSelector: _ => `if(countIf(event='bot') > 0, 1, 0) as ${_.id}`,
    default: () => 0 as 1 | 0,
    getValue: ({ session }) => session.isRobot,
  }),
  new FictionAnalyticsCol({
    key: 'hasReplay',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    sessionSelector: _ => `if(countIf(event='replay') > 0, 1, 0) as ${_.id}`,
    default: () => 0 as 1 | 0,
    getValue: ({ session }) => session.hasReplay,
  }),
  new FictionAnalyticsCol({
    key: 'totalGoalConversion',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    sessionSelector: _ => `countIf(conversion='goal') as ${_.id}`,
    default: () => 0 as number,
    getValue: ({ session }) => session.totalGoalConversion,
  }),
  new FictionAnalyticsCol({
    key: 'totalConversion',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    sessionSelector: _ => `countIf(conversion='conversion') as ${_.id}`,
    default: () => 0 as number,
    getValue: ({ session }) => session.totalConversion,
  }),
  new FictionAnalyticsCol({
    key: 'hasGoalConversion',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    sessionSelector: _ =>
      `if(session_totalGoalConversion > 0, 1, 0) as ${_.id}`,
    default: () => 0 as 0 | 1,
    getValue: ({ session }) => session.hasGoalConversion,
  }),
  new FictionAnalyticsCol({
    key: 'hasConversion',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    sessionSelector: _ => `if(session_totalConversion > 0, 1, 0) as ${_.id}`,
    default: () => 0 as 0 | 1,
    getValue: ({ session }) => session.hasConversion,
  }),
  new FictionAnalyticsCol({
    key: 'eventCount',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    sessionSelector: _ => `uniq(eventId) as ${_.id}`,
    default: () => 0 as number,
    getValue: ({ session }) => session.eventCount,
  }),
]

export function getSessionQuerySelectors(): string[] {
  return sessionFields
    .map((_) => {
      return _.sessionSelector
        ? _.sessionSelector({ key: _.key, id: `session_${_.key}` })
        : undefined
    })
    .filter(Boolean) as string[]
}

export const eventsTable = new FictionAnalyticsTable({ tableKey: 'fiction_event', columns: eventFields })

export const sessionsTable = new FictionAnalyticsTable({ tableKey: 'fiction_session', columns: sessionFields })

export function isSessionField(field: keyof EventParams) {
  const found = eventFields.find(f => f.key === field)
  return found?.sessionSelector ?? false
}

export const allTables = [eventsTable, sessionsTable]

type CreateTuple<T extends readonly FictionAnalyticsCol[]> = {
  [P in keyof T]: T[P] extends FictionAnalyticsCol<infer X, infer Q> ? [X, Q] : never
}[number]

type TupleToObject<T extends [string, unknown]> = {
  [P in T[0]]: T extends [P, infer B] ? B : never
}

export type CreateAnalyticsObjectType<T extends readonly FictionAnalyticsCol[]> = TupleToObject<CreateTuple<T>>

export type EventParams = CreateAnalyticsObjectType<typeof eventFields>

export type SessionEvent = Partial<EventParams> & {
  sessionId: string
  orgId: string
  anonymousId: string
  isOpened: boolean
}

export type SessionParams = CreateAnalyticsObjectType<typeof sessionFields>

export interface SessionStarted {
  sessionId: string
  anonymousId: string
  isOpened: boolean
}
export type ReferralParams = CreateAnalyticsObjectType<typeof referralFields>
