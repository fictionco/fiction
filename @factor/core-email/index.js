import Factor from "@factor/core"
import { endpointRequest } from "@factor/endpoint"
export default () => {
  return new (class {
    constructor() {}

    async request(method, params) {
      return await endpointRequest({ id: "email", method, params })
    }
  })()
}
