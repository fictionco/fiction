import { logger } from '@factor/api'
import IORedis from 'ioredis'

export function getRedisConnection(options: { id: string }): IORedis.Redis {
  if (!process.env.REDIS_URL)
    throw new Error('redis connection url not provided')

  const { id } = options
  const url = new URL(process.env.REDIS_URL)

  const connection = new IORedis({
    port: Number.parseInt(url.port),
    host: url.hostname,
    connectTimeout: 17_000,
    maxRetriesPerRequest: 4,
    retryStrategy: (times): number => Math.min(times * 30, 1000),
    reconnectOnError: (error): boolean => {
      const targetErrors = [/READONLY/, /ETIMEDOUT/]

      targetErrors.forEach((targetError) => {
        if (targetError.test(error.message))
          return true
      })

      return false
    },
  })

  connection.on('connect', () => {
    logger.log({
      level: 'info',
      context: `redis`,
      description: `[id:${id}] [status:${connection.status}]`,
    })
  })

  return connection
}
