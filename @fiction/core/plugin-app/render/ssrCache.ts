import type { RunVars } from '../../inject'
import type { FictionCache } from '../../plugin-cache'
import type { RenderedHtmlParts } from '../types'
import { fastHash } from '../../utils'

export type SSRCacheSettings = {
  ttl?: number // Cache TTL in seconds
  keyPrefix?: string
  useLocalCache?: boolean // Enable in-memory cache alongside Redis
  maxLocalCacheSize?: number // Max number of entries in local cache
}

export class SSRCache {
  private readonly redisKeyPrefix: string
  private readonly localCache: Map<string, RenderedHtmlParts>
  private readonly ttl: number // seconds
  private readonly maxLocalCacheSize: number

  constructor(
    private readonly fictionCache: FictionCache,
    settings: SSRCacheSettings = {},
  ) {
    this.redisKeyPrefix = settings.keyPrefix || 'ssr:'
    this.ttl = settings.ttl || 3600 // 1 hour default
    this.maxLocalCacheSize = settings.maxLocalCacheSize || 1000
    this.localCache = settings.useLocalCache ? new Map() : new Map()
  }

  private getCacheKey(runVars: Partial<RunVars>): string {
    const { RUN_MODE, URL, RUNTIME_COMMIT } = runVars
    return fastHash({ RUN_MODE, URL, RUNTIME_COMMIT })
  }

  private getRedisKey(cacheKey: string): string {
    return `${this.redisKeyPrefix}${cacheKey}`
  }

  async get(runVars: Partial<RunVars>): Promise<RenderedHtmlParts | undefined> {
    const mode = runVars.RUN_MODE || 'prod'

    // Skip cache in dev/test modes
    if (mode !== 'prod') {
      return undefined
    }

    const cacheKey = this.getCacheKey(runVars)

    // Try local cache first
    const localValue = this.localCache.get(cacheKey)
    if (localValue) {
      return localValue
    }

    // Try Redis cache
    const redisValue = await this.fictionCache.getVal<RenderedHtmlParts>(
      this.getRedisKey(cacheKey),
    )

    // Update local cache if Redis had a hit
    if (redisValue && this.localCache.size < this.maxLocalCacheSize) {
      this.localCache.set(cacheKey, redisValue)
    }

    return redisValue
  }

  async set(runVars: Partial<RunVars>, value: RenderedHtmlParts): Promise<void> {
    const mode = runVars.RUN_MODE || 'prod'

    // Only cache in prod mode
    if (mode !== 'prod') {
      return
    }

    const cacheKey = this.getCacheKey(runVars)

    // Update Redis
    await this.fictionCache.setVal(
      this.getRedisKey(cacheKey),
      value,
      this.ttl,
    )

    // Update local cache if not full
    if (this.localCache.size < this.maxLocalCacheSize) {
      this.localCache.set(cacheKey, value)
    }
  }

  async invalidate(runVars: Partial<RunVars>): Promise<void> {
    const cacheKey = this.getCacheKey(runVars)

    // Remove from local cache
    this.localCache.delete(cacheKey)

    // Remove from Redis
    const redisKey = this.getRedisKey(cacheKey)
    await this.fictionCache.getCache()?.del(redisKey)
  }

  clear(): void {
    // Clear local cache
    this.localCache.clear()

    // Clear Redis cache (scan and delete keys with prefix)
    this.clearRedisCache().catch(console.error)
  }

  private async clearRedisCache(): Promise<void> {
    const redis = this.fictionCache.getCache()
    if (!redis)
      return

    let cursor = '0'
    const pattern = `${this.redisKeyPrefix}*`

    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        '100',
      )

      cursor = nextCursor

      if (keys.length) {
        await redis.del(...keys)
      }
    } while (cursor !== '0')
  }
}
