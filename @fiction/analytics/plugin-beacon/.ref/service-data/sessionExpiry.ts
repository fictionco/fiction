import type { KaptionEvent } from '@kaption/client/types'
import { logger } from '@factor/api'
import {
  expireCacheKey,
  getCurrentPageActivityEvent,
  getMemorySession,
  getStore,
  removeSocketSession,
  sessionCacheKey,
} from './cacheStore'
import { serviceSetting } from './utils'
import { sessionBuffer } from './sessionEventBuffer'
import { publishEvent, sendMessageToClient } from './cachePubsub'
import { saveEvents } from './sessionParse'

/**
 * When a session expires, save the final data and clear it in memory
 * @remarks - this is called when the native redis keyspace expire event is called
 */
export async function expireSession(anonymousId: string): Promise<void> {
  const store = await getStore()
  const session = await getMemorySession(anonymousId)
  const redisKey = sessionCacheKey(anonymousId)

  if (!session)
    return

  const projectId = session.projectId as string

  const events: KaptionEvent[] = []

  const finalExitEvent = await getCurrentPageActivityEvent(anonymousId)
  if (finalExitEvent)
    events.push(finalExitEvent)

  events.push({ event: 'session', projectId, anonymousId })

  await saveEvents({ projectId, session, events })

  sessionBuffer().add(session)

  // remove the session from memory/redis
  const numberRemoved = await store.del(redisKey)

  await removeSocketSession(anonymousId)

  const { sessionId } = session
  const logType = numberRemoved < 1 ? 'error' : 'debug'
  logger.log({
    level: logType,
    description: `expire session: ${session.eventList?.length ?? 'no'} events`,
  })

  publishEvent('expireSession', session)

  sendMessageToClient(anonymousId, {
    status: 'success',
    messageType: 'expireSession',
    data: { anonymousId, sessionId },
  })
}

/**
 * Expire sessions in ONE minute for dev, 30 minutes for production
 */
export function sessionExpireSeconds(): number {
  const ms = serviceSetting<number>('sessionSeconds') ?? 60 * 30

  return ms
}

export async function checkExpiredSessions(): Promise<string[]> {
  const cacheKey = expireCacheKey()
  const cache = await getStore()
  const now = +Date.now()
  const range = now - sessionExpireSeconds() * 1000
  const redisQuery = cache
    .multi()
    .zrangebyscore(cacheKey, 0, range)
    .zremrangebyscore(cacheKey, 0, range)

  const r = await redisQuery.exec()

  const results = r.map(val => val[1] as unknown)

  const [expiredClientIds] = results as [string[], number]

  if (expiredClientIds.length > 0)
    expiredClientIds.forEach(clientId => expireSession(clientId))

  return expiredClientIds
}

export function initializeExpiryLoop(): void {
  setInterval(async () => {
    await checkExpiredSessions()
  }, 5000)
}
