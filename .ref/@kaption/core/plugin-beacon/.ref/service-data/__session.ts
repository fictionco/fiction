import { logger, objectId, throttle } from '@factor/api'
import { isNewVisitor } from '@kaption/engine/endpointMap'
import dayjs from 'dayjs'
import type { KaptionEvent } from '@kaption/client/types'
import type {
  PassedEventFields,
  SessionConsistentEnriched,
  SessionFields,
} from '@kaption/service/fields'
import {
  allFieldKeys,
} from '@kaption/service/fields'
import { parseDeviceCharacteristics } from '../../@suites/analytics/service/device'
import { onlyAllowedKeys, standardPathname } from '../../utils/utils'
import { publishEvent } from './cachePubsub'
import { TheReferrerUtility } from './referrer'
import { getGeo } from './.ref/service-data/sessionGeo'
import {
  getCurrentPageActivityEvent,
  getMemorySession,
  updateCurrentPageActivity,
  updateMemorySession,
} from './cacheStore'
import { dailyCounter, getActiveProject } from './cacheProject'
import { getEventFields } from './sessionEvent'

let eventBuffer: PassedEventFields[] = []
const queue = throttle(() => {
  // Publish event with tracking data
  if (eventBuffer && eventBuffer.length > 0) {
    publishEvent('saveEvents', eventBuffer)

    eventBuffer = []
  }
}, 1000)

/**
 * Create standard fields shared between events and sessions
 * These fields are created when the sessions starts and fetched and added to events
 */
export async function sessionCommonFields(event: KaptionEvent): Promise<Partial<SessionConsistentEnriched>> {
  const {
    anonymousId,
    projectId,
    context: { locale, page = {}, library, ip } = {},
  } = event

  const { version } = library || {}

  const sessionId = objectId()

  // sometimes urls/referrers have trailing slashes, de-dupe
  const referrer = page.referrer?.replace(/\/$/, '') ?? ''
  const url = page.url?.replace(/\/$/, '') ?? ''

  // Get SYNC variables
  const { hostname: domain = '' } = url ? new URL(url) : {}
  const { os, browser, deviceType } = parseDeviceCharacteristics(event)

  const [geo, referralParams, __isNew, project] = await Promise.all([
    getGeo(ip),
    TheReferrerUtility.getReferralParameters(referrer, url),
    isNewVisitor({ clientId: anonymousId, projectId }),
    getActiveProject({ projectId }),
  ])

  const { organizationId = '' } = project || {}

  const isNew: 1 | 0 = __isNew ? 1 : 0

  const timestamp = new Date().toISOString()

  const standardFields = {
    sign: 1,
    v: version,
    sessionId,
    projectId,
    organizationId,
    timestamp,
    clientId: anonymousId,
    domain,
    language: locale,
    referrer,
    os,
    browser,
    deviceType,
    isNew,
    ...geo,
    ...referralParams,
  } as const

  // make sure no random fields try and enter db
  return onlyAllowedKeys(standardFields, allFieldKeys)
}

export async function saveEvents({
  memorySession,
  session,
  events,
}: {
  projectId: string
  memorySession?: Partial<SessionFields>
  session: Partial<SessionFields>
  events: KaptionEvent[]
}): Promise<void> {
  // for event counts,
  // use the stored session instead of updated one if it is passed
  const { viewNo = 0, eventNo = 0 } = memorySession ?? session
  const fullEvents: PassedEventFields[] = events.map(
    (event: KaptionEvent): PassedEventFields => {
      event.eventNo = eventNo + 1

      if (event.event === 'view')
        event.viewNo = viewNo + 1

      const eventFields = getEventFields(event, session)

      return eventFields
    },
  )

  eventBuffer = [...eventBuffer, ...fullEvents]

  queue()
}

export async function refineTrackedEvents(args: {
  events: KaptionEvent[]
}): Promise<KaptionEvent[]> {
  const { events } = args
  const out: KaptionEvent[] = []

  for (const ev of events) {
    const eventName = ev.event
    if (eventName === 'stat') {
      await updateCurrentPageActivity(ev.anonymousId, ev)
    }
    else if (eventName === 'view') {
      const exitEvent = await getCurrentPageActivityEvent(ev.anonymousId)
      if (exitEvent)
        out.push(exitEvent)

      out.push(ev)
    }
    else {
      out.push(ev)
    }
  }

  return out
}

async function parseEventsToSessionData(args: {
  newEvents?: KaptionEvent[]
  session: Partial<SessionFields>
}): Promise<Partial<SessionFields>> {
  const { newEvents = [], session = {} } = args
  const { eventList = [], viewNo = 0, eventNo = 0, startTime } = session

  const eventNames = newEvents.map(_ => _.event).filter(Boolean) as string[]

  return {
    duration: dayjs().diff(dayjs(startTime), 'second'),
    eventList: [...eventList, ...eventNames],
    viewNo: viewNo + eventNames.filter(_ => _ === 'view').length,
    eventNo: eventNo + newEvents.length,
  }
}

export async function getUpdatedSession(session: Partial<SessionFields>, events: KaptionEvent[]): Promise<Partial<SessionFields>> {
  if (events.length === 0)
    return session

  const timestamp = new Date().toISOString()

  const newEvents = events.filter(ev => ev.event !== 'stat')

  const compiled = await parseEventsToSessionData({
    newEvents,
    session,
  })

  const updatedSession = {
    ...session,
    timestamp,
    endTime: timestamp,
    ...compiled,
  }

  const exitUrl = [...events]
    .reverse()
    .map(_ => _.context?.page?.url)
    .find(Boolean)

  if (exitUrl) {
    const pathname = standardPathname(exitUrl)

    updatedSession.exitPage = pathname
  }

  return updatedSession
}

export async function createNewSession(args: {
  event: KaptionEvent
}): Promise<Partial<SessionFields>> {
  const { event } = args
  const url = event.context?.page?.url ?? ''
  const { projectId } = event

  const standardFields = await sessionCommonFields(event)

  const pathname = standardPathname(url)
  const { timestamp } = standardFields

  dailyCounter({ projectId, addOne: true, item: 'session' }).catch((error) => {
    logger.log({ level: 'error', description: 'daily counter', data: error })
  })

  return {
    ...standardFields,
    entryPage: pathname,
    exitPage: pathname,
    startTime: timestamp,
    endTime: timestamp,
  }
}
/**
 * Gets existing session, and adds supplementary events
 * Then Saves events after ensuring appropriate fields
 */
export async function handleSessionEvents(args: {
  events: KaptionEvent[]
}): Promise<void> {
  const { events } = args

  if (events.length === 0)
    return

  const { anonymousId, projectId } = events[0]

  if (!projectId || !anonymousId) {
    return logger.log({
      level: 'error',
      description: 'projectId missing on event',
      data: { events },
    })
  }

  const memorySession = await getMemorySession(anonymousId)

  let initialSession: Partial<SessionFields>

  if (!memorySession) {
    const contextEvent = events.find(_ => _.context)
    if (!contextEvent) {
      return logger.log({
        level: 'error',
        description: 'context needed to start session',
        data: { events },
      })
    }

    initialSession = await createNewSession({ event: contextEvent })
    events.push({ event: 'init', anonymousId, projectId })
  }
  else {
    initialSession = memorySession
  }

  // always update the session with counts, duration, list
  const session = await getUpdatedSession(initialSession, events)

  const trackedEvents = await refineTrackedEvents({ events })

  if (trackedEvents && trackedEvents.length > 0) {
    await saveEvents({
      projectId,
      memorySession,
      session,
      events: trackedEvents,
    })
  }

  await updateMemorySession(anonymousId, session)
}
