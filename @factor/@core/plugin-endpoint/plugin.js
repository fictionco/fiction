import qs from "qs"
export default Factor => {
  return new class {
    constructor() {
      this.init()
    }

    init() {
      this.urlBase = Factor.$config.serverlessUrl
    }

    serializer(params) {
      return qs.stringify(params)
    }

    async headers() {
      const headers = {}
      const tokenId = await Factor.$auth.getRequestBearerToken()

      if (tokenId) {
        headers.Authorization = `Bearer ${tokenId}`
      }

      return headers
    }

    async request(params) {
      let response = {}

      params.uid = params.uid ? params.uid : Factor.$user.uid()

      const { uid, action = false, endpoint = "" } = params

      const rurl = `${this.urlBase}/${endpoint}`

      if (uid) {
        if (!action) {
          console.error(`${endpoint} Endpoint requires an action method.`)
        }

        let r = {}
        try {
          const headers = await this.headers()
          console.log("Header", headers)
          r = await Factor.$http.post(rurl, params, { headers })
        } catch (error) {
          if (error.message.includes("Network Error")) {
            console.error(`[SERVER NOT FOUND - ENDPOINT ${endpoint}:${action}]`)
          } else {
            console.error("[SERVER]", error)
          }
        }

        if (r.data) {
          response = r.data
        }

        const { error } = response
        if (error) {
          const { report } = params
          const { stack, message } = error
          const err = message ? console.error(`[EP] ` + message) : console.error(error)
          err.stack = stack

          Factor.$notify.error({
            message: report ? message : "There was an issue with a server request."
          })
          throw err
        }
      }

      return response
    }
  }()
}
