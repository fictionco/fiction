import type { FictionAnalytics } from '@fiction/analytics'
import type { FictionEvent } from '@fiction/analytics/typesTracking'
import type { SessionEvent, SessionStarted } from '..'
import type { ReferrerUtility } from './referrer'
import { dayjs, groupBy, objectId } from '@fiction/core'
import { eventFields } from '..'
import { parseUa } from './device'
import { getGeo } from './geoIp'
import { standardUrl } from './utils'

export async function cacheSession(params: {
  fictionAnalytics: FictionAnalytics
  _action: 'get' | 'set'
  anonymousId: string
  session?: SessionEvent | SessionStarted
}): Promise<SessionEvent | undefined> {
  const { _action, anonymousId, fictionAnalytics } = params
  const key = fictionAnalytics.getCacheKey('session', anonymousId)
  const cache = fictionAnalytics.getCache()

  try {
    if (_action === 'get') {
      const r = await cache?.get(key)

      return r ? (JSON.parse(r)) : undefined
    }
    else if (_action === 'set') {
      const { session } = params

      if (!session)
        throw new Error('no session to set')

      await cache?.set(key, JSON.stringify(session))

      // sets score for client ID to now
      // https://redis.io/commands/ZADD
      await cache?.zadd(fictionAnalytics.getCacheKey('expiration'), +Date.now(), anonymousId)
    }
  }
  catch (error) {
    fictionAnalytics.log.error('error getting cacheSession', { error })
  }
}

export async function getOrStartSession(args: { anonymousId: string, fictionAnalytics: FictionAnalytics }): Promise<SessionEvent | SessionStarted> {
  const { anonymousId, fictionAnalytics } = args
  const memorySession = await cacheSession({ fictionAnalytics, _action: 'get', anonymousId })

  if (memorySession) {
    return memorySession
  }
  else {
    const sessionId = objectId()

    const session = { sessionId, anonymousId, isOpened: false }

    await cacheSession({ fictionAnalytics, _action: 'set', anonymousId, session })

    return session
  }
}

export function updateSession(params: { session: SessionEvent, events: FictionEvent[] }): SessionEvent {
  const { events = [], session } = params
  const { viewNo = 0, eventNo = 0, startedAt } = session
  const now = dayjs().unix()
  const rev = events.reverse()
  const lastEvent = rev.map(e => e.receivedAt)?.[0]
  const timestamp = lastEvent ? dayjs(lastEvent).unix() : now

  const d = dayjs
  const newViewNo = (viewNo) + events.filter(_ => _.event === 'view').length
  const newEventNo = (eventNo) + events.length
  const out = {
    ...session,
    timestamp,
    endedAt: timestamp,
    duration: startedAt ? d().diff(d.unix(startedAt as number), 'second') : 0,
    viewNo: Math.max(newViewNo, 0), // prevent negative
    eventNo: Math.max(newEventNo, 0), // prevent negative
  }

  const url = rev.map(e => e.context?.page?.url).find(Boolean) ?? ''
  if (url)
    out.exitPage = standardUrl({ url, part: 'pathname' })

  return out
}

export async function getSaveEvents(params: { session: SessionEvent, events: FictionEvent[] }) {
  const { session, events } = params
  let { viewNo = 0, eventNo = 0 } = session

  const newViews = events.filter(_ => _.event === 'view').length
  viewNo = Math.max(viewNo - newViews, 0)
  eventNo = Math.max(eventNo - events.length, 0)

  const saveEvents: SessionEvent[] = []
  events.forEach((event: FictionEvent): void => {
    if (event.event === 'view')
      viewNo++
    eventNo++

    event.eventId = objectId()
    event.viewNo = viewNo
    event.eventNo = eventNo

    const saveFields: Record<string, any> = {}

    eventFields.forEach((f) => {
      const key = f.key

      const v = f.getValue
        ? f.getValue({ event, session: session as Record<string, string | number | boolean | Record<string, string>>, key })
        : f.sessionSelector
          ? session[key]
          : undefined

      if (v !== undefined)
        saveFields[key] = v
    })

    saveEvents.push(saveFields as SessionEvent)
  })

  return saveEvents
}

export async function getReferralParams(args: { fictionAnalytics: FictionAnalytics, referrer: string, url: string }) {
  const { fictionAnalytics, referrer, url } = args

  let util: ReferrerUtility

  if (fictionAnalytics.referrerUtility) {
    util = fictionAnalytics.referrerUtility
  }
  else {
    const { ReferrerUtility } = await import('./referrer')
    util = fictionAnalytics.referrerUtility = new ReferrerUtility({ fictionCache: fictionAnalytics.settings.fictionCache })
  }

  return util.getReferralParameters(referrer, url)
}

export async function createSession(args: {
  events: FictionEvent[]
  sessionId: string
  fictionAnalytics: FictionAnalytics
}): Promise<SessionEvent | undefined> {
  const { events, sessionId, fictionAnalytics } = args

  fictionAnalytics.log.info('create session', { data: { events, sessionId } })

  const event = events.find(e => e.anonymousId)

  if (!event)
    return

  fictionAnalytics.processedSessions++

  const { anonymousId, orgId, context: { locale, page = {}, library, rawIp, timezone, isFake } = {} } = event

  const { version } = library || {}

  const rawReferrer = page.referrer || ''

  // sometimes urls/referrers have trailing slashes, de-dupe
  const referrer = rawReferrer.replace(/\/$/, '') ?? ''
  const url = page.url?.replace(/\/$/, '') ?? ''

  // Get SYNC variables
  const { origin = '' } = url ? new URL(url, 'https://no-origin-passed') : {}
  const { os, browser, deviceType } = parseUa(event)

  const [geo, referralParams, totalSessionsResponse] = await Promise.all([
    getGeo(rawIp),
    getReferralParams({ referrer, url, fictionAnalytics }),
    fictionAnalytics.queries.GetTotalSessions.serve({ anonymousId, orgId }, { server: true }),
  ])

  const pathname = standardUrl({ url, part: 'pathname' })
  const timestamp = dayjs().unix()
  const totalSessions = totalSessionsResponse?.data ?? 0
  const isReturning: 0 | 1 = totalSessions > 0 ? 1 : 0

  const session: SessionEvent = updateSession({
    events,
    session: {
      isOpened: true,
      anonymousId,
      sessionId,
      orgId,
      timestamp,
      origin,
      locale,
      referrer,
      os,
      browser,
      deviceType,
      timezone,
      ...geo,
      ...referralParams,
      version,
      entryPage: pathname,
      exitPage: pathname,
      startedAt: timestamp,
      endedAt: timestamp,
      viewNo: 0,
      eventNo: 0,
      isReturning,
      sessionNo: totalSessions + 1,
      isFake: isFake ? 1 : 0,
    },
  })

  return session
}

export async function expireSession(args: { anonymousId: string, fictionAnalytics: FictionAnalytics }): Promise<void> {
  const { anonymousId, fictionAnalytics } = args
  const cache = fictionAnalytics.getCache()
  if (!cache)
    throw new Error('no cache (expireSession)')

  const session = await cacheSession({ fictionAnalytics, _action: 'get', anonymousId })

  if (!session)
    return

  const { sessionId } = session

  fictionAnalytics.log.info(`expire session`, { data: { sessionId, anonymousId } })

  const orgId = session.orgId

  const events: FictionEvent[] = []

  const viewEvent = await getFinalViewEvent(args)

  if (viewEvent)
    events.push(viewEvent)

  events.push({ event: 'session', gen: 'core', type: 'internal', orgId, anonymousId })

  const saveEvents = await getSaveEvents({ session, events })

  fictionAnalytics.saveEventBuffer.batch(saveEvents)

  await cache.del(fictionAnalytics.getCacheKey('session', anonymousId))
  fictionAnalytics.log.info(`publish expire session (${fictionAnalytics.sessionExpireAfterMs}ms)`, { data: { session } })
}

export async function checkForExpiredSessions(args: { fictionAnalytics: FictionAnalytics }): Promise<string[]> {
  const { fictionAnalytics } = args
  if (fictionAnalytics.fictionEnv.isApp.value)
    return []

  const cache = fictionAnalytics.getCache()
  if (!cache)
    throw new Error('no cache')

  const range = +Date.now() - fictionAnalytics.sessionExpireAfterMs
  const expireKey = fictionAnalytics.getCacheKey('expiration')
  const redisQuery = cache
    .multi()
    .zrangebyscore(expireKey, 0, range)
    .zremrangebyscore(expireKey, 0, range)

  const r = (await redisQuery.exec()) ?? []

  const results = r.map(val => val[1])

  const [expiredAnonIds] = results as [string[], number]

  if (expiredAnonIds.length > 0) {
    fictionAnalytics.log.info('expired sessions', { data: { expiredAnonIds } })
    expiredAnonIds.forEach(async anonymousId => expireSession({ anonymousId, fictionAnalytics }))
  }

  return expiredAnonIds
}

export async function processRawEvents(args: { events: FictionEvent[], fictionAnalytics: FictionAnalytics }): Promise<SessionEvent[]> {
  const { events, fictionAnalytics } = args
  const groupedEvents = groupBy<Record<string, FictionEvent[]>>(events, 'anonymousId')

  const promises = Object.entries(groupedEvents).map(
    async ([anonymousId, rawEvents]): Promise<SessionEvent[]> => {
      const activeSession = await getOrStartSession({ anonymousId, fictionAnalytics })

      const events = await loadEvents({ fictionAnalytics, rawEvents, session: activeSession as SessionEvent })

      let session: SessionEvent | undefined
      const saveEvents: SessionEvent[] = []

      // isOpened allows for sessionId creation external
      // to actually creating data for full session (referrer, geo, etc)
      if (!activeSession || !activeSession.isOpened) {
        const sessionId = activeSession?.sessionId || objectId()

        session = await createSession({ events: rawEvents, sessionId, fictionAnalytics })

        // this.log.info("session created", { data: { session, activeSession } })

        if (!session) {
          fictionAnalytics.log.error('no anonymousId for session', { data: { events, rawEvents } })
          return saveEvents
        }

        const { properties: _unused, ...rest } = rawEvents[0]

        events.push({ ...rest, event: 'init', gen: 'core', type: 'internal', anonymousId, orgId: session.orgId })
      }
      else {
        session = updateSession({ session: activeSession as SessionEvent, events })
      }

      await cacheSession({ fictionAnalytics, _action: 'set', anonymousId, session })

      return await getSaveEvents({ session, events })
    },
  )

  const saveEventsBatches = await Promise.all(promises)

  const saveEvents = saveEventsBatches.flat()

  return saveEvents
}

export async function processAndSaveEvents(args: { events: FictionEvent[], fictionAnalytics: FictionAnalytics }): Promise<void> {
  const { fictionAnalytics } = args
  const saveEvents = await processRawEvents(args)
  fictionAnalytics.saveEventBuffer.batch(saveEvents)
}

export async function getFinalViewEvent(args: {
  anonymousId: string
  fictionAnalytics: FictionAnalytics
}): Promise<FictionEvent | undefined> {
  const { anonymousId, fictionAnalytics } = args

  const cache = fictionAnalytics.getCache()
  if (!cache)
    throw new Error('no cache (getFinalViewEvent)')
  const key = fictionAnalytics.getCacheKey('page', anonymousId)
  const r = await cache.get(key)
  const data = r ? (JSON.parse(r) as FictionEvent) : undefined
  await cache.del(key)
  return data
}

export async function loadEvents(params: {
  rawEvents: FictionEvent[]
  session: SessionEvent
  fictionAnalytics: FictionAnalytics
}): Promise<FictionEvent[]> {
  const { rawEvents, fictionAnalytics } = params
  const events: FictionEvent[] = []

  const cache = fictionAnalytics.getCache()

  for (const ev of rawEvents) {
    const key = fictionAnalytics.getCacheKey('page', ev.anonymousId)

    if (ev.event === 'view') {
      const memoryPage = await cache?.get(key)
      const memoryPageEvent = memoryPage ? (JSON.parse(memoryPage) as FictionEvent) : undefined
      if (memoryPageEvent)
        events.push(memoryPageEvent)
    }

    if (ev.event === 'stat' || ev.event === 'view') {
      const memoryPage = JSON.stringify({ ...ev, event: 'view' })
      await cache?.set(key, memoryPage, 'EX', 60 * 60)
    }
    else {
      events.push(ev)
    }
  }

  return events
}
