import { FictionPlugin, WriteBuffer, dayjs, groupBy, objectId } from '@fiction/core'
import type { FictionEvent } from '../tracking'
import type { SessionEvent, SessionStarted } from '../tables'
import { eventFields } from '../tables'
import { ReferrerUtility, getGeo, parseUa, standardUrl } from './utils'
import type { FictionBeaconSettings } from './index.js'

export class SessionManager extends FictionPlugin<FictionBeaconSettings> {
  checkExpiredIntervalMs = this.settings.checkExpiredIntervalMs || 5000
  sessionExpireAfterMs = this.settings.sessionExpireAfterMs || 60 * 30 * 1000
  bufferIntervalMs = this.settings.bufferIntervalMs || 1000

  cache = () => this.settings.fictionCache.getCache()
  redisKey = this.settings.fictionCache.redisKey<'page' | 'session' | 'expiration'>
  referrerUtility = new ReferrerUtility({ fictionCache: this.settings.fictionCache })
  processedSessions = 0
  saveBuffer = new WriteBuffer<SessionEvent>({
    fictionEnv: this.fictionEnv,
    name: 'sessionSave',
    flush: async (events) => {
      const promises = [
        this.settings.fictionClickHouse.saveData({ data: events }),
      ]

      await Promise.all(promises)
    },
    limit: 10_000,
    flushIntervalMs: this.bufferIntervalMs,
  })

  constructor(settings: FictionBeaconSettings) {
    super('SessionManager', settings)
  }

  init() {
    if (this.fictionEnv.isApp.value)
      return

    const data = { checkExpiredIntervalMs: this.checkExpiredIntervalMs, sessionExpireAfterMs: this.sessionExpireAfterMs }
    this.log.info('running expiry check', { data })
    const inter = setInterval(async () => (await this.checkForExpiredSessions()), this.checkExpiredIntervalMs)

    inter.unref() // don't keep process alive

    this.fictionEnv.events.on('cleanup', () => clearInterval(inter))
  }

  async getOrStartSession(anonymousId: string): Promise<SessionEvent | SessionStarted> {
    const memorySession = await this.cacheSession({ _action: 'get', anonymousId })

    if (memorySession) {
      return memorySession
    }
    else {
      const sessionId = objectId()

      const session = { sessionId, anonymousId, isOpened: false }

      await this.cacheSession({ _action: 'set', anonymousId, session })

      return session
    }
  }

  /**
   * Entry point for sessions from request
   */
  async processRawEvents(events: FictionEvent[]): Promise<SessionEvent[]> {
    const groupedEvents = groupBy<Record<string, FictionEvent[]>>(events, 'anonymousId')

    const promises = Object.entries(groupedEvents).map(
      async ([anonymousId, rawEvents]): Promise<SessionEvent[]> => {
        const activeSession = await this.getOrStartSession(anonymousId)

        const events = await this.loadEvents({ rawEvents })

        let session: SessionEvent | undefined
        let saveEvents: SessionEvent[] = []

        // isOpened allows for sessionId creation external
        // to actually creating data for full session (referrer, geo, etc)
        if (!activeSession || !activeSession.isOpened) {
          const sessionId = activeSession?.sessionId || objectId()

          session = await this.createSession(rawEvents, sessionId)

          // this.log.info("session created", { data: { session, activeSession } })

          if (!session) {
            this.log.error('no anonymousId for session', { data: { events, rawEvents } })
            return saveEvents
          }

          const { properties: _unused, ...rest } = rawEvents[0]

          events.push({ ...rest, event: 'init', gen: 'core', type: 'internal', anonymousId, orgId: session.orgId })
        }
        else {
          session = this.updateSession({ session: activeSession as SessionEvent, events })
        }

        saveEvents = await this.getSaveEvents({ session, events })

        await this.cacheSession({ _action: 'set', anonymousId, session })

        return saveEvents
      },
    )

    const saveEventsBatches = await Promise.all(promises)

    const saveEvents = saveEventsBatches.flat()

    return saveEvents
  }

  async getSaveEvents(params: { session: SessionEvent, events: FictionEvent[] }) {
    const { session, events } = params
    let { viewNo = 0, eventNo = 0 } = session

    const x = session.anonymousId
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
          ? f.getValue({ event, session: session as Record<string, string | number | boolean>, key })
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

  /**
   * manage page view events which are updated via stat events
   * stat events are NOT stored, they update cached view events
   */
  loadEvents = async (params: { rawEvents: FictionEvent[] }): Promise<FictionEvent[]> => {
    const { rawEvents } = params
    const events: FictionEvent[] = []

    for (const ev of rawEvents) {
      const key = this.redisKey('page', ev.anonymousId)

      // if new view event, clear the cache of old view with last data
      if (ev.event === 'view') {
        const memoryPage = await this.cache()?.get(key)
        const memoryPageEvent = memoryPage
          ? (JSON.parse(memoryPage) as FictionEvent)
          : undefined
        if (memoryPageEvent)
          events.push(memoryPageEvent)
      }

      if (ev.event === 'stat' || ev.event === 'view') {
        // store view/stat events in cache to handle updating while on page
        // this allows compilation of on page data

        const memoryPage = JSON.stringify({ ...ev, event: 'view' })
        await this.cache()?.set(key, memoryPage, 'EX', 60 * 60)
      }
      else {
        events.push(ev)
      }
    }
    return events
  }

  cacheSession = async (params: { _action: 'get' | 'set', anonymousId: string, session?: SessionEvent | SessionStarted }): Promise<SessionEvent | undefined> => {
    const { _action, anonymousId } = params
    const key = this.redisKey('session', anonymousId)
    if (_action === 'get') {
      const r = await this.cache()?.get(key)

      return r ? (JSON.parse(r)) : undefined
    }
    else if (_action === 'set') {
      const { session } = params

      if (!session)
        throw new Error('no session to set')

      await this.cache()?.set(key, JSON.stringify(session))

      // sets score for client ID to now
      // https://redis.io/commands/ZADD
      await this.cache()?.zadd(this.redisKey('expiration'), +Date.now(), anonymousId)
    }
  }

  updateSession(params: { session: SessionEvent, events: FictionEvent[] }): SessionEvent {
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
      duration: startedAt ? d().diff(d.unix(startedAt), 'second') : 0,
      viewNo: Math.max(newViewNo, 0), // prevent negative
      eventNo: Math.max(newEventNo, 0), // prevent negative
    }

    const url = rev.map(e => e.context?.page?.url).find(Boolean) ?? ''
    if (url)
      out.exitPage = standardUrl({ url, part: 'pathname' })

    return out
  }

  createSession = async (events: FictionEvent[], sessionId: string): Promise<SessionEvent | undefined> => {
    this.log.info('create session', { data: { events, sessionId } })

    const event = events.find(e => e.anonymousId)

    if (!event)
      return

    this.processedSessions++

    const { anonymousId, orgId, context: { locale, page = {}, library, rawIp, timezone, isFake } = {} } = event

    const { version } = library || {}

    const rawReferrer = page.referrer || ''

    // sometimes urls/referrers have trailing slashes, de-dupe
    const referrer = rawReferrer.replace(/\/$/, '') ?? ''
    const url = page.url?.replace(/\/$/, '') ?? ''

    // Get SYNC variables
    const { origin = '' } = url ? new URL(url) : {}
    const { os, browser, deviceType } = parseUa(event)

    const [geo, referralParams, totalSessionsResponse]
      = await Promise.all([
        getGeo(rawIp),
        this.referrerUtility.getReferralParameters(referrer, url),
        this.settings.fictionClickHouse.queries.GetTotalSessions.serve(
          { anonymousId, orgId },
          { server: true },
        ),
      ])

    const pathname = standardUrl({ url, part: 'pathname' })
    const timestamp = dayjs().unix()
    const totalSessions = totalSessionsResponse?.data ?? 0
    const isReturning: 0 | 1 = totalSessions > 0 ? 1 : 0

    const session: SessionEvent = this.updateSession({
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

  checkForExpiredSessions = async (): Promise<string[]> => {
    if (this.fictionEnv.isApp.value)
      return []

    const cache = this.cache()
    if (!cache)
      throw new Error('no cache')

    const range = +Date.now() - this.sessionExpireAfterMs
    const expireKey = this.redisKey('expiration')
    const redisQuery = cache
      .multi()
      .zrangebyscore(expireKey, 0, range)
      .zremrangebyscore(expireKey, 0, range)

    const r = (await redisQuery.exec()) ?? []

    const results = r.map(val => val[1])

    const [expiredAnonIds] = results as [string[], number]

    if (expiredAnonIds.length > 0)
      expiredAnonIds.forEach(anonymousId => this.expireSession(anonymousId))

    return expiredAnonIds
  }

  /**
   * Gets the cached 'view' event and deletes it after
   */
  getFinalViewEvent = async (
    anonymousId: string,
  ): Promise<FictionEvent | undefined> => {
    const cache = this.cache()
    if (!cache)
      throw new Error('no cache (getFinalViewEvent)')
    const key = this.redisKey('page', anonymousId)
    const r = await cache.get(key)
    const data = r ? (JSON.parse(r) as FictionEvent) : undefined
    await cache.del(key)
    return data
  }

  expireSession = async (anonymousId: string): Promise<void> => {
    const cache = this.cache()
    if (!cache)
      throw new Error('no cache (expireSession)')

    const session = await this.cacheSession({ _action: 'get', anonymousId })

    if (!session)
      return

    const { sessionId } = session

    this.log.info(`expire session`, { data: { sessionId, anonymousId } })

    const orgId = session.orgId

    const events: FictionEvent[] = []

    const viewEvent = await this.getFinalViewEvent(anonymousId)

    if (viewEvent)
      events.push(viewEvent)

    events.push({ event: 'session', gen: 'core', type: 'internal', orgId, anonymousId })

    const saveEvents = await this.getSaveEvents({ session, events })

    this.saveBuffer.batch(saveEvents)

    await cache.del(this.redisKey('session', anonymousId))
    this.log.info(`publish expire session`, { data: { session } })
  }
}
