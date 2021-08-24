import { addFilter } from "@factor/api"
import { EndpointConfig } from "@factor/types"

export const addEndpoint = ({ route, handler }: EndpointConfig): void => {
  const key = typeof route == "string" ? route : route.toString()

  addFilter({
    hook: "endpoints",
    key,
    callback: (_) => {
      const r = [..._, { route, handler }]

      return r
    },
  })
}
