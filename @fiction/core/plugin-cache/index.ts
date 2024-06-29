import { Redis } from 'ioredis'
import type { FictionPluginSettings } from '../plugin.js'
import { FictionPlugin } from '../plugin.js'
import { EnvVar, vars } from '../plugin-env/index.js'
import { convertKeyCase, safeDirname, shortId, uuid } from '../utils/index.js'

export { Redis }

vars.register(() => [new EnvVar({ name: 'REDIS_URL' })])

export interface JSendMessage {
  status: 'success' | 'error' | 'event'
  messageType: string
  data?: any
  message?: string
}

type FictionCacheSettings = {
  redisUrl?: string
} & FictionPluginSettings

interface SubscriptionMessage<U extends MessageData> {
  pubsubId: string
  orgId: string
  sentFrom: string
  data: U['data']
  topic: U['topic']
}

type SubscriptionCallback<U extends MessageData> = (
  params: SubscriptionMessage<U>,
) => void | Promise<void>

export interface MessageData {
  data: Record<string, unknown>
  topic: string
}

export class FictionCache extends FictionPlugin<FictionCacheSettings> {
  connectionUrl?: URL
  redisConnections: Record<string, Redis> = {}
  subCallbacks: Record<string, (p: any) => any> = {}
  private publisher?: Redis
  private subscriber?: Redis
  private primaryCache?: Redis
  idd = shortId()
  initialized = false

  constructor(settings: FictionCacheSettings) {
    super('FictionCache', { root: safeDirname(import.meta.url), ...settings })

    if (this.settings.redisUrl)
      this.connectionUrl = new URL(this.settings.redisUrl)

    this.fictionEnv.events.on('shutdown', async () => this.close())
  }

  str(data: Record<string, unknown>) {
    return JSON.stringify(convertKeyCase(data, { mode: 'snake' }))
  }

  obj<T = unknown>(str?: string | null) {
    return str ? (convertKeyCase(JSON.parse(str), { mode: 'camel' }) as T) : undefined
  }

  async close() {
    Object.values(this.redisConnections).forEach(r => r.disconnect())
  }

  init() {
    if (this.fictionEnv?.isApp.value)
      return

    if (!this.connectionUrl)
      throw new Error('no redis connection url')

    this.primaryCache = this.getRedisConnection({ id: 'primaryCache' })

    const logUrl = new URL(this.connectionUrl.toString())
    logUrl.password = this.connectionUrl.password ? '--sensitive--' : ''
    this.log.info('creating redis cache', { data: { url: logUrl.toString() } })
    this.initialized = true
  }

  async getVal<T extends Record<string, unknown>>(key: string): Promise<T | undefined> {
    const cache = this.getCache()

    if (!cache)
      throw new Error(`no cache (getVal)`)

    const r = await cache.get(key)

    return this.obj<T>(r)
  }

  async setVal<T extends Record<string, unknown>>(key: string, val: T, ttl = 60 * 60): Promise<void> {
    const cache = this.getCache()

    if (!cache)
      throw new Error('no cache (setVal)')

    await cache.set(key, this.str(val), 'EX', ttl)
  }

  getCache(): Redis | undefined {
    if (this.fictionEnv?.isApp.value) {
      this.log.error('dont use cache in app')
      return
    }

    if (!this.primaryCache) {
      if (!this.initialized) {
        this.init()
      }
      else {
        this.log.error('no primary cache', { data: { initialized: this.initialized, connectionUrl: this.connectionUrl } })
        return
      }
    }
    return this.primaryCache
  }

  getRedisConnection = (options: { id: string }): Redis | undefined => {
    const { id } = options

    if (!this.redisConnections[id]) {
      if (!this.connectionUrl) {
        this.log.warn(`could not create ${id} redis connection - no url`)
        return
      }
      const url = this.connectionUrl

      const connectionInfo = {
        port: Number.parseInt(url.port),
        host: url.hostname,
        username: url.username,
        password: url.password,
      }

      const connection = new Redis({
        ...connectionInfo,
        connectTimeout: 12_000,
        maxRetriesPerRequest: 2,
        // family: 6,
        showFriendlyErrorStack: true,
        retryStrategy: (times): number => Math.min(times * 100, 5000),
        reconnectOnError: (error): boolean => {
          ;[/READONLY/, /ETIMEDOUT/].forEach((targetError) => {
            if (targetError.test(error.message))
              return true
          })

          return false
        },
      })

      connection.on('connect', () => {
        this.log.info(`redis connection [${id} - ${connection.status}]`)
      })

      this.redisConnections[id] = connection
    }

    return this.redisConnections[id]
  }

  initPubSub() {
    this.publisher = this.getRedisConnection({ id: 'pubSubPublisher' })
    this.subscriber = this.getRedisConnection({ id: 'pubSubSubscriber' })
    this.subscriber?.on('message', async (key: string, message: string) => {
      if (this.subCallbacks[key]) {
        try {
          const rawParsed = JSON.parse(message)
          const parsed = convertKeyCase(rawParsed, { mode: 'camel' })

          await this.subCallbacks[key](parsed)
        }
        catch (error) {
          this.log.error(`pubsub subscription error @${key}`, { error })
        }
      }
    })
  }

  publish<U>(args: {
    key: string
    topic: string
    data: U
    orgId: string
    sentFrom: string
  }): void {
    const { key, data, orgId, sentFrom, topic } = args
    const msg = this.str({ topic, data, pubsubId: uuid(), orgId, sentFrom })

    this.publisher?.publish(key, msg).catch(console.error)
  }

  async subscribe<S extends MessageData>(
    key: string,
    cb: SubscriptionCallback<S>,
  ): Promise<void> {
    await this.subscriber?.subscribe(key)

    this.subCallbacks[key] = cb as (p: any) => any
  }

  /**
   * In distributed env prevents multiple servers from handling a message
   */
  async messageIsHandled(messageId: string): Promise<boolean> {
    const r = await this.primaryCache?.get(`pub:${messageId}`)

    if (r) {
      return true
    }
    else {
      await this.primaryCache?.set(`pub:${messageId}`, 1, 'EX', 60) // ttl 60 seconds
      return false
    }
  }

  redisKey = <T extends string = string>(type: T, ...args: string[]): string => {
    return `${[type, ...args].join(':')}`
  }
}
