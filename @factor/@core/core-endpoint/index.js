import qs from "qs"
export default Factor => {
  return new (class {
    constructor() {
      this.endpointBase = "/endpoints"
    }

    serializer(params) {
      return qs.stringify(params)
    }

    async headers() {
      const headers = {}

      if (Factor.$auth) {
        const tokenId = await Factor.$auth.getToken()

        if (tokenId) {
          headers.Authorization = `Bearer ${tokenId}`
        }
      }

      return headers
    }

    async request({ id, method, params = {} }) {
      let response = {}

      const requestPath = `${this.endpointBase}/${id}`

      if (!method) {
        console.error(`Endpoint request to ${id} requires a method.`)
      }

      let r = {}
      try {
        const headers = await this.headers()

        r = await Factor.$http.post(requestPath, { method, params }, { headers })
      } catch (error2) {
        if (error2.message.includes("Network Error")) {
          console.error(`[Factor Server 404 - ENDPOINT ${endpoint}:${action}]`)
        } else {
          console.error("[Factor Server]", error2.message)
        }
      }

      if (r.data) {
        response = r.data
      }

      const { error } = response
      if (error) {
        const { report } = params
        const { stack, message } = error
        const err = message ? new Error(`[Factor Endpoint] ` + message) : new Error(error)
        err.stack = stack

        Factor.$events.$emit("error", {
          message: report ? message : "There was an issue with a server request."
        })
        throw err
      }

      return response
    }
  })()
}
