import qs from "qs"
export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.add("initialize-app", () => {
        this.init()
      })
    }

    init() {
      this.endpointBase = Factor.$filters.apply("endpoints-base-url")
    }

    serializer(params) {
      return qs.stringify(params)
    }

    async headers() {
      const headers = {}

      if (Factor.$auth) {
        const tokenId = await Factor.$auth.getRequestBearerToken()

        if (tokenId) {
          headers.Authorization = `Bearer ${tokenId}`
        }
      }

      return headers
    }

    async request(params) {
      let response = {}

      params.uid = params.uid ? params.uid : Factor.$user.uid()

      const { action = false, endpoint = "" } = params

      const rurl = `${this.endpointBase}/${endpoint}`

      if (!action) {
        console.error(`${endpoint} Endpoint requires an action method.`)
      }

      let r = {}
      try {
        const headers = await this.headers()

        r = await Factor.$http.post(rurl, params, { headers })
      } catch (error2) {
        if (error2.message.includes("Network Error")) {
          console.error(`[Factor Server 404 - ENDPOINT ${endpoint}:${action}]`)
        } else {
          console.error("[Factor Server]", error2)
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
