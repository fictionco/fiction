// import { logServiceStatus, subscribeEvent } from "@kaption/utils"
// import { CustomEventParams } from "@kaption/engine"
import express from 'express'
import { expireReplay, getStore, processData } from './data'

/**
 * Initialize the replay service
 */
export async function setup(): Promise<void> {
  const port = Number.parseInt(process.env.PORT ?? '3400')

  /**
   * async - initialize redis store connection
   */
  getStore().catch(error => console.error(error, 'initialize redis', error))

  /**
   * Subscribe to redis replayData events sent from ingest service
   */
  subscribeEvent(
    'replayData',
    async (replayData: CustomEventParams<'replayData'>): Promise<void> => {
      // replayData is batched by client
      const clientIds = Object.keys(replayData)

      const _p = clientIds.map(async (clientId) => {
        const dataItem = replayData[clientId] ?? {}

        await processData(dataItem)
      })

      await Promise.all(_p)
    },
  )
  /**
   * Handle replay save on session exp
   */
  subscribeEvent(
    'expireSession',
    async (session: CustomEventParams<'expireSession'>): Promise<void> => {
      await expireReplay(session)
    },
  )

  /**
   * For health check purposes
   */
  const server = express()
  server.use('/', (request, response) => {
    response.status(200).send('replay:ok').end()
  })

  server.listen(port, () => logServiceStatus({ service: 'replay', port }))
}
