import { dayjs, objectId } from '@factor/api'

import type { CreateObjectType } from '../utils/db'
import { KaptionDbCol, KaptionDbTable } from '../utils/db'
import { standardUrl } from './utils'

const baseFields = [
  new KaptionDbCol({
    key: 'event',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'the primary name for the event',
    indexOn: true,
    default: () => '',
    getValue: ({ event }) => event.event,
  }),
  new KaptionDbCol({
    key: 'gen',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'LowCardinality(String)',
    description: 'the source type of event (core, user)',
    default: () => '' as 'core' | 'user' | 'internal',
    getValue: ({ event }) => event.gen,
  }),
  new KaptionDbCol({
    key: 'isCore',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    description: 'is an core event',
    default: () => '',
    getValue: ({ event }) => {
      return event.gen === 'core' || event.gen === 'internal' ? 1 : 0
    },
  }),
  new KaptionDbCol({
    key: 'isInternal',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    description: 'is an internal event (e.g. session, init)',
    default: () => '',
    getValue: ({ event }) => (event.gen === 'internal' ? 1 : 0),
  }),
  new KaptionDbCol({
    key: 'isCustom',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    description: 'is an custom user event',
    default: () => '',
    getValue: ({ event }) => (event.gen === 'user' || !event.gen ? 1 : 0),
  }),
  new KaptionDbCol({
    key: 'type',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'LowCardinality(String)',
    description:
      'the track type of event (track, page, identify, group, session, debug)',
    default: () => '',
    getValue: ({ event }) => event.type,
  }),

  new KaptionDbCol({
    default: () => '',
    key: 'sessionId',
    indexOn: true,
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    sessionSelector: _ => `${_.key} as ${_.id}`,
    getValue: ({ session }) => session.sessionId,
  }),

  new KaptionDbCol({
    key: 'anonymousId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    sessionSelector: ({ key, id }) => `any(${key}) as ${id}`,
    description: 'random ID assigned to client and stored in cookie',
    indexOn: true,
    default: () => '',
    getValue: ({ session }) => session.anonymousId,
  }),
  new KaptionDbCol({
    key: 'userId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    sessionSelector: ({ key, id }) => `anyIf(${key}, event='session') as ${id}`,
    description: 'random ID assigned to client and stored in cookie',
    indexOn: true,
    default: () => '',
    getValue: ({ session }) => session.userId,
  }),
  new KaptionDbCol({
    key: 'projectId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    description: 'the projectId associated with this event',
    indexOn: true,
    default: () => '',
    getValue: ({ session }) => session.projectId,
  }),
  new KaptionDbCol({
    default: () => '',
    key: 'organizationId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    description: 'the organizationId associated with this event',
    indexOn: true,
    getValue: ({ session }) => session.organizationId,
  }),
  new KaptionDbCol({
    default: () => Date.now(),
    key: 'sentAt',
    create: ({ schema, column }) => schema.dateTime(column.pgKey),
    clickHouseType: 'DateTime',
    description: 'timestamp for event sent from client',
    getValue: ({ event }) => dayjs(event.sentAt).unix(),
  }),
  new KaptionDbCol({
    key: 'receivedAt',
    create: ({ schema, column }) => schema.dateTime(column.pgKey),
    clickHouseType: 'DateTime',
    description: 'timestamp for event received by server',
    default: () => Date.now(),
    getValue: ({ event }) => dayjs(event.receivedAt).unix(),
  }),
  new KaptionDbCol({
    key: 'timestamp',
    create: ({ schema, column }) => schema.dateTime(column.pgKey),
    clickHouseType: 'DateTime',
    sessionSelector: _ => `min(${_.key}) as ${_.id}`,
    description: 'timestamp for event or session',
    default: () => Date.now() as number | string,
    getValue: ({ event }) => dayjs(event.timestamp).unix(),
  }),
  new KaptionDbCol({
    default: () => '',
    key: 'reason',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'LowCardinality(String)',
    description: 'why this event was thrown',
    getValue: ({ event }) => event.properties?.reason,
  }),
  new KaptionDbCol({
    default: () => '',
    key: 'conversion',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'LowCardinality(String)',
    description: 'type of conversion',
    getValue: ({ event }) => event.properties?.conversion,
  }),
  new KaptionDbCol({
    default: () => '',
    key: 'category',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    getValue: ({ event }) => event.properties?.category,
  }),
  new KaptionDbCol({
    default: () => '',
    key: 'label',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    getValue: ({ event }) => event.properties?.label,
  }),
  new KaptionDbCol({
    default: () => '',
    key: 'action',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    getValue: ({ event }) => event.properties?.action,
  }),
  new KaptionDbCol({
    key: 'selector',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'selector (e.g. dom) that triggered event',
    default: () => '',
    getValue: ({ event }) => event.properties?.selector,
  }),

  new KaptionDbCol({
    key: 'value',
    create: ({ schema, column }) => schema.float(column.pgKey),
    clickHouseType: 'Float32',
    default: () => 0,
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.value,
  }),
  new KaptionDbCol({
    default: () => ({} as Record<string, unknown> | string),
    key: 'context',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'context where event was triggered',
    getValue: ({ event }) => JSON.stringify(event.context || {}),
  }),
  new KaptionDbCol({
    key: 'meta',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    clickHouseType: 'String',
    default: () => ({} as Record<string, unknown> | string),
    getValue: ({ event }) => JSON.stringify(event.meta || {}),
  }),
  new KaptionDbCol({
    key: 'debug',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    clickHouseType: 'String',
    default: () => ({} as Record<string, unknown> | string),
    getValue: ({ event }) => JSON.stringify(event.debug || {}),
  }),

  new KaptionDbCol({
    key: 'traits',
    create: ({ schema, column }) => schema.jsonb(column.pgKey),
    clickHouseType: 'String',
    default: () => ({} as Record<string, unknown> | string),
    getValue: ({ event }) => JSON.stringify(event.traits || {}),
  }),
  new KaptionDbCol({
    key: 'trace',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'stack trace / reproduction trace',
    default: () => '',
    getValue: ({ event }) => event.properties?.trace,
  }),
  new KaptionDbCol({
    key: 'pathname',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'url pathname',
    indexOn: true,
    default: () => '',
    getValue: ({ event }) => {
      const url = event.context?.page?.url
      return standardUrl({ url, part: 'pathname' })
    },
  }),
  new KaptionDbCol({
    default: () => '',
    key: 'origin',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'url origin',
    getValue: ({ event }) => {
      const url = event.context?.page?.url
      return standardUrl({ url, part: 'origin' })
    },
  }),
  new KaptionDbCol({
    default: () => '',
    key: 'url',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'url origin',
    getValue: ({ event }) => {
      const url = event.context?.page?.url ?? ''
      return url.replace(/\/$/, '')
    },
  }),
  new KaptionDbCol({
    default: () => '',
    key: 'search',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'url search',
    getValue: ({ event }) => {
      const url = event.context?.page?.url
      return standardUrl({ url, part: 'search' })
    },
  }),
  new KaptionDbCol({
    default: () => '',
    key: 'os',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'LowCardinality(String)',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    description: 'operating system',
    getValue: ({ session }) => session.os,
  }),
  new KaptionDbCol({
    key: 'browser',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'LowCardinality(String)',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => '',
    getValue: ({ session }) => session.browser,
  }),
  new KaptionDbCol({
    default: () => '',
    key: 'deviceType',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'LowCardinality(String)',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.deviceType,
  }),
  new KaptionDbCol({
    default: () => '',
    key: 'locale',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'LowCardinality(String)',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.locale,
  }),

  new KaptionDbCol({
    default: () => '',
    key: 'ip',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.ip,
  }),
  new KaptionDbCol({
    key: 'isReturning',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    default: () => 0 as 1 | 0,
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.isReturning,
  }),

  new KaptionDbCol({
    key: 'isFake',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    default: () => 0 as 1 | 0,
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.isFake,
  }),

  new KaptionDbCol({
    key: 'timezone',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'LowCardinality(String)',
    default: () => '',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.timezone,
  }),
  new KaptionDbCol({
    key: 'duration',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'total duration from start to end of session',
    default: () => 0,
    sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`,
    getValue: ({ event, session }) =>
      event.event === 'session' ? session.duration : undefined,
  }),
  new KaptionDbCol({
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
  new KaptionDbCol({
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
  new KaptionDbCol({
    default: () => '',
    key: 'entryPage',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'first page viewed in session',
    sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`,
    getValue: ({ event, session }) =>
      event.event === 'session' ? session.entryPage : undefined,
  }),
  new KaptionDbCol({
    default: () => '',
    key: 'exitPage',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'last page viewed in session',
    sessionSelector: _ => `anyIf(${_.key}, event='session') as ${_.id}`,
    getValue: ({ event, session }) =>
      event.event === 'session' ? session.exitPage : undefined,
  }),

  new KaptionDbCol({
    default: () => '',
    key: 'channel',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'source of the event (e.g. tag)',
    getValue: ({ event }) => event?.channel,
  }),
  new KaptionDbCol({
    key: 'scrollTotal',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'scrolls at exit',
    default: () => 0,
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event?.properties?.scrollTotal,
  }),
  new KaptionDbCol({
    key: 'keypressTotal',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'presses at exit',
    default: () => 0,
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.keypressTotal,
  }),
  new KaptionDbCol({
    key: 'clickTotal',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'clicks at exit',
    default: () => 0,
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.clickTotal,
  }),
  new KaptionDbCol({
    key: 'touchTotal',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'touches at exit',
    default: () => 0,
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.touchTotal,
  }),
  new KaptionDbCol({
    key: 'moveTotal',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'moves at exit',
    default: () => 0,
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.moveTotal,
  }),

  new KaptionDbCol({
    key: 'engageDuration',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'seconds engaged and triggering events',
    default: () => 0,
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.engageDuration,
  }),
  new KaptionDbCol({
    key: 'replayDuration',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'recorded duration for replay',
    default: () => 0,
    sessionSelector: _ => `sum(${_.key}) as ${_.id}`,
    getValue: ({ event }) => event.properties?.replayDuration,
  }),
  new KaptionDbCol({
    key: 'scrollDepth',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'Float32',
    description: 'percent of scrolled page at exit',
    default: () => 0,
    sessionSelector: _ =>
      `avgIf(${_.key}, event='view' AND isFinite(${_.key})) as ${_.id}`,
    getValue: ({ event }) => event.properties?.scrollDepth,
  }),
  new KaptionDbCol({
    key: 'sessionNo',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'how many sessions this user has had',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => 0,
    getValue: ({ session }) => session.sessionNo,
  }),
  new KaptionDbCol({
    key: 'viewNo',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'which page view in session associated with',
    default: () => 0,
    getValue: ({ event }) => event.viewNo,
  }),
  new KaptionDbCol({
    key: 'eventNo',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    description: 'which incremental event number in session',
    default: () => 0,
    getValue: ({ event }) => event.eventNo,
  }),
  new KaptionDbCol({
    default: () => '',
    key: 'version',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    description: 'client version used',
    getValue: ({ session }) => session.version,
  }),
  new KaptionDbCol({
    key: 'eventId',
    default: () => objectId(),
    create: ({ schema, column, db }) => {
      schema
        .string(column.pgKey)
        .primary()
        .defaultTo(db.raw(`generate_object_id()`))
    },
    clickHouseType: 'String',
    getValue: ({ event }) => event.eventId,
  }),
  new KaptionDbCol({
    default: () => '',
    key: 'messageId',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    description: 'id for event batch where event arrived',
    getValue: ({ event }) => event?.messageId,
  }),
] as const

const geoFields = [
  new KaptionDbCol({
    key: 'countryCode',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    clickHouseType: 'LowCardinality(String)',
    default: () => '',
    getValue: ({ session }) => session.countryCode,
  }),
  new KaptionDbCol({
    key: 'regionName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    clickHouseType: 'LowCardinality(String)',
    default: () => '',
    getValue: ({ session }) => session.regionName,
  }),
  new KaptionDbCol({
    key: 'cityName',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    clickHouseType: 'LowCardinality(String)',
    default: () => '',
    getValue: ({ session }) => session.cityName,
  }),
  new KaptionDbCol({
    key: 'latitude',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    clickHouseType: 'Float32',
    default: () => 0,
    getValue: ({ session }) => session.latitude,
  }),
  new KaptionDbCol({
    key: 'longitude',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    clickHouseType: 'Float32',
    default: () => 0,
    getValue: ({ session }) => session.longitude,
  }),
] as const

const referralFields = [
  new KaptionDbCol({
    default: () => '',
    key: 'referrer',
    create: ({ schema, column }) => schema.string(column.pgKey),
    clickHouseType: 'String',
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    getValue: ({ session }) => session.referrer,
  }),
  new KaptionDbCol({
    key: 'referralSource',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => '',
    getValue: ({ session }) => session.referralSource,
  }),
  new KaptionDbCol({
    key: 'referralCampaign',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => '',
    getValue: ({ session }) => session.referralCampaign,
  }),
  new KaptionDbCol({
    key: 'referralMedium',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => '',
    getValue: ({ session }) => session.referralMedium,
  }),
  new KaptionDbCol({
    key: 'referralTerm',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => '',
    getValue: ({ session }) => session.referralTerm,
  }),
  new KaptionDbCol({
    key: 'referralContent',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => '',
    getValue: ({ session }) => session.referralContent,
  }),
  new KaptionDbCol({
    key: 'referralTitle',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => '',
    getValue: ({ session }) => session.referralTitle,
  }),
  new KaptionDbCol({
    key: 'referralDescription',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => '',
    getValue: ({ session }) => session.referralDescription,
  }),
  new KaptionDbCol({
    key: 'referralCanonicalUrl',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => '',
    getValue: ({ session }) => session.referralCanonicalUrl,
  }),
  new KaptionDbCol({
    key: 'referralImage',
    create: ({ schema, column }) => schema.string(column.pgKey),
    sessionSelector: _ => `anyIf(${_.key}, event='init') as ${_.id}`,
    default: () => '',
    getValue: ({ session }) => session.referralImage,
  }),
] as const

export const eventFields = [
  ...baseFields,
  ...geoFields,
  ...referralFields,
] as const

const sessionFields = [
  ...eventFields.filter(f => f.sessionSelector),
  new KaptionDbCol({
    key: 'pageCount',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    sessionSelector: _ => `countIf(event='view') as ${_.id}`,
    default: () => 0,
    getValue: ({ session }) => session.pageCount,
  }),

  new KaptionDbCol({
    key: 'isClosed',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    sessionSelector: _ => `if(countIf(event='session') > 0, 1, 0) as ${_.id}`,
    default: () => 0 as 1 | 0,
    getValue: ({ session }) => session.isClosed,
  }),
  new KaptionDbCol({
    key: 'isBounce',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    sessionSelector: _ => `if(session_pageCount > 1, 0, 1) as ${_.id}`,
    default: () => 0 as 1 | 0,
    getValue: ({ session }) => session.isBounce,
  }),
  new KaptionDbCol({
    key: 'totalEvents',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    sessionSelector: _ => `count(*) as ${_.id}`,
    default: () => 0,
    getValue: ({ session }) => session.totalEvents,
  }),
  new KaptionDbCol({
    key: 'isRobot',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    sessionSelector: _ => `if(countIf(event='bot') > 0, 1, 0) as ${_.id}`,
    default: () => 0 as 1 | 0,
    getValue: ({ session }) => session.isRobot,
  }),
  new KaptionDbCol({
    key: 'hasReplay',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    sessionSelector: _ => `if(countIf(event='replay') > 0, 1, 0) as ${_.id}`,
    default: () => 0 as 1 | 0,
    getValue: ({ session }) => session.hasReplay,
  }),
  new KaptionDbCol({
    key: 'totalGoalConversion',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    sessionSelector: _ => `countIf(conversion='goal') as ${_.id}`,
    default: () => 0,
    getValue: ({ session }) => session.totalGoalConversion,
  }),
  new KaptionDbCol({
    key: 'totalConversion',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    sessionSelector: _ => `countIf(conversion='conversion') as ${_.id}`,
    default: () => 0,
    getValue: ({ session }) => session.totalConversion,
  }),
  new KaptionDbCol({
    key: 'hasGoalConversion',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    sessionSelector: _ =>
      `if(session_totalGoalConversion > 0, 1, 0) as ${_.id}`,
    default: () => 0 as 0 | 1,
    getValue: ({ session }) => session.hasGoalConversion,
  }),
  new KaptionDbCol({
    key: 'hasConversion',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt8',
    sessionSelector: _ => `if(session_totalConversion > 0, 1, 0) as ${_.id}`,
    default: () => 0 as 0 | 1,
    getValue: ({ session }) => session.hasConversion,
  }),
  new KaptionDbCol({
    key: 'eventCount',
    create: ({ schema, column }) => schema.integer(column.pgKey),
    clickHouseType: 'UInt16',
    sessionSelector: _ => `uniq(eventId) as ${_.id}`,
    default: () => 0,
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

export const eventsTable = new KaptionDbTable({
  tableKey: 'kaption_event',
  columns: eventFields,
})

export const sessionsTable = new KaptionDbTable({
  tableKey: 'kaption_session',
  columns: sessionFields,
})

export function isSessionField(field: keyof EventParams) {
  const found = eventFields.find(f => f.key === field)
  return found?.sessionSelector ?? false
}

export const allTables = [eventsTable, sessionsTable]

export type EventParams = CreateObjectType<typeof eventFields>

export type SessionEvent = Partial<EventParams> & {
  sessionId: string
  projectId: string
  anonymousId: string
  isOpened: boolean
}

export type SessionParams = CreateObjectType<typeof sessionFields>

export interface SessionStarted {
  sessionId: string
  anonymousId: string
  isOpened: boolean
}
export type ReferralParams = CreateObjectType<typeof referralFields>
