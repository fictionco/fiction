import { addCallback, pushToFilter } from "@factor/api/hooks"
import { EndpointItem } from "@factor/endpoint/types"
import { MiddlewareHandler } from "@factor/server/types"
export * from "@factor/endpoint"

export const addEndpoint = ({ id, handler }: EndpointItem): void => {
  addCallback({
    hook: "endpoints",
    key: id,
    callback: () => {
      return { id, handler }
    },
  })
}

/**
 * Add middleware to the Factor server
 * @param path - route to serve the middleware
 * @param middleware - express style middleware handler
 * @param key - unique key for the middleware (prevents double loading)
 */
export const addMiddleware = ({
  path,
  middleware,
  key,
}: {
  path: string | string[]
  middleware: MiddlewareHandler[]
  key?: string
}): void => {
  const pathKey = typeof path == "string" ? path : path.join("")
  key = key ? key : pathKey
  pushToFilter({ key, hook: "middleware", item: { path, middleware } })
}
