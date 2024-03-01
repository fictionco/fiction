/** server-only-file */
import { logger, uuid } from '@factor/api'
import type IORedis from 'ioredis'
import { getRedisConnection } from './cacheRedis'
import { getStore } from './cacheStore'

let __publisher: IORedis.Redis
let __subscriber: IORedis.Redis

export interface JSendMessage {
  status: 'success' | 'error' | 'event'
  messageType: string
  data?: any
  message?: string
}

export class PubSub<T extends string, U> {
  private publisher: IORedis.Redis
  private subscriber: IORedis.Redis
  constructor() {
    this.publisher = getRedisConnection({ id: 'pubSubPublisher' })
    this.subscriber = getRedisConnection({ id: 'pubSubSubscriber' })
  }

  publish(event: T, data: U): void {
    const msg = JSON.stringify({ data, messageId: uuid() })

    this.publisher
      .publish(event, msg)
      .catch(error => console.error('pubsub error', error))
  }

  subscribe(
    event: T,
    callback: (params: { messageId: string, data: U }) => void | Promise<void>,
  ): void {
    this.subscriber.on('message', async (channel: string, message: string) => {
      if (event === channel) {
        try {
          await callback(JSON.parse(message) as { messageId: string, data: U })
        }
        catch (error) {
          logger.log({
            level: 'error',
            description: `pubsub error at ${event}`,
            data: error,
          })
        }
      }
    })

    this.subscriber
      .subscribe(event)
      .catch(error => console.error('pubsub error', error))
  }
}

/**
 * Publish a global redis event
 * Useful for event based communication between services
 */
export function publishEvent(event: string, data: unknown): void {
  if (!__publisher)
    __publisher = getRedisConnection({ id: 'pubSubPublisher' })
}
/**
 * Publish a redis event that will get relayed to the client
 * associated with the passed clientId
 */
export function sendMessageToClient(clientId: string, data: JSendMessage): void {
  publishEvent('notifyClient', { clientId, data })
}

export function subscribeEvent(event: string, callback: (params: {
  messageId: string
  data: unknown
}) => void | Promise<void>): void {
  if (!__subscriber)
    __subscriber = getRedisConnection({ id: 'pubSubSubscriber' })

  __subscriber.on('message', async (channel: string, message: string) => {
    if (event === channel) {
      try {
        await callback(
          JSON.parse(message) as { messageId: string, data: unknown },
        )
      }
      catch (error) {
        logger.log({
          level: 'error',
          description: `pubsub error at ${event}`,
          data: error,
        })
      }
    }
  })

  __subscriber
    .subscribe(event)
    .catch(error => console.error('pubsub error', error))
}

export async function shouldHandleMessage(messageId: string): Promise<boolean> {
  const redisStore = await getStore()

  const r = await redisStore.get(`pub:${messageId}`)

  if (r) {
    return false
  }
  else {
    await redisStore.set(`pub:${messageId}`, 1, 'EX', 60) // ttl 60 seconds
    return true
  }
}
