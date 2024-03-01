import {
  subscribeEvent,
  dailyCounter,
  shouldHandleMessage,
  setup as setupUtils,
  PassedEventFields,
} from "@kaption/service-utils"
import express from "express"
import { logger } from "@factor/api"
import { initializeSessions } from "./sessionInit"
import { eventBuffer } from "./sessionEventBuffer"

/**
 * Initialize the manager server
 */
export const setup = async (): Promise<void> => {


  await Promise.all([setupUtils(), initializeSessions()])


  subscribeEvent(
    "saveEvents",
    async (params ): Promise<void> => {
      const { messageId, data } = params

      const events = data as PassedEventFields[]

      const shouldHandle = await shouldHandleMessage(messageId)

      if (!shouldHandle) return

      events.forEach((event) => {
        const projectId = event.projectId
        eventBuffer().add(event)
        dailyCounter({ projectId, addOne: true, item: "event" }).catch(
          (error) => {
            logger.log({
              level: "error",
              description: "daily counter",
              data: error,
            })
          },
        )
      })
    },
  )

  const port = process.env.PORT ?? "3200"
  const server = express()
  server.use("/", (request, response) => {
    response.status(200).send("ok").end()
  })

  server.listen(, () => {
    logger.log({
      level: "info",
      context: "@kaption/service-data",
      description: `up @port:${port}`,
    })
  })
}
