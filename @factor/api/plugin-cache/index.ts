import Redis from 'ioredis'
import type { FactorPluginSettings } from '../plugin'
import { FactorPlugin } from '../plugin'
import type { FactorUser } from '../plugin-user'
import type { FactorServer } from '../plugin-server'
import type { FactorAws } from '../plugin-aws'
import type { FactorDb } from '../plugin-db'
import type { FactorEnv } from '../plugin-env'
import { EnvVar, vars } from '../plugin-env'

// import { JSendMessage } from "./types"

vars.register(() => [new EnvVar({ name: 'REDIS_URL' })])

type FactorCacheSettings = {
  redisConnectionUrl?: string
  factorServer: FactorServer
  factorAws?: FactorAws
  factorDb?: FactorDb
  factorUser?: FactorUser
  factorEnv: FactorEnv
} & FactorPluginSettings

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

export class FactorCache extends FactorPlugin<FactorCacheSettings> {
  connectionUrl?: URL
  factorEnv = this.settings.factorEnv
  factorServer = this.settings.factorServer
  factorAws = this.settings.factorAws
  factorDb = this.settings.factorDb
  queries = this.createQueries()
  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.factorServer,
    factorUser: this.settings.factorUser,
  })

  redisConnections: Record<string, Redis> = {}
  subCallbacks: Record<string, (p: any) => any> = {}
  private publisher?: Redis
  private subscriber?: Redis
  private primaryCache?: Redis
  idd = this.utils.shortId()
  constructor(settings: FactorCacheSettings) {
    super('cache', settings)

    if (this.settings.redisConnectionUrl)
      this.connectionUrl = new URL(this.settings.redisConnectionUrl)
  }

  str(data: Record<string, unknown>) {
    return JSON.stringify(this.utils.toSnakeCaseKeys(data))
  }

  obj<T = unknown>(str?: string | null) {
    return str ? (this.utils.camelKeys(JSON.parse(str)) as T) : undefined
  }

  init() {
    if (this.factorEnv.isApp.value)
      return

    if (!this.connectionUrl)
      throw new Error('no redis connection url')

    this.primaryCache = this.getRedisConnection({ id: 'primaryCache' })

    this.publisher = this.getRedisConnection({ id: 'pubSubPublisher' })
    this.subscriber = this.getRedisConnection({ id: 'pubSubSubscriber' })
    this.subscriber?.on('message', async (key: string, message: string) => {
      if (this.subCallbacks[key]) {
        try {
          const rawParsed = JSON.parse(message)
          const parsed = this.utils.camelKeys(rawParsed)

          await this.subCallbacks[key](parsed)
        }
        catch (error) {
          this.log.error(`pubsub subscription error @${key}`, { error })
        }
      }
    })

    const logUrl = new URL(this.connectionUrl.toString())
    logUrl.password = this.connectionUrl.password ? '--sensitive--' : ''
    this.log.info('creating redis cache', {
      data: { url: logUrl.toString() },
    })
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

  publish<U>(args: {
    key: string
    topic: string
    data: U
    orgId: string
    sentFrom: string
  }): void {
    const { key, data, orgId, sentFrom, topic } = args
    const msg = this.str({
      topic,
      data,
      pubsubId: this.utils.uuid(),
      orgId,
      sentFrom,
    })

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

  async getVal<T extends Record<string, unknown>>(
    key: string,
  ): Promise<T | undefined> {
    const cache = this.getCache()

    if (!cache)
      throw new Error('no cache')

    const r = await cache.get(key)

    return this.obj<T>(r)
  }

  async setVal<T extends Record<string, unknown>>(
    key: string,
    val: T,
    ttl = 60 * 60,
  ): Promise<void> {
    const cache = this.getCache()

    if (!cache)
      throw new Error('no cache')

    await cache.set(key, this.str(val), 'EX', ttl)
  }

  // get endpoints() {
  //   return Object.values(this.requests)
  // }

  getCache(): Redis | undefined {
    if (!this.primaryCache && !this.factorEnv.isApp.value) {
      this.log.error('no primary cache - missing REDIS_URL')
      return
    }
    return this.primaryCache
  }

  redisKey = (
    type:
      | 'session'
      | 'page'
      | 'project'
      | 'org'
      | 'expiration'
      | 'unfurl'
      | 'replay'
      | 'tag',

    ...args: string[]
  ): string => {
    return `${[type, ...args].join(':')}`
  }
}
