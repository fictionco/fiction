import { addCallback } from "@factor/tools/hooks"
import { EndpointItem } from "@factor/endpoint/types"

export const addEndpoint = ({ id, handler }: EndpointItem): void => {
  addCallback({
    hook: "endpoints",
    key: id,
    callback: () => {
      return { id, handler }
    }
  })
}
