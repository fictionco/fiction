import qs from "qs"
export default Factor => {
  return new (class {
    constructor() {
      this.endpointBase = "/_api"
    }

    serializer(params) {
      return qs.stringify(params)
    }

    async headers() {
      const headers = {}

      const tokenId = await Factor.$user.token()

      if (tokenId) {
        headers.Authorization = `Bearer ${tokenId}`
      }

      return headers
    }

    async request({ id, method, params = {} }) {
      const requestPath = `${this.endpointBase}/${id}`

      try {
        if (!method) {
          Factor.$error.throw(500, `Endpoint request to ${id} requires a method.`)
        }

        const headers = await this.headers()

        const {
          data: { result, error }
        } = await Factor.$http.post(requestPath, { method, params }, { headers })

        if (error) {
          const { statusCode, description, stackTrace } = error
          Factor.$error.throw(statusCode, description, { stackTrace })
        }

        return result
      } catch (error) {
        Factor.$error.notify(error)
      }
    }
  })()
}
