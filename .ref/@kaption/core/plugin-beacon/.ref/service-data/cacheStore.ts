import type IORedis from 'ioredis'
import type { KaptionEvent } from '@kaption/client/types'
import type { EventConfig, SessionFields } from '@kaption/service/fields'
import { getRedisConnection } from './__cacheRedis'
let __store: IORedis.Redis
/**
 * Get the REDIS store that handles active sessions
 */
export async function getStore(): Promise<IORedis.Redis> {
  if (__store)
    return __store

  const client = getRedisConnection({ id: 'sessionStore' })

  __store = client
  return client
}

/**
 * Standard key format for Redis in-memory sessions
 */
export function sessionCacheKey(clientId: string): string {
  return `session:${clientId}`
}
export function socketCacheKey(clientId: string): string {
  return `socket:${clientId}`
}
export function pageStatCacheKey(clientId: string): string {
  return `page:${clientId}`
}
export function currentPageCacheKey(anonymousId: string): string {
  return `currentPage:${anonymousId}`
}
export function projectCacheKey(projectId: string, ...args: string[]): string {
  return `project:${projectId}:${args.join(':')}`
}
export function expireCacheKey(): string {
  return `expirationHandler`
}
export async function getSocketSession(clientId: string): Promise<Partial<SessionFields> | undefined> {
  const store = await getStore()
  const r = await store.get(socketCacheKey(clientId))

  return r ? (JSON.parse(r) as Partial<SessionFields>) : undefined
}
export async function updateSocketSession(clientId: string, data: Partial<SessionFields>): Promise<Partial<SessionFields> | undefined> {
  const store = await getStore()

  const sessionKey = socketCacheKey(clientId)

  await store.set(
    sessionKey,
    JSON.stringify({ clientId, ...data }),
    'EX',
    60 * 60 * 1,
  ) // expires 1 hour just in case
}
export async function removeSocketSession(clientId: string): Promise<Partial<SessionFields> | undefined> {
  const store = await getStore()
  await store.del(socketCacheKey(clientId))
}
/**
 * Gets an active session if it exists
 * @param clientId - the browser assigned client ID
 */
export async function getMemorySession(clientId: string): Promise<Partial<SessionFields> | undefined> {
  const store = await getStore()
  const r = await store.get(sessionCacheKey(clientId))

  return r ? (JSON.parse(r) as Partial<SessionFields>) : undefined
}

/**
 * Add the session into memory and update the TTL
 */
export async function updateMemorySession(clientId: string, session: Partial<SessionFields>): Promise<void> {
  const store = await getStore()
  const now = +Date.now()

  const sessionKey = sessionCacheKey(clientId)

  await store.set(sessionKey, JSON.stringify(session))

  // sets score for client ID to now
  // https://redis.io/commands/ZADD
  await store.zadd(expireCacheKey(), now, clientId)
}

export async function getCurrentPageActivityEvent(anonymousId: string): Promise<KaptionEvent | undefined> {
  const store = await getStore()
  const key = currentPageCacheKey(anonymousId)
  const r = await store.get(key)

  if (r) {
    const statEvent = JSON.parse(r) as KaptionEvent
    await store.del(key)
    return {
      ...statEvent,
      event: 'exit', // must come after
    }
  }
  else {}
}

/**
 * Add the session into memory and update the TTL
 */
export async function updateCurrentPageActivity(anonymousId: string, event: KaptionEvent): Promise<void> {
  const store = await getStore()

  const sessionKey = currentPageCacheKey(anonymousId)

  await store.set(sessionKey, JSON.stringify(event), 'EX', 60 * 60) // expires one hour just in case
}

export async function getExitEvent(clientId: string): Promise<EventConfig | undefined> {
  const store = await getStore()
  const key = pageStatCacheKey(clientId)
  const r = await store.get(key)

  if (r) {
    const statEvent = JSON.parse(r) as EventConfig
    await store.del(key)
    return {
      ...statEvent,
      eventName: 'exit', // must come after
    }
  }
  else {}
}

/**
 * Add the session into memory and update the TTL
 */
export async function updateMemoryPageStats(clientId: string, statEvent: EventConfig): Promise<void> {
  const store = await getStore()

  const sessionKey = pageStatCacheKey(clientId)

  await store.set(sessionKey, JSON.stringify(statEvent), 'EX', 60 * 60) // expires one hour just in case
}
