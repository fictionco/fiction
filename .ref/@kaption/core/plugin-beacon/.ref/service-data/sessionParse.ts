import { isNewVisitor } from '@kaption/engine/endpointMap'

import UAParser from 'ua-parser-js'
import dayjs from 'dayjs'
import lodash from 'lodash'
import { getDeviceType, objectId } from '@factor/api'
import type { ProjectPrivate } from '@kaption/engine/typesProject'
import type {
  EventConfig,
  NoExtraKeys,
  PassedEventFields,
  SessionConfig,
  SessionConsistent,
  SessionConsistentEnriched,
  SessionFields,
  SocketMessageDataItem,
} from '@kaption/service/fields'
import {
  allFieldKeys,
  sessionConsistentKeys,
  sessionKeys,
  sharedKeys,
} from '@kaption/service/fields'
import { TheReferrerUtility } from '../../referrer'
import { onlyAllowedKeys, standardUrl } from '../../utils/utils'
import { getGeo } from './sessionGeo'
import { dailyCounter } from './cacheProject'
import { eventBuffer } from './sessionEventBuffer'

/**
 * Create standard fields shared between events and sessions
 * These fields are created when the sessions starts and fetched and added to events
 */
export async function createStandardFields(config: SessionConfig, site?: ProjectPrivate): Promise<Partial<SessionConsistentEnriched>> {
  const { clientId, projectId, language, userAgent, width, url, v } = config

  // sometimes referrers have trailing slashes, de-dupe
  const referrer = config.referrer.replace(/\/$/, '')

  const { organizationId = '' } = site || {}

  // Get SYNC variables
  const { hostname: domain } = new URL(url)
  const { os, browser } = new UAParser(userAgent).getResult()
  const sessionId = objectId()

  const [geo, referralParams, __isNew] = await Promise.all([
    getGeo(config.ip),
    TheReferrerUtility.getReferralParameters(referrer, url),
    isNewVisitor({ clientId, projectId }),
  ])

  const isNew: 1 | 0 = __isNew ? 1 : 0

  const timestamp = new Date().toISOString()

  const standardFields = {
    sign: 1,
    v,
    sessionId,
    projectId,
    organizationId,
    timestamp,
    clientId,
    domain,
    language,
    referrer,
    os: os.name as string,
    browser: browser.name as string,
    deviceType: getDeviceType(width),
    isNew,
    ...geo,
    ...referralParams,
  } as const

  // make sure no random fields try and enter db
  return onlyAllowedKeys(standardFields, allFieldKeys)
}
/**
 * Gets the standard field values from a session
 */
export function fieldsFromSession(session: Partial<SessionFields>, event: EventConfig): SessionConsistent & Partial<SessionConsistentEnriched> {
  const takeKeys
    = event.eventName === 'session'
      ? sessionKeys
      : event.eventName === 'init'
      || (event.eventName === 'exit' && event.pageLoad === 'hard')
        ? sharedKeys
        : sessionConsistentKeys

  const fields: Record<string, any> = {}
  takeKeys.forEach((key) => {
    if (session[key])
      fields[key] = session[key]
  })

  return fields as SessionConsistent & Partial<SessionConsistentEnriched>
}
/**
 * Handle events that are sent from the client
 */
export async function saveEvents({
  projectId,
  memorySession,
  session,
  events,
}: {
  projectId: string
  memorySession?: Partial<SessionFields>
  session: Partial<SessionFields>
  events: EventConfig[]
}): Promise<void> {
  // for event counts,
  // use the stored session instead of updated one if it is passed
  const { viewNo = 0, eventNo = 0 } = memorySession ?? session
  const fullEvents: PassedEventFields[] = events.map(
    (event: EventConfig): PassedEventFields => {
      const { url } = event

      // Take information from session, don't override original referrer info
      const standardFields = fieldsFromSession(session, event)

      const cleaned = onlyAllowedKeys(
        lodash.omit(event, ['screen', 'url', 'referrer']),
        allFieldKeys,
      )

      const pathname = standardUrl({ url })

      const finalEvent: NoExtraKeys<typeof cleaned, PassedEventFields> = {
        eventId: objectId(),
        pathname,
        viewNo: cleaned.eventName === 'view' ? viewNo + 1 : 0,
        eventNo: eventNo + 1,
        ...standardFields,
        ...cleaned,
      }

      return finalEvent
    },
  )

  for (const fullEvent of fullEvents) {
    eventBuffer().add(fullEvent)
    await dailyCounter({ projectId, addOne: true, item: 'event' })
  }
}

async function parseEventsToSessionData(args: {
  newEvents?: EventConfig[]
  session: Partial<SessionFields>
}): Promise<Partial<SessionFields>> {
  const { newEvents = [], session = {} } = args
  const { events = [], viewNo = 0, eventNo = 0, startTime } = session

  const allEvents = [...events, ...newEvents].filter(_ => _.eventName)

  return {
    duration: dayjs().diff(dayjs(startTime), 'second'),
    events: allEvents,
    eventList: allEvents.map(e => e.eventName),
    viewNo: viewNo + newEvents.filter(_ => _.eventName === 'view').length,
    eventNo: eventNo + newEvents.length,
  }
}
/**
 * Creates a new session from configuration and event data
 */
export async function createNewSession({
  config,
  events,
  project,
}: SocketMessageDataItem): Promise<Partial<SessionFields>> {
  const { url } = config

  const standardFields = await createStandardFields(config, project)

  const pathname = standardUrl({ url })
  const { timestamp } = standardFields
  const compiled = await parseEventsToSessionData({
    newEvents: events,
    session: standardFields,
  })
  return {
    ...standardFields,
    entryPage: pathname,
    exitPage: pathname,
    startTime: timestamp,
    endTime: timestamp,
    ...compiled,
  }
}
/**
 * Update an existing session with latest data from events
 */
export async function getUpdatedSession(session: Partial<SessionFields>, { config, events = [] }: SocketMessageDataItem): Promise<Partial<SessionFields>> {
  const { url } = config

  const pathname = standardUrl({ url })

  const timestamp = new Date().toISOString()

  const newEvents = events.filter(ev => ev.eventName !== 'stat')

  const compiled = await parseEventsToSessionData({
    newEvents,
    session,
  })

  return {
    ...session,
    timestamp,
    endTime: timestamp,
    exitPage: pathname,
    ...compiled,
  }
}
