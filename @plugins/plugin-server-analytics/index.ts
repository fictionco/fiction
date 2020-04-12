import { addFilter, log } from "@factor/api"
import ua from "universal-analytics"
import { setting } from "@factor/api/settings"
import { EndpointRunningParams } from "@factor/endpoint/server"
import { MiddlewarePathConfig } from "@factor/server/middleware"

import { Request, Response } from "express"

export const setup = (): void => {
  const trackingId = setting("serverAnalytics.trackingId")

  /**
   * If no setting, then just abort with a warning
   */
  if (!trackingId) {
    log.warn("Server analytics account ID is not set (serverAnalytics.trackingId)")
    return
  }

  /**
   * Add an event for standard endpoint requests
   */
  if (setting("serverAnalytics.trackEndpointHits")) {
    addFilter({
      key: "serverAnalytics",
      hook: "endpoint-arguments",
      callback: (_arguments: EndpointRunningParams): EndpointRunningParams => {
        const { id, bearer, data } = _arguments
        const uid = bearer?._id || "anon"
        const visitor = ua(trackingId, { uid })
        const { method } = data
        visitor.event(`endpointRequest`, id, method).send()
        return _arguments
      },
    })
  }

  /**
   * Add a method to create an event by sending a get/post request to:
   * @param url: /__track_event__
   * @param query.event - event name
   * @param query.action - event action
   * @param query.label - event label
   */
  addFilter({
    key: "serverAnalytics",
    hook: "middleware",
    callback: (_: MiddlewarePathConfig[]): MiddlewarePathConfig[] => {
      _.push({
        path: "/__track_event__",
        middleware: [
          (request: Request, response: Response): void => {
            const { query, body } = request

            const { event = "ping", action = "No Action", label = "No Label" } = {
              ...body,
              ...query,
            }

            const visitor = ua(trackingId)

            visitor.event(event, action, label).send()

            response.send("sent").end()
          },
        ],
      })

      return _
    },
  })
}

setup()
