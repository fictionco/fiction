import express from 'express'
import { logger } from '@factor/api'
import type { EventData } from '@kaption/service/fields'
import { setupClickhouseDb } from '@kaption/service/dbClickhouse'
import { dailyCounter } from './cacheProject'
import { setupPostgresDb } from './dbPostgres'

import { shouldHandleMessage, subscribeEvent } from './cachePubsub'
import { initializeSessions } from './sessionInit'
import { eventBuffer } from './sessionEventBuffer'

export * from './aws'
export * from './cache'
export * from './cacheProject'
export * from './cachePubsub'
export * from './cacheStore'
export * from '@kaption/service/dbClickhouse'
export * from './billingUsage'
export * from '@kaption/service/fields'
export * from './utils'

export async function setup(): Promise<void> {
  await Promise.all([
    setupClickhouseDb(),
    setupPostgresDb(),
    initializeSessions(),
  ])

  subscribeEvent('saveEvents', async (params): Promise<void> => {
    const { messageId, data } = params

    const events = data as EventData[]

    const shouldHandle = await shouldHandleMessage(messageId)

    if (!shouldHandle)
      return

    events.forEach((event) => {
      const projectId = event.projectId
      eventBuffer.add(event)
      dailyCounter({ projectId, addOne: true, item: 'event' }).catch(error =>
        console.error('counter err', error),
      )
    })
  })

  const port = process.env.PORT ?? '3200'
  const server = express()
  server.use('/', (request, response) => {
    response.status(200).send('ok').end()
  })

  server.listen(port, () => {
    logger.log({
      level: 'info',
      context: '@kaption/service-data',
      description: `up @port:${port}`,
    })
  })
}
